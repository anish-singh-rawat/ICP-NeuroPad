use crate::proposal_route::{check_proposal_state, execute_proposal_on_required_vote};
use crate::types::{Dao, Proposals};
use crate::{guards::*, Comment, DaoGroup, Pagination, ProposalStakes, ReplayComment, ReplyCommentArgs};
use crate::{with_state, ProposalState, VoteParam};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::{self};
use ic_cdk::{query, update};
use sha2::{Digest, Sha256};
use std::collections::HashSet;

#[update(guard = prevent_anonymous)]
fn get_all_proposals(page_data: Pagination) -> Vec<Proposals> {
    with_state(|state| {
        let mut proposals: Vec<Proposals> = state
            .proposals
            .iter()
            .map(|(_, v)| v.clone()) 
            .collect();

        proposals.sort_by(|a, b| b.proposal_submitted_at.cmp(&a.proposal_submitted_at));

        let ending = proposals.len();

        if ending == 0 {
            return proposals;
        }

        let start = page_data.start as usize;
        let end = page_data.end as usize;
        if start < ending {
            let end = end.min(ending);
            return proposals[start..end].to_vec();
        }

        Vec::new() 
    })
}


#[query(guard=prevent_anonymous)]
fn get_my_proposal() -> Result<Vec<Proposals>, String> {
    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::new();

        for v in state.proposals.iter() {
            if v.1.created_by == api::caller() {
                proposals.push(v.1.clone());
            }
        }
        Ok(proposals)
    })
}

#[query(guard=prevent_anonymous)]
async fn get_proposal_by_id(proposal_id: String) -> Proposals {
    with_state(|state| state.proposals.get(&proposal_id).unwrap().clone())
}

#[query(guard=prevent_anonymous)]
async fn get_dao_detail() -> Dao {
    with_state(|state| {
        let mut dao = state.dao.clone();
        let unique_members: HashSet<candid::Principal> = dao.members.iter().cloned().collect();
        dao.members = unique_members.into_iter().collect();
        dao.members_count = dao.members.len() as u32;
        dao
    })
}

#[update(guard = prevent_anonymous)]
async fn comment_on_proposal(comment: String, proposal_id: String) -> Result<String, String> {
    let uuids = raw_rand().await.unwrap().0;
    let comment_id = format!("{:x}", Sha256::digest(&uuids));

    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            pro.comments_list.push(Comment {
                author_principal: ic_cdk::api::caller(),
                comment_id,
                comment_text: comment,
                created_at: ic_cdk::api::time(),
                likes: 0,
                replies: vec![],
            });
            pro.comments += 1;
            state.proposals.insert(proposal_id, pro.to_owned());
            Ok(String::from("Comment was sucessfully added"))
        }
        None => Err(String::from("Proposal does not exist.")),
    })
}

#[update(guard = prevent_anonymous)]
async fn reply_comment(args: ReplyCommentArgs) -> Result<String, String> {
    let commented_by = ic_cdk::api::caller();
    let proposal = match with_state(|state| state.proposals.get(&args.proposal_id)) {
        Some(val) => val,
        None => {
            return Err(String::from(
                "No proposal associated with the following proposal ID",
            ))
        }
    };

    let mut updated_comment_list = proposal.comments_list.clone();

    for comment in updated_comment_list.iter_mut() {
        if comment.comment_id == args.comment_id.clone() {
            comment.replies.push(ReplayComment {
                reply_comment: args.comment.clone(), 
                commented_by,
            });
            break;
        }
    }
    
    let updated_proposal = Proposals {
        comments: proposal.comments + 1,
        comments_list: updated_comment_list,
        ..proposal
    };

    with_state(|state| {
        state
            .proposals
            .insert(updated_proposal.proposal_id.clone(), updated_proposal)
    });

    Ok(String::from("Successfully commented on post"))
}

fn refresh_proposals(id: &String) {
    with_state(|state| match &mut state.proposals.get(&id) {
        Some(proposal) => {
            if check_proposal_state(&proposal.proposal_expired_at) {
                proposal.proposal_status = ProposalState::Expired;
                state.proposals.insert(id.clone(), proposal.to_owned());

                // Ok(format!("Updated {:?}", proposal))
            }
        }
        None => (),
    })
}

#[update(guard = prevent_anonymous)]
fn proposal_refresh() -> Result<String, String> {
    let mut ids: Vec<String> = Vec::new();

    with_state(|state| {
        ids = state.dao.proposal_ids.clone();
    });

    for id in ids.iter() {
        execute_add_proposals(id);
        refresh_proposals(id);
    }

    Ok("Refresh completed".to_string())
}

#[update(guard=vote_allow_dao_user_only)]
async fn vote(proposal_id: String, voting: VoteParam) -> Result<String, String> {
    check_voting_right(&proposal_id)?;

    let principal_id = api::caller();
    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            if pro.created_by != api::caller() {
              if pro.principal_of_action != api::caller()  {
                if  pro.token_to.map_or(true, |token_to| token_to != api::caller()) {
                if pro.proposal_status == ProposalState::Open {
                    if (pro.proposal_rejected_votes as u32 + pro.proposal_approved_votes as u32) < pro.required_votes {
                        if voting == VoteParam::Yes {
                            pro.approved_votes_list.push(principal_id);
                            pro.proposal_approved_votes += 1;
                            state.proposals.insert(proposal_id, pro.to_owned());
                            if (pro.proposal_rejected_votes as u32 + pro.proposal_approved_votes as u32) == pro.required_votes {
                                    execute_proposal_on_required_vote(state, pro.proposal_id.clone());
                            }
                            Ok(String::from("Successfully voted in favour of Proposal."))
                        } else {
                            pro.rejected_votes_list.push(principal_id);
                            pro.proposal_rejected_votes += 1;
                            state.proposals.insert(proposal_id, pro.to_owned());
                            if (pro.proposal_rejected_votes as u32 + pro.proposal_approved_votes as u32) == pro.required_votes {
                                    execute_proposal_on_required_vote(state, pro.proposal_id.clone());
                            }
                            Ok(String::from("Successfully voted against the proposal."))
                        }
                    }else{
                        Err(format!("The proposal received the maximum required votes"))
                    }
                } else {
                    Err(format!("Proposal has been {:?} ", pro.proposal_status))
                }
            }  else {
                    Err(String::from("Voting is restricted since this proposal belongs to you."))
                }
            } else {
                Err(String::from("Voting is restricted since this proposal belongs to you."))
            }
            }
            else{
                Err(String::from("you can't vote on your proposals"))
            }
        }
        None => Err(String::from("Proposal ID is invalid !")),
    })
}

#[query(guard=prevent_anonymous)]
fn search_proposal(proposal_id: String) -> Vec<Proposals> {
    let mut propo: Vec<Proposals> = Vec::new();

    with_state(|state| {
        for y in state.proposals.iter() {
            if y.1.proposal_id == proposal_id {
                propo.push(y.1)
            }
        }

        propo
    })
}

fn execute_add_proposals(id: &String) {
    with_state(|state| match state.proposals.get(&id) {
        Some(val) => {
            let is_completed = val.proposal_approved_votes + val.proposal_rejected_votes
                >= val.required_votes as u64;

            let is_success = val.proposal_approved_votes >= 5;
            if is_completed && is_success {
                let mut updated_proposal = val.clone();

                let mut updated_dao = state.dao.clone();
                updated_dao.members.push(val.created_by);
                updated_dao.members_count += 1;

                state.dao = updated_dao;
                updated_proposal.proposal_status = ProposalState::Accepted;
                state.proposals.insert(id.to_owned(), updated_proposal);
            } else {
                let mut updated_proposal = val.clone();

                updated_proposal.proposal_status = ProposalState::Rejected;
                state.proposals.insert(id.to_owned(), updated_proposal);
            }
        }
        None => (),
    })

    // with_state(|state| match &mut state.proposals.get(&id) {
    //     Some(proposal) => {

    //         let is_completed = proposal.proposal_approved_votes+ proposal.proposal_rejected_votes >= proposal.required_votes as u64;

    //         if is_completed {
    //             state.dao.members.push(proposal.created_by);
    //             proposal.proposal_status = ProposalState::Expired;
    //             state.proposals.insert(id.clone(), proposal.to_owned());

    //             // Ok(format!("Updated {:?}", proposal))
    //         }
    //     }
    //     None => (),
    // })
}

#[query(guard = prevent_anonymous)]
fn get_all_groups() -> Vec<DaoGroup> {
    with_state(|state| {
        let mut groups: Vec<DaoGroup> = Vec::new();

        for x in state.dao_groups.iter() {
            groups.push(x.1);
        }
        groups
    })
}

#[query(guard = prevent_anonymous)]
fn get_all_balances(proposal_id: String) -> ProposalStakes {
    with_state(|state| state.proposal_balances.get(&proposal_id).unwrap())
}