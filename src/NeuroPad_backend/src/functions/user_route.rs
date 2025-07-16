use std::borrow::Borrow;
use crate::routes::{create_dao_canister, create_new_ledger_canister, upload_image};
use crate::types::CanisterIdRecord;
use crate::types::{DaoInput, Profileinput, UserProfile};
use crate::{
    guards::*, Account, ArchiveOptions, CanisterData,
    FeatureFlags, InitArgs, LedgerArg, LedgerCanisterId, MinimalProfileinput,
};
use crate::{routes, with_state, DaoDetails, ImageData};
use candid::{Nat, Principal};
use ic_cdk::api;
use ic_cdk::{query, update};

use super::canister_functions::call_inter_canister;
use super::ledger_functions::create_ledger_canister;
use super::reverse_canister_creation;

#[update(guard=prevent_anonymous)]
async fn create_profile(profile: MinimalProfileinput) -> Result<String, String> {
    // Validate email format
    if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
        return Err(String::from(crate::utils::INVALID_EMAIL));
    }
    let principal_id = api::caller();

    // Check if the user is already registered
    let is_registered = with_state(|state| {
        if state.user_profile.contains_key(&principal_id) {
            return Err(crate::utils::USER_REGISTERED);
        }
        Ok(())
    })
    .is_err();
    if is_registered {
        return Err(String::from(crate::utils::USER_REGISTERED));
    }

    // to upload image
    let image_id = upload_image(ImageData {
        content: profile.image_content,
        name: profile.image_title.clone(),
        content_type: profile.image_content_type.clone(),
    })
    .await
    .map_err(|err| format!("{}{}", crate::utils::IMAGE_UPLOAD_FAILED, err))?;

    // getting image canister id
    let asset_canister_id = with_state(|state| {
        Ok(match state.canister_data.get(&0) {
            Some(val) => val.ic_asset_canister,
            None => return Err(String::from(crate::utils::CANISTER_DATA_NOT_FOUND)),
        })
    })
    .map_err(|err| format!("Error: {}", err))
    .unwrap();

    let new_profile = UserProfile {
        user_id: principal_id,
        email_id: profile.email_id,
        profile_img: image_id,
        username: profile.name,
        dao_ids: Vec::new(),
        post_count: 0,
        post_id: Vec::new(),
        description: "".to_string(),
        tag_defines: Vec::new(),
        contact_number: "".to_string(),
        twitter_id: "".to_string(),
        telegram: "".to_string(),
        website: "".to_string(),
        image_canister: asset_canister_id,
        join_dao :  Vec::new(),
        submitted_proposals : 0,
    };

    // with_state(|state| routes::create_new_profile(state, profile.clone()))

    with_state(|state| -> Result<String, String> {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.members_count += 1;
        state.analytics_content.insert(0, analytics);
        state.user_profile.insert(principal_id, new_profile);
        Ok(String::from(crate::utils::PROFILE_UPDATE_SUCCESS))
    })
}

#[query(guard = prevent_anonymous)]
async fn get_user_profile() -> Result<UserProfile, String> {
    with_state(|state| routes::get_user_profile(state))
}

#[update(guard = prevent_anonymous)]
async fn update_profile(
    // asset_handler_canister_id: String,
    profile: Profileinput,
) -> Result<(), String> {
    if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
        return Err(String::from(crate::utils::INVALID_EMAIL));
    }

    let principal_id = api::caller();

    // Check if the user is already registered
    let is_registered = with_state(|state| {
        if !state.user_profile.contains_key(&principal_id) {
            return Err(String::from(crate::utils::USER_REGISTERED));
        }
        Ok(())
    })
    .is_err();

    if is_registered {
        return Err(String::from(crate::utils::USER_DOES_NOT_EXIST));
    }
    // let is_registered = with_state(|state| {
    //     if !state.user_profile.contains_key(&principal_id) {
    //         return Err("User is not registered".to_string());
    //     }
    //     Ok(())
    // }).is_err();

    // if !is_registered {
    //     return Err("User dosen't exist ".to_string());
    // }
    // Validate email format

    let mut image_id: String = profile.profile_img.to_string();

    if profile.image_title != "na".to_string() {
        image_id = upload_image(
            // asset_handler_canister_id,
            ImageData {
                content: profile.image_content,
                name: profile.image_title.clone(),
                content_type: profile.image_content_type.clone(),
            },
        )
        .await
        .map_err(|_err| crate::utils::IMAGE_UPLOAD_FAILED)?;
    }

    // image upload

    // Clone the old profile and update the fields with new information

    with_state(|state| {
        let mut new_profile = state.user_profile.get(&principal_id).unwrap().clone();
        new_profile.email_id = profile.email_id;
        new_profile.profile_img = image_id;
        new_profile.username = profile.username;
        new_profile.description = profile.description;
        new_profile.contact_number = profile.contact_number;
        new_profile.twitter_id = profile.twitter_id;
        new_profile.telegram = profile.telegram;
        new_profile.website = profile.website;
        new_profile.tag_defines = profile.tag_defines;

        state.user_profile.insert(principal_id, new_profile);
    });

    Ok(())

    // with_state(|state| routes::update_profile(state, profile.clone()))
}

#[update(guard = prevent_anonymous)]
async fn delete_profile() -> Result<(), String> {
    with_state(|state| routes::delete_profile(state))
}

#[update]
pub async fn create_dao(dao_detail: DaoInput) -> Result<String, String> {
    let principal_id = ic_cdk::api::caller();
    let user_profile_detail = with_state(|state| state.user_profile.get(&principal_id).clone());

    let mut user_profile_detail = match user_profile_detail {
        Some(data) => data,
        None => return Err(String::from(crate::utils::USER_DOES_NOT_EXIST)),
    };

    // to create dao canister
    let dao_canister_id = create_dao_canister(dao_detail.clone())
        .await
        .map_err(|err| format!("{} {}", crate::utils::CREATE_DAO_CANISTER_FAIL, err))?;

    // to create ledger canister
    let ledger_canister_id = create_new_ledger_canister(dao_detail.clone(), dao_canister_id).await;

    let res = match ledger_canister_id {
        Ok(val) => Ok(val),

        Err(err) => {
            let _ = reverse_canister_creation(CanisterIdRecord {
                canister_id: dao_canister_id,
            })
            .await;

            Err(format!("{} {}", crate::utils::CREATE_LEDGER_FAILURE, err))
        }
    }
    .map_err(|err| format!("Error {}", err));

    let ledger_canister_id = res.map_err(|err| format!("Error in ledger canister id: {}", err))?;

    let dao_details: DaoDetails = DaoDetails {
        dao_canister_id: dao_canister_id.clone(),
        dao_name: dao_detail.dao_name,
        dao_desc: dao_detail.purpose,
        dao_associated_ledger: ledger_canister_id,
    };

    // storing dao details for DAO listings
    with_state(|state| {
        state
            .dao_details
            .insert(dao_canister_id.clone(), dao_details)
    });

    user_profile_detail.dao_ids.push(dao_canister_id.clone());

    // adding ledger canister in newly created DAO canister
    match call_inter_canister::<LedgerCanisterId, ()>(
        "add_ledger_canister_id",
        LedgerCanisterId {
            id: ledger_canister_id,
        },
        dao_canister_id,
    )
    .await
    {
        Ok(()) => {}
        Err(err) => {
            //   delete created canisters
            let _ = reverse_canister_creation(CanisterIdRecord {
                canister_id: dao_canister_id,
            })
            .await;

            let _ = reverse_canister_creation(CanisterIdRecord {
                canister_id: ledger_canister_id,
            })
            .await;

            return Err(format!("{}{}", crate::utils::INTER_CANISTER_FAILED, err));
        }
    }

    with_state(|state| {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.dao_counts += 1;
        state.analytics_content.insert(0, analytics);
        state.user_profile.insert(principal_id, user_profile_detail)
    });

    with_state(|state| {
        let new_canister_id = dao_canister_id.clone();
        state.canister_ids.insert(new_canister_id, new_canister_id)
    });

    with_state(|state| {
        if let Some(profile) = state.user_profile.get(&api::caller()) {
            let mut updated_profile = profile.clone();
            updated_profile.join_dao.push(dao_canister_id.clone());
            state.user_profile.insert(principal_id, updated_profile);
        }
    });

    Ok(format!(
        "Dao created, canister id: {} ledger id: {}",
        dao_canister_id.to_string(),
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

#[update(guard = prevent_anonymous)]
fn get_profile_by_id(id: Principal) -> Result<UserProfile, String> {
    let user_submitted_proposals : u64 = with_state(|state| {
        state.proposal_store
            .iter()
            .filter(|(_key, proposal)| proposal.created_by == id)
            .count()
    }).try_into().unwrap();

    with_state(|state| match state.user_profile.get(&id) {
        Some(profile) => {
            let mut user_profile: UserProfile = profile.clone();
            user_profile.submitted_proposals = user_submitted_proposals;
            Ok(user_profile)
        },
        None => Err(String::from(crate::utils::USER_DOES_NOT_EXIST)),
    })
}

// #[update]
pub async fn create_ledger(
    total_tokens: Nat,
    token_name: String,
    token_symbol: String,
    members: Vec<Principal>,
    dao_canister_id: Principal,
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
        // initial_balances: accounts,
        initial_balances :  vec![(
            Account {
                owner: dao_canister_id,
                subaccount: None,
            },
            total_tokens,
        )],
        // initial_balances: vec![
        //     // (
        //     //     Account {
        //     //         owner: api::caller(),
        //     //         subaccount: None,
        //     //     },
        //     //     Nat::from(1000000 as u32),
        //     // ),
        //     // (
        //     //     Account {
        //     //         owner: acc,
        //     //         subaccount: None,
        //     //     },
        //     //     Nat::from(290999 as u32),
        //     // ),
        // ],
        archive_options: ArchiveOptions {
            controller_id: api::caller(), // TODO: FIX THIS, THIS NEED TO BE DAO CANISTER ID
            // controller_id: Principal::from_text(dao_canister_id).map_err(|err| err.to_string())?,
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

    // Ok("()".to_string())
}

// TODO REMOVE THIS
#[query]
fn get_canister_meta_data() -> Result<CanisterData, String> {
    with_state(|state| match state.canister_data.get(&0) {
        Some(val) => Ok(val),
        None => return Err(String::from(crate::utils::CANISTER_DATA_NOT_FOUND)),
    })
    // with_state(|state| state.canister_data)
}

#[query(guard = prevent_anonymous)]
async fn check_profile_existence() -> Result<(), String> {
    let principal_id = api::caller();
    let profile = with_state(|state| state.user_profile.get(&principal_id));

    if let Some(user_profile) = profile {
        if !user_profile.email_id.trim().is_empty() {
            return Err(crate::utils::USER_REGISTERED.to_string());
        }
    }
    Ok(())
}
