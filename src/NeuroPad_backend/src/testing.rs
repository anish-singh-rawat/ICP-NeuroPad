use crate::api::call::{call, call_with_payment128, CallResult};
use crate::api::canister_version;
use crate::*;
use candid::Principal;
use ic_cdk::update;


// #[update]
//     pub async fn create_canister(
//         arg: CreateCanisterArgument,
//         cycles: u128,
//     ) -> CallResult<(CanisterIdRecord,)> {
//         let extended_arg = CreateCanisterArgumentExtended {
//             settings: arg.settings,
//             sender_canister_version: Some(canister_version()),
//         };
//         let cycles: u128 = 100_000_000_000;
//         call_with_payment128(
//             Principal::management_canister(),
//             "create_canister",
//             (extended_arg,),
//             cycles,
//         )
//         .await
//     }

// #[update]
// pub async fn update_settings(arg: UpdateSettingsArgument) -> CallResult<()> {
//     let extended_arg = UpdateSettingsArgumentExtended {
//         canister_id: arg.canister_id,
//         settings: arg.settings,
//         sender_canister_version: Some(canister_version()),
//     };
//     call(
//         Principal::management_canister(),
//         "update_settings",
//         (extended_arg,),
//     )
//     .await
// }

// #[update]
// pub async fn upload_chunk(arg: UploadChunkArgument) -> CallResult<(ChunkHash,)> {
//     call(Principal::management_canister(), "upload_chunk", (arg,)).await
// }

// #[update]
// pub async fn clear_chunk_store(arg: ClearChunkStoreArgument) -> CallResult<()> {
//     call(
//         Principal::management_canister(),
//         "clear_chunk_store",
//         (arg,),
//     )
//     .await
// }

// #[update]
// pub async fn stored_chunks(arg: StoredChunksArgument) -> CallResult<(Vec<ChunkHash>,)> {
//     call(Principal::management_canister(), "stored_chunks", (arg,)).await
// }

// #[update]
// pub async fn install_code(arg: InstallCodeArgument) -> CallResult<()> {
//     // let wasm_base64: &str = "3831fb07143cd43c3c51f770342d2b7d0a594311529f5503587bf1544ccd44be";
//     // let wasm_module_sample: Vec<u8> = base64::decode(wasm_base64).expect("Decoding failed");

//     let wasm_module_sample: Vec<u8> = include_bytes!("../../../../.dfx/local/canisters/dao_canister/dao_canister.wasm").to_vec();
    
    
//     let cycles: u128 = 10_000_000_000; 
    
//     let extended_arg = InstallCodeArgumentExtended {
//         mode: arg.mode,
//         canister_id: arg.canister_id,
//         wasm_module: wasm_module_sample,
//         arg: arg.arg,
//         sender_canister_version: Some(canister_version()),
//     };
    
   
//     call_with_payment128(
//         Principal::management_canister(),
//         "install_code",
//         (extended_arg,),
//         cycles, // Provide the increased cycles here
//     ).await
// }


// #[update]
// pub async fn install_chunked_code(arg: InstallChunkedCodeArgument) -> CallResult<()> {
//     let extended_arg = InstallChunkedCodeArgumentExtended {
//         mode: arg.mode,
//         target_canister: arg.target_canister,
//         store_canister: arg.store_canister,
//         chunk_hashes_list: arg.chunk_hashes_list,
//         wasm_module_hash: arg.wasm_module_hash,
//         arg: arg.arg,
//         sender_canister_version: Some(canister_version()),
//     };
//     call(
//         Principal::management_canister(),
//         "install_chunked_code",
//         (extended_arg,),
//     )
//     .await
// }

#[update]
pub async fn uninstall_code(arg: CanisterIdRecord) -> CallResult<()> {
    let extended_arg = CanisterIdRecordExtended {
        canister_id: arg.canister_id,
        sender_canister_version: Some(canister_version()),
    };
    call(
        Principal::management_canister(),
        "uninstall_code",
        (extended_arg,),
    )
    .await
}

#[update]
pub async fn start_canister(arg: CanisterIdRecord) -> CallResult<()> {
    call(Principal::management_canister(), "start_canister", (arg,)).await
}

#[update]
pub async fn stop_canister(arg: CanisterIdRecord) -> CallResult<()> {
    call(Principal::management_canister(), "stop_canister", (arg,)).await
}

#[update]
pub async fn canister_status(arg: CanisterIdRecord) -> CallResult<(CanisterStatusResponse,)> {
    call(Principal::management_canister(), "canister_status", (arg,)).await
}

#[update]
pub async fn delete_canister(arg: CanisterIdRecord) -> CallResult<()> {
    call(Principal::management_canister(), "delete_canister", (arg,)).await
}

#[update]
pub async fn deposit_cycles(arg: CanisterIdRecord, cycles: u128) -> CallResult<()> {
    call_with_payment128(
        Principal::management_canister(),
        "deposit_cycles",
        (arg,),
        cycles,
    )
    .await
}

#[update]
pub async fn raw_rand() -> CallResult<(Vec<u8>,)> {
    call(Principal::management_canister(), "raw_rand", ()).await
}

#[update]
pub async fn canister_info(arg: CanisterInfoRequest) -> CallResult<(CanisterInfoResponse,)> {
    call(Principal::management_canister(), "canister_info", (arg,)).await
}
