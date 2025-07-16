// use std::collections::HashMap;
use crate::types::{PostInfo, UserProfile};
use crate::{Analytics, CanisterData, DaoDetails, Memory, ProposalValueStore, WasmArgs};
use candid::Principal;
use ic_stable_structures::StableBTreeMap;
// use std::collections::BTreeMap;

pub struct State {
    pub user_profile: StableBTreeMap<Principal, UserProfile, Memory>,

    pub post_detail: StableBTreeMap<String, PostInfo, Memory>,

    pub dao_details: StableBTreeMap<Principal, DaoDetails, Memory>,

    pub analytics_content: StableBTreeMap<u64, Analytics, Memory>,

    pub wasm_module: StableBTreeMap<u64, WasmArgs, Memory>,

    // payment_recipient: Option<Principal>,
    pub proposal_store: StableBTreeMap<String, ProposalValueStore, Memory>,

    pub ledger_wasm: Vec<u8>,

    pub canister_ids : StableBTreeMap<Principal, Principal, Memory>,

    pub canister_data: StableBTreeMap<u8, CanisterData, Memory>,
}

impl State {
    pub fn new() -> Self {
        Self {
            user_profile: init_file_contents(),
            post_detail: post_file_contents(),
            dao_details: dao_file_contents(),
            analytics_content: analytics_content(),
            wasm_module: init_wasm_module(),
            canister_ids : init_canister_ids(),
            ledger_wasm: vec![],
            canister_data: init_canister_data(), // ..Default::default()
            proposal_store: init_proposal_state(),
        }
    }
}

fn init_file_contents() -> StableBTreeMap<Principal, UserProfile, Memory> {
    StableBTreeMap::init(crate::memory::get_postdata_memory())
}

fn post_file_contents() -> StableBTreeMap<String, PostInfo, Memory> {
    StableBTreeMap::init(crate::memory::get_user_memory())
}

fn dao_file_contents() -> StableBTreeMap<Principal, DaoDetails, Memory> {
    StableBTreeMap::init(crate::memory::get_dao_memory())
}
fn analytics_content() -> StableBTreeMap<u64, Analytics, Memory> {
    StableBTreeMap::init(crate::memory::get_analytics_memory())
}

fn init_wasm_module() -> StableBTreeMap<u64, WasmArgs, Memory> {
    StableBTreeMap::init(crate::memory::get_wasm_memory())
}

fn init_canister_ids() -> StableBTreeMap<Principal, Principal, Memory> {
    StableBTreeMap::init(crate::memory::get_canister_id())
}

fn init_canister_data() -> StableBTreeMap<u8, CanisterData, Memory> {
    StableBTreeMap::init(crate::memory::get_canister_data_memory())
}

fn init_proposal_state() -> StableBTreeMap<String, ProposalValueStore, Memory> {
    StableBTreeMap::init(crate::memory::get_proposal_memory())
}

// fn ledger_wasm_module() ->

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}
