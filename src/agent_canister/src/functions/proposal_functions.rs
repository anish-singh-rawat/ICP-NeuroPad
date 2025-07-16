use crate::types::AgentDetails;
use crate::{guards::*, with_state};
use ic_cdk::query;
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
