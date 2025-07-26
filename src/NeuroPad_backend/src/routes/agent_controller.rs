use crate::functions::{
    create_ledger, create_new_canister, deposit_cycles_in_canister, install_code_in_canister,
};
use crate::CanisterSettings;
use candid::encode_one;
use crate::types::{CanisterInstallMode, CreateCanisterArgument, InstallCodeArgument};
use crate::with_state;
use candid::{Nat, Principal};

pub async fn create_agent_canister(agent_detail: crate::AgentInput) -> Result<Principal, String> {
    let updated_members = agent_detail.members.clone();

    let image_id: Result<String, String> = super::upload_image(
        crate::ImageData {
            content: agent_detail.image_content,
            name: agent_detail.image_title.clone(),
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


    let update_agent_detail = crate::AgentCanisterInput {
        agent_name: agent_detail.agent_name.clone(),
        members: updated_members,
        image_id: id.clone(),
        image_canister: asset_canister_id,
        token_symbol: agent_detail.token_symbol,
        token_supply: agent_detail.token_supply,
        agent_description : agent_detail.agent_description,
        agent_category : agent_detail.agent_category,
        agent_type : agent_detail.agent_type,
        agent_overview : agent_detail.agent_overview,
        agent_website : agent_detail.agent_website,
        agent_twitter : agent_detail.agent_twitter,
        agent_discord : agent_detail.agent_discord,
        agent_telegram : agent_detail.agent_telegram,
        token_name : agent_detail.token_name,
        agent_lunch_time : agent_detail.agent_lunch_time,
        members_count : agent_detail.members.len() as u32,
    };

    // encoding params that is to be passed to new canister
    let agent_detail_bytes: Vec<u8> = match encode_one(&update_agent_detail) {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err(format!("Failed to serialize AgentInput: {}", e));
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

    let (canister_id,) = match create_new_canister(arg).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            return Err(err_string);
        }
    };

    let canister_id_principal = canister_id.canister_id;

    let _addcycles = deposit_cycles_in_canister(canister_id, 300_000_000_000)
        .await
        .unwrap();

    let mut wasm_module: Vec<u8> = Vec::new();

    with_state(|state| match state.wasm_module.get(&0) {
        Some(val) => {
            wasm_module = val.wasm;
        }
        None => panic!("WASM error"),
    });

    let arg1 = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
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
