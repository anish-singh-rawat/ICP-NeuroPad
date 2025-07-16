mod types;
use ic_cdk::{export_candid, init};
use std::{cell::RefCell, collections::HashSet};
pub mod proposal_route;
mod state_handler;
use state_handler::State;
mod memory;
use memory::Memory;
mod functions;
mod guards;
extern crate ic_cdk_macros;
use candid::Principal;
use types::*;
mod utils;
use icrc_ledger_types::icrc1::transfer::BlockIndex;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[init]
async fn init(agent_input: AgentCreationInput) {
    let proposal_entry: Vec<crate::ProposalPlace> = agent_input
        .proposal_entry
        .iter()
        .map(|proposal| crate::ProposalPlace {
            place_name: proposal.place_name.clone(),
            min_required_thredshold: proposal.min_required_thredshold,
        })
        .collect();

    let mut unique_members: HashSet<Principal> = HashSet::new();
    
    for member in agent_input.members.iter() {
        unique_members.insert(*member);
    }

    for group in agent_input.dao_groups.iter() {
        for agent_user in group.group_members.iter() {
            unique_members.insert(*agent_user);
        }
    }

    let all_agent_user: Vec<Principal> = unique_members.into_iter().collect();
    
    let new_agent = AgentDetails {
        agent_id: ic_cdk::api::id(),
        agnet_name: agent_input.dao_name,
        purpose: agent_input.purpose,
        image_canister: agent_input.image_canister,
        link_of_document: agent_input.link_of_document,
        cool_down_period: agent_input.cool_down_period,
        linksandsocials: agent_input.linksandsocials,
        groups_count: agent_input.dao_groups.len() as u64,
        required_votes: agent_input.required_votes,
        members: agent_input.members.clone(),
        image_id: agent_input.image_id,
        members_count: agent_input.members.len() as u32,
        members_permissions: agent_input.members_permissions,
        proposals_count: 0,
        proposal_ids: Vec::new(),
        token_ledger_id: LedgerCanisterId {
            id: Principal::anonymous(),
        },
        total_tokens: agent_input.token_supply,
        agent_canister_id: agent_input.parent_agent_canister_id,
        token_symbol: agent_input.token_symbol,
        proposal_entry: proposal_entry,
        all_agent_user : all_agent_user,
        requested_dao_user : Vec::new(),
    };

    with_state(|state| {
        state.agent = new_agent.clone();
        for x in agent_input.dao_groups.iter() {
            state.agnet_groups.insert(x.group_name.clone(), x.to_owned());
        }
    });
}

export_candid!();
