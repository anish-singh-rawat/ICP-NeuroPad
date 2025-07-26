use crate::types::AgentDetails;
use crate::{guards::*, with_state};
use candid::Principal;
use ic_cdk::{query, update};
use std::collections::HashSet;

#[query(guard=prevent_anonymous)]
async fn get_agent_detail() -> AgentDetails {
    with_state(|state| {
        let mut agent = state.agent.clone();
        let unique_members: HashSet<candid::Principal> = agent.members.iter().cloned().collect();
        agent.members = unique_members.into_iter().collect();
        agent.members_count = agent.members.len() as u32;
        agent
    })
}

#[update(guard=prevent_anonymous)]
fn add_ledger_canister_id(id: Principal) -> Result<(), String> {
    with_state(|state| state.agent.token_ledger_id = id);

    Ok(())
}