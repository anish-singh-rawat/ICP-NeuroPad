use crate::types::{AgentDetails, AgentType};
use candid::Principal;

pub struct State {
    pub agent: AgentDetails,
}

impl State {
    pub fn new() -> Self {
        Self {
            agent : AgentDetails {
                agent_id: Principal::anonymous(),
                agent_name: String::new(),
                agent_category: String::new(),
                agent_type: AgentType::StandardLaunch,
                agent_overview: String::new(),
                members: Vec::new(),
                agent_website: String::new(),
                agent_twitter: String::new(),
                members_count: 0,
                agent_discord: String::new(),
                agent_telegram: String::new(),
                token_name: String::new(),
                token_symbol: String::new(),
                image_canister: Principal::anonymous(),
                token_supply: 0,
                agent_description: String::new(),
                image_id: String::new(),
                agent_lunch_time: 0,
                token_ledger_id: Principal::anonymous(),
            },
        }
    }
}

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}