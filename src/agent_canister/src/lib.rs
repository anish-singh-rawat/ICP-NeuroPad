mod types;
use ic_cdk::{export_candid, init};
use std::cell::RefCell;
pub mod proposal_route;
mod state_handler;
use state_handler::State;
mod memory;
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
    let new_agent = AgentDetails {
        agent_id: ic_cdk::api::id(),
        agent_name: agent_input.agent_name,
        image_canister: agent_input.image_canister,
        members: agent_input.members.clone(),
        image_id: agent_input.image_id,
        members_count: agent_input.members.len() as u32,
        agent_category : agent_input.agent_category,
        agent_type : agent_input.agent_type,
        agent_overview : agent_input.agent_overview,
        agent_website : agent_input.agent_website,
        agent_twitter : agent_input.agent_twitter,
        agent_discord : agent_input.agent_discord,
        agent_telegram : agent_input.agent_telegram,
        token_name : agent_input.token_name,
        token_supply : agent_input.token_supply,
        agent_description : agent_input.agent_description,
        agent_lunch_time : agent_input.agent_lunch_time,
        token_symbol: agent_input.token_symbol,
        token_ledger_id: Principal::anonymous(),
    };

    with_state(|state| {
        state.agent = new_agent.clone();
    });
}

export_candid!();
