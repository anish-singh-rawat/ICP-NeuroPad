use crate::types::{Dao, Proposals};
use crate::{guards::*, with_state, ProposalStakes};
use ic_cdk::query;
use std::collections::HashSet;

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

#[query(guard = prevent_anonymous)]
fn get_all_balances(proposal_id: String) -> ProposalStakes {
    with_state(|state| state.proposal_balances.get(&proposal_id).unwrap())
}