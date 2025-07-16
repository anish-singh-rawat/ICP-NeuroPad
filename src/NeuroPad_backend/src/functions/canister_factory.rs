// to create canisters

use crate::api::call::{call_with_payment128, CallResult};
use crate::api::canister_version;
use crate::routes::{delete_canister, stop_canister};
use crate::types::{
    CanisterIdRecord, CreateCanisterArgument, CreateCanisterArgumentExtended,
    InstallCodeArgument, InstallCodeArgumentExtended,
};

use candid::Principal;

pub async fn create_new_canister(
    arg: CreateCanisterArgument, // cycles: u128,
) -> CallResult<(CanisterIdRecord,)> {
    let extended_arg = CreateCanisterArgumentExtended {
        settings: arg.settings,
        sender_canister_version: Some(canister_version()),
    };
    let cycles: u128 = 1_000_000_000_000;
    call_with_payment128(
        Principal::management_canister(),
        "create_canister",
        (extended_arg,),
        cycles,
    )
    .await
}

pub async fn deposit_cycles_in_canister(arg: CanisterIdRecord, cycles: u128) -> CallResult<()> {
    call_with_payment128(
        Principal::management_canister(),
        "deposit_cycles",
        (arg,),
        cycles,
    )
    .await
}

pub async fn install_code_in_canister(
    arg: InstallCodeArgument,
    wasm_module: Vec<u8>,
) -> CallResult<()> {
    let cycles: u128 = 1_000_000_000_000;

    let extended_arg = InstallCodeArgumentExtended {
        mode: arg.mode,
        canister_id: arg.canister_id,
        wasm_module: wasm_module,
        arg: arg.arg,
        sender_canister_version: Some(canister_version()),
    };

    call_with_payment128(
        Principal::management_canister(),
        "install_code",
        (extended_arg,),
        cycles,
    )
    .await
}

// delete canister
pub async fn reverse_canister_creation(id: CanisterIdRecord) -> Result<(), String> {
    stop_canister(id.clone())
        .await
        .map_err(|err| format!("Failed to stop {:?}", err))?;
    delete_canister(id)
        .await
        .map_err(|err| format!("Failed to delete canister {:?}", err))?;

    Ok(())
}
