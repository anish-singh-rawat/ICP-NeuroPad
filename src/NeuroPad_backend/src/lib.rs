mod types;
use ic_cdk::{api, export_candid, init};
use std::{borrow::BorrowMut, cell::RefCell};
pub mod functions;
pub mod guards;
pub mod routes;
mod state_handler;
use state_handler::State;
mod memory;
use candid::Principal;
pub use functions::*;
use memory::Memory;
pub mod utils;

use types::*;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[init]
async fn init(args: InitialArgs) {
    let analytics = Analytics::default();

    with_state(|state: &mut State| {
        if let Some(_) = state.canister_data.get(&0) {
            ic_cdk::println!("Canister metaData already available.");
        } else {
            state.canister_data.insert(
                0,
                CanisterData {
                    ic_asset_canister: args.ic_asset_canister_id,
                    agent_canister: args.agent_canister_id,
                    paymeny_recipient: args.payment_recipient,
                },
            );
        }

        if let Some(_) = state.analytics_content.get(&0) {
            ic_cdk::println!("Analytics already available.");
        } else {
            state.analytics_content.insert(0, analytics.clone());
        }

        ()
    });

    with_state(|state| {
        let dao_wasm_module: Vec<u8> =
            include_bytes!("../../../.dfx/local/canisters/agent_canister/agent_canister.wasm").to_vec();

        state.borrow_mut().wasm_module.insert(
            0,
            WasmArgs {
                wasm: dao_wasm_module,
            },
        );

    })
}


export_candid!();
