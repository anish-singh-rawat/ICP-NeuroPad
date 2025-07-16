use crate::types::AgentDetails;
use crate::{guards::*, with_state};
use ic_cdk::query;
use std::collections::HashSet;

#[query(guard=prevent_anonymous)]
async fn get_agent_detail() -> AgentDetails {
    with_state(|state| {
        let mut dao = state.agent.clone();
        let unique_members: HashSet<candid::Principal> = dao.members.iter().cloned().collect();
        dao.members = unique_members.into_iter().collect();
        dao.members_count = dao.members.len() as u32;
        dao
    })
}
