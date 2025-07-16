use super::start_proposal_checker;
use crate::functions::call_inter_canister;
use crate::types::{ProposalInput, Proposals};
use crate::{with_state, ProposalInstance, ProposalState};
use candid::Principal;
use ic_cdk::api;
use ic_cdk::api::management_canister::main::raw_rand;
use sha2::{Digest, Sha256};

pub async fn create_proposal_controller(
    daohouse_backend_id: candid::Principal,
    proposal: ProposalInput,
) -> String {
    let uuids = raw_rand().await.unwrap().0;
    let proposal_id = format!("{:x}", Sha256::digest(&uuids));
    let mut proposal_expire_time: u64 = 0;
    let mut required_votes = 0;
    let mut dao_members: Vec<Principal> = Vec::new();

    with_state(|state| {
        proposal_expire_time =
            ic_cdk::api::time() + (state.dao.cool_down_period as u64 * 86_400 * 1_000_000_000);
        required_votes = state.dao.required_votes;
        dao_members = state.dao.members.clone();
    });

    let new_proposal = Proposals {
        proposal_id: proposal_id.clone(),
        proposal_title: proposal.proposal_title.clone(),
        proposal_description: proposal.proposal_description.clone(),
        proposal_status: ProposalState::Open,
        proposal_submitted_at: ic_cdk::api::time(),
        proposal_expired_at: proposal
            .proposal_expired_at
            .unwrap_or(proposal_expire_time.clone()),
        proposal_approved_votes: 0,
        approved_votes_list: Vec::new(),
        proposal_rejected_votes: 0,
        rejected_votes_list: Vec::new(),
        required_votes: proposal.required_votes.unwrap_or(required_votes),
        created_by: api::caller(),
        comments: 0,
        comments_list: Vec::new(),
        share_count: 0,
        proposal_type: proposal.proposal_type.clone(),
        principal_of_action: proposal.principal_of_action.unwrap_or(api::caller()),
        likes: 0,
        group_to_join: proposal.group_to_join,
        new_dao_name: proposal.new_dao_name,
        new_dao_purpose: proposal.dao_purpose,
        group_to_remove: proposal.group_to_remove,
        cool_down_period: proposal.cool_down_period,
        tokens: proposal.tokens,
        token_from: proposal.token_from,
        token_to: proposal.token_to,
        has_been_processed: false,
        has_been_processed_second: false,
        minimum_threadsold: proposal.minimum_threadsold.clone(),
        link_of_task: proposal.link_of_task,
        bounty_task: proposal.bounty_task,
        associated_proposal_id: proposal.associated_proposal_id.clone(),
        new_required_votes: proposal.new_required_votes,
        poll_query: proposal.poll_query,
        poll_options: proposal.poll_options,
        ask_to_join_dao: proposal.ask_to_join_dao,
        updated_group_permissions : proposal.updated_group_permissions,
    };

    let proposal_copy: ProposalInstance = ProposalInstance {
        principal_action: proposal.principal_of_action.unwrap_or(api::caller()),
        associated_dao_canister_id: ic_cdk::api::id(),
        created_by: api::caller(),
        proposal_description: proposal.proposal_description,
        proposal_expired_at: proposal_expire_time,
        proposal_id: proposal_id.clone(),
        proposal_type: proposal.proposal_type,
        required_votes: proposal.required_votes.unwrap_or(required_votes),
        proposal_submitted_at: ic_cdk::api::time(),
        propsal_title: proposal.proposal_title,
        minimum_threadsold: proposal.minimum_threadsold,
        dao_members,
    };

    let _ = call_inter_canister::<ProposalInstance, Result<String, String>>(
        "add_proposal",
        proposal_copy,
        daohouse_backend_id,
    )
    .await
    .map_err(|err| return format!("{}{}", crate::utils::WARNING_INTER_CANISTER, err));

    let expird_at = new_proposal.proposal_expired_at - new_proposal.proposal_submitted_at;
    with_state(|state| {
        let mut updated_dao = state.dao.clone();
        updated_dao.proposals_count += 1;
        updated_dao.proposal_ids.push(proposal_id.clone());
        state.dao = updated_dao;
        state.proposals.insert(proposal_id, new_proposal);
    });
    start_proposal_checker(expird_at);
    return String::from(crate::utils::REQUEST_CREATE_PROPOSAL);
}

pub fn check_proposal_state(expire_date: &u64) -> bool {
    expire_date.to_owned() <= ic_cdk::api::time()
}
