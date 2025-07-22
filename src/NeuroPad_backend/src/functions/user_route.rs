use crate::routes::{create_agent_canister, create_new_ledger_canister};
use crate::types::{AgentInput, Profileinput, UserProfile};
use crate::{
    guards::*, Account, ArchiveOptions,
    FeatureFlags, InitArgs, LedgerArg,
};
use crate::{routes, with_state, AgentDetails};
use candid::{Nat, Principal};
use ic_cdk::api;
use ic_cdk::{query, update};

use super::canister_functions::call_inter_canister;
use super::ledger_functions::create_ledger_canister;


#[query(guard = prevent_anonymous)]
async fn get_user_profile() -> Result<UserProfile, String> {
    with_state(|state| routes::get_user_profile(state))
}

#[update(guard = prevent_anonymous)]
async fn create_user_profile(
    profile: Profileinput,
) -> Result<(), String> {

    let principal_id = api::caller();

     let is_registered = with_state(|state| {
        if state.user_profile.contains_key(&ic_cdk::caller()) {
            return Err(crate::utils::USER_REGISTERED);
        }
        Ok(())
    })
    .is_err();

    if is_registered {
        return Err(String::from(crate::utils::USER_REGISTERED));
    }

      let new_profile = UserProfile {
        username : profile.username,
        twitter_id : profile.twitter_id,
        website : profile.website,
        user_id : principal_id.clone()
    };

    with_state(|state| {
        state.user_profile.insert(principal_id.clone(), new_profile.clone());
    });

    Ok(())
}

pub async fn create_agent(agent_detail: AgentInput) -> Result<String, String> {
    let principal_id = ic_cdk::api::caller();
    let user_profile_detail = with_state(|state| state.user_profile.get(&principal_id).clone());

    let mut user_profile_detail = match user_profile_detail {
        Some(data) => data,
        None => return Err(String::from(crate::utils::USER_DOES_NOT_EXIST)),
    };

    let agent_canister_id = create_agent_canister(agent_detail.clone())
        .await
        .map_err(|err| format!("{} {}", crate::utils::CREATE_AGENT_CANISTER_FAIL, err))?;

    // to create ledger canister
    let ledger_canister_id = create_new_ledger_canister(agent_detail.clone(), agent_canister_id).await;

    let res = match ledger_canister_id {
        Ok(val) => Ok(val),

        Err(err) => {
            Err(format!("{} {}", crate::utils::CREATE_LEDGER_FAILURE, err))
        }
    }
    .map_err(|err| format!("Error {}", err));

    let ledger_canister_id = res.map_err(|err| format!("Error in ledger canister id: {}", err))?;

    let agent_details = AgentDetails {
        agent_canister_id: agent_canister_id.clone(),
        agent_name: agent_detail.agent_name,
        image_title: agent_detail.image_title,
        agent_description : agent_detail.agent_description,
        agent_associated_ledger : ledger_canister_id.clone(),
        agent_category : agent_detail.agent_category,
        agent_type : agent_detail.agent_type,
        agent_overview : agent_detail.agent_overview,
        members : agent_detail.members,
        token_symbol : agent_detail.token_symbol,
        token_supply : agent_detail.token_supply,
        image_id : agent_detail.image_id,
        agent_website : agent_detail.agent_website,
        agent_twitter : agent_detail.agent_twitter,
        agent_discord : agent_detail.agent_discord,
        agent_telegram : agent_detail.agent_telegram,
        token_name : agent_detail.token_name,
        agent_lunch_time : agent_detail.agent_lunch_time,
    };

    with_state(|state| {
        state
            .agent_details
            .insert(agent_canister_id.clone(), agent_details)
    });

    // user_profile_detail.agent_ids.push(agent_canister_id.clone());

    match call_inter_canister::<Principal, ()>(
        "add_ledger_canister_id",
        ledger_canister_id,
        agent_canister_id,
    )
    .await
    {
        Ok(()) => {}
        Err(err) => {
            return Err(format!("{}{}", crate::utils::INTER_CANISTER_FAILED, err));
        }
    }
    
    with_state(|state| {
        if let Some(profile) = state.user_profile.get(&api::caller()) {
            let mut updated_profile = profile.clone();
            // updated_profile.join_agent.push(agent_canister_id.clone());
            state.user_profile.insert(principal_id, updated_profile);
        }
    });

    Ok(format!(
        "Agent created, canister id: {} ledger id: {}",
        agent_canister_id.to_string(),
        ledger_canister_id.to_string()
    ))
}

#[query(guard = prevent_anonymous)]
fn check_user_existance() -> Result<String, String> {
    with_state(|state| {
        let user = state.user_profile.contains_key(&ic_cdk::api::caller());
        if user {
            Ok("User exist ".to_string())
        } else {
            Err(String::from(crate::utils::USER_DOES_NOT_EXIST))
        }
    })
}

// #[update]
pub async fn create_ledger(
    total_tokens: Nat,
    token_name: String,
    token_symbol: String,
    members: Vec<Principal>,
    agent_canister_id: Principal,
) -> Result<Principal, String> {
    let tokens_per_user = total_tokens.clone() / members.len();

    let mut accounts: Vec<(Account, Nat)> = vec![];

    for acc in members.iter() {
        let account = Account {
            owner: acc.to_owned(),
            subaccount: None,
        };

        accounts.push((account, tokens_per_user.clone()))
    }

    let ledger_args = LedgerArg::Init(InitArgs {
        token_name: token_name,
        token_symbol: token_symbol,
        minting_account: Account {
            owner: ic_cdk::api::id(),
            subaccount: None,
        },
        transfer_fee: Nat::from(0 as u32),
        metadata: vec![],
        initial_balances :  vec![(
            Account {
                owner: agent_canister_id,
                subaccount: None,
            },
            total_tokens,
        )],
        archive_options: ArchiveOptions {
            controller_id: api::caller(),
            cycles_for_archive_creation: None,
            max_message_size_bytes: None,
            max_transactions_per_response: None,
            node_max_memory_size_bytes: None,
            num_blocks_to_archive: 100,
            trigger_threshold: 100,
        },
        feature_flags: Some(FeatureFlags { icrc2: true }),
        fee_collector_account: None,
        accounts_overflow_trim_quantity: None,
        maximum_number_of_accounts: None,
        decimals: None,

        max_memo_length: None,
    });

    create_ledger_canister(ledger_args).await

}
