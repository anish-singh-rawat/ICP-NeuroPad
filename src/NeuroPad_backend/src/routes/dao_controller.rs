use crate::functions::{
    create_ledger, create_new_canister, deposit_cycles_in_canister, install_code_in_canister,
};
use crate::CanisterSettings;
use candid::encode_one;
use crate::types::{CanisterInstallMode, CreateCanisterArgument, InstallCodeArgument};
use crate::with_state;
use candid::{Nat, Principal};

// to create dao canister
pub async fn create_dao_canister(agent_detail: crate::AgentInput) -> Result<Principal, String> {
    let principal_id = ic_cdk::api::caller();
    let user_profile_detail = with_state(|state| state.user_profile.get(&principal_id).clone());

    let _user_profile_detail = match user_profile_detail {
        Some(data) => data,
        None => panic!("User profile doesn't exist !"),
    };

    let mut updated_members = agent_detail.members.clone();
    if !updated_members.contains(&principal_id) {
        updated_members.push(principal_id.clone());
    }

    // image upload
    let image_id: Result<String, String> = super::upload_image(
        // canister_id,
        crate::ImageData {
            content: agent_detail.image_content,
            name: agent_detail.image_title,
            content_type: agent_detail.image_content_type,
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


    let update_agent_detail = crate::DaoCanisterInput {
        agent_name: agent_detail.agent_name.clone(),
        purpose: agent_detail.purpose.clone(),
        link_of_document: agent_detail.link_of_document,
        cool_down_period: agent_detail.cool_down_period,
        members: updated_members,
        linksandsocials: agent_detail.linksandsocials,
        required_votes: agent_detail.required_votes,
        image_id: id.clone(),
        image_canister: asset_canister_id,
        token_symbol: agent_detail.token_symbol,
        token_supply: agent_detail.token_supply,
        parent_agent_canister_id: ic_cdk::api::id(),
        all_dao_user : vec![],
    };

    // encoding params that is to be passed to new canister
    let agent_detail_bytes: Vec<u8> = match encode_one(&update_agent_detail) {
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
        arg: agent_detail_bytes,
    };

    let _installcode = install_code_in_canister(arg1, wasm_module).await.unwrap();

    Ok(canister_id_principal)
}

// create ledger canister
pub async fn create_new_ledger_canister(agent_detail: crate::AgentInput, agent_canister_id : Principal) -> Result<Principal, String> {
    create_ledger(
        Nat::from(agent_detail.token_supply),
        agent_detail.token_name,
        agent_detail.token_symbol,
        agent_detail.members,
        agent_canister_id
    )
    .await
    .map_err(|er| format!("Error while creating ledger canister {}", String::from(er)))
}
