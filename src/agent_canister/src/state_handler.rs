use crate::types::AgentDetails;
use crate::LedgerCanisterId;
use candid::Principal;

pub struct State {
    pub agent: AgentDetails,
}

impl State {
    pub fn new() -> Self {
        Self {
            agent : AgentDetails {
                agent_id: Principal::anonymous(),
                agent_name: String::from("Example AGENT"),
                purpose: String::from("Example Purpose"),
                link_of_document: String::from("Example Document"),
                cool_down_period: 7,
                members: Vec::new(),
                image_id: "1".to_string(),
                members_count: 0,
                proposals_count: 0,
                proposal_ids: Vec::new(),
                token_ledger_id: LedgerCanisterId {
                    id: Principal::anonymous(),
                },
                total_tokens: 0,
                token_symbol: String::new(),
                image_canister: Principal::anonymous(),
                agent_canister_id: Principal::anonymous(),
                all_agent_user :  vec![],
            },
        }
    }
}

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}