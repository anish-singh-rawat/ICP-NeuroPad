// use std::collections::BTreeMap;
use crate::{with_state, Analytics, DaoDetails, DaoInput, Pagination};
use candid::{Nat, Principal};
use ic_cdk::{api, update};
use icrc_ledger_types::{
    icrc1::{account::Account, transfer::BlockIndex},
    icrc2::transfer_from::{TransferFromArgs, TransferFromError},
};

use crate::guards::*;
use ic_cdk::query;

use super::create_dao;

#[query(guard = prevent_anonymous)]
fn get_all_dao_pagination(page_data: Pagination) -> Vec<DaoDetails> {
    let mut daos: Vec<DaoDetails> = Vec::new();
    with_state(|state| {
        for y in state.dao_details.iter() {
            daos.push(y.1);
        }
    });
    let ending = daos.len();
    if ending == 0 {
        return daos;
    }
    let start = page_data.start as usize;
    let end = page_data.end as usize;
    if start < ending {
        let end = end.min(ending);
        return daos[start..end].to_vec();
    }
    Vec::new()
    // daos
}



#[query(guard = prevent_anonymous)]
fn get_all_dao() -> Vec<DaoDetails> {
    let mut daos: Vec<DaoDetails> = Vec::new();
    with_state(|state| {
        for y in state.dao_details.iter() {
            daos.push(y.1);
        }
    });
    return  daos;
}

#[query]
fn get_analytics() -> Result<Analytics, String> {
    with_state(|state| {
        let data = state.analytics_content.get(&0);

        match data {
            Some(res) => Ok(res),
            None => Err("data not found !!!!!".to_string()),
        }
    })
}

// ledger handlers
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
async fn make_payment_and_create_dao(dao_details:DaoInput)->Result<String, String> {
    let required_balance: Nat = Nat::from(10_000_000u64);
    let result: Result<Nat, String> = transfer(required_balance, api::caller()).await;
    match result {
        Err(error) => Err(error),
        Ok(_) => {
            let dao_response: Result<String, String> = create_dao(dao_details).await;
            match dao_response {
                Err(error) => Err(error),
                Ok(response) => Ok(response),
            }
        }
    }
}

#[query]
fn get_cycles() -> u64 {
    api::canister_balance()
}

#[query(guard = prevent_anonymous)]
fn search_dao(dao_name: String) -> Vec<DaoDetails> {
    let mut daos: Vec<DaoDetails> = Vec::new();

    with_state(|state| {
        for y in state.dao_details.iter() {
            if y.1.dao_name.contains(&dao_name) {
                daos.push(y.1.clone())
            }
        }

        daos
    })
}
