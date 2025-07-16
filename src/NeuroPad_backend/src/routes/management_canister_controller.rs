use crate::api::call::{call, CallResult};
use crate::*;
use candid::Principal;


// to stop canister
pub async fn stop_canister(arg: CanisterIdRecord) -> CallResult<()> {
    call(Principal::management_canister(), "stop_canister", (arg,)).await
}

// to delete canister (need stop canister to be executed first)
pub async fn delete_canister(arg: CanisterIdRecord) -> CallResult<()> {
    call(Principal::management_canister(), "delete_canister", (arg,)).await
}

