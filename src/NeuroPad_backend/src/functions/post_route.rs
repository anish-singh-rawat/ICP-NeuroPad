use std::time::Duration;
use crate::{with_state, AgentDetails, AgentInput};
use candid::{Nat, Principal};
use ic_cdk::{api, update};
use ic_cdk_timers::set_timer;
use icrc_ledger_types::{
    icrc1::{account::Account, transfer::BlockIndex},
    icrc2::transfer_from::{TransferFromArgs, TransferFromError},
};

use crate::guards::*;
use ic_cdk::query;

use super::create_agent;

#[query(guard = prevent_anonymous)]
fn get_all_agent() -> Vec<AgentDetails> {
    let mut agents: Vec<AgentDetails> = Vec::new();
    with_state(|state| {
        for y in state.agent_details.iter() {
            agents.push(y.1);
        }
    });
    return agents;
}

async fn transfer(tokens: Nat, user_principal: Principal) -> Result<BlockIndex, String> {
    let canister_meta_data = with_state(|state| state.canister_data.get(&0));

    let payment_recipient = match canister_meta_data {
        Some(val) => val.paymeny_recipient,
        None => return Err(String::from(crate::utils::CANISTER_DATA_NOT_FOUND)),
    };

    let transfer_args = TransferFromArgs {
        amount: tokens,
        to: Account {
            owner: payment_recipient,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: user_principal,
            subaccount: None,
        },
    };

    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai")
            .expect("Could not decode the principal if ICP ledger."),
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    .0
    .map_err(|e| format!("ledger transfer error {:?}", e))
}

#[update(guard = prevent_anonymous)]
async fn make_payment_and_create_agent(agent_details: AgentInput) -> Result<String, String> {
    let required_balance: Nat = Nat::from(10_000_000u64);
    let result: Result<Nat, String> = transfer(required_balance, api::caller()).await;
    match result {
        Err(error) => Err(error),
        Ok(_) => {
           let agent_clone = agent_details.clone();

            set_timer(Duration::from_nanos(agent_details.agent_lunch_time), move || {
                ic_cdk::spawn(async move {
                    let _ = create_agent(agent_clone).await;
                });
            });

            Ok("Payment successful, agent will be created at the lunch time.".to_string())
        }
    }
}

#[query(guard = prevent_anonymous)]
fn search_agent(agent_name: String) -> Vec<AgentDetails> {
    let mut agents: Vec<AgentDetails> = Vec::new();

    with_state(|state| {
        for y in state.agent_details.iter() {
            if y.1.agent_name.contains(&agent_name) {
                agents.push(y.1.clone())
            }
        }

        agents
    })
}
