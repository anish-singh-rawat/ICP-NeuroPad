use crate::functions::{
    create_ledger, create_new_canister, deposit_cycles_in_canister, install_code_in_canister,
};
use crate::CanisterSettings;
use candid::encode_one;
use crate::types::{CanisterInstallMode, CreateCanisterArgument, InstallCodeArgument};
use crate::with_state;
use candid::{Nat, Principal};

// to create dao canister
pub async fn create_dao_canister(dao_detail: crate::DaoInput) -> Result<Principal, String> {
    let principal_id = ic_cdk::api::caller();
    let user_profile_detail = with_state(|state| state.user_profile.get(&principal_id).clone());

    let _user_profile_detail = match user_profile_detail {
        Some(data) => data,
        None => panic!("User profile doesn't exist !"),
    };

    let mut updated_members = dao_detail.members.clone();
    if !updated_members.contains(&principal_id) {
        updated_members.push(principal_id.clone());
    }

    // image upload
    let image_id: Result<String, String> = super::upload_image(
        // canister_id,
        crate::ImageData {
            content: dao_detail.image_content,
            name: dao_detail.image_title,
            content_type: dao_detail.image_content_type,
        },
    )
    .await;

    let mut id = String::new();
    let image_create_res: bool = (match image_id {
        Ok(value) => {
            id = value;
            Ok(())
        }
        Err(er) => {
            ic_cdk::println!("error {}", er.to_string());
            Err(())
        }
    })
    .is_err();

    if image_create_res {
        return Err(String::from("Failed to upload image !."));
    }

    let canister_id = with_state(|state| state.canister_data.get(&0));

    let asset_canister_id = match canister_id {
        Some(val) => val.ic_asset_canister,
        None => return Err(String::from("Canister Meta data not found.")),
    };

    let proposal_entry: Vec<crate::ProposalPlace> = dao_detail.proposal_entry.iter().map(|proposal| {
        crate::ProposalPlace {
            place_name: proposal.place_name.clone(),
            min_required_thredshold: proposal.min_required_thredshold,
        }
    }).collect();


    let update_dao_detail = crate::DaoCanisterInput {
        dao_name: dao_detail.dao_name.clone(),
        purpose: dao_detail.purpose.clone(),
        link_of_document: dao_detail.link_of_document,
        cool_down_period: dao_detail.cool_down_period,
        members: updated_members,
        // tokenissuer: dao_detail.tokenissuer,
        linksandsocials: dao_detail.linksandsocials,
        required_votes: dao_detail.required_votes,
        image_id: id.clone(),
        members_permissions: dao_detail.members_permissions,
        dao_groups: dao_detail.dao_groups,
        image_canister: asset_canister_id,
        token_symbol: dao_detail.token_symbol,
        token_supply: dao_detail.token_supply,
        daohouse_canister_id: ic_cdk::api::id(),
        proposal_entry : proposal_entry,
        ask_to_join_dao: dao_detail.ask_to_join_dao,
        all_dao_user : vec![],
    };

    // encoding params that is to be passed to new canister
    let dao_detail_bytes: Vec<u8> = match encode_one(&update_dao_detail) {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err(format!("Failed to serialize DaoInput: {}", e));
        }
    };

    // adding controllers of new canister
    let all_controllers = CanisterSettings {
        controllers: Some(vec![ic_cdk::api::caller(), ic_cdk::api::id()]),
        ..Default::default()
    };

    let arg = CreateCanisterArgument {
        settings: Some(all_controllers),
    };

    // creating empty new canister
    let (canister_id,) = match create_new_canister(arg).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            return Err(err_string);
        }
    };

    let canister_id_principal = canister_id.canister_id;

    // adding cycles to newly created DAO canister (Note: Increases with number of functions)
    let _addcycles = deposit_cycles_in_canister(canister_id, 300_000_000_000)
        .await
        .unwrap();

    let mut wasm_module: Vec<u8> = Vec::new();

    // to retrive wasm module stored in stable memory
    with_state(|state| match state.wasm_module.get(&0) {
        Some(val) => {
            wasm_module = val.wasm;
        }
        None => panic!("WASM error"),
    });

    let arg1 = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        // wasm_module: vec![],
        wasm_module: wasm_module.clone(),
        arg: dao_detail_bytes,
    };

    let _installcode = install_code_in_canister(arg1, wasm_module).await.unwrap();

    Ok(canister_id_principal)
}

// create ledger canister
pub async fn create_new_ledger_canister(dao_detail: crate::DaoInput, dao_canister_id : Principal) -> Result<Principal, String> {
    create_ledger(
        // canister_id_principal.to_string().clone(), // TODO : add dao canister as controller
        Nat::from(dao_detail.token_supply),
        dao_detail.token_name,
        dao_detail.token_symbol,
        dao_detail.members,
        dao_canister_id
    )
    .await
    .map_err(|er| format!("Error while creating ledger canister {}", String::from(er)))
}
