use candid::{CandidType, Principal};
use ic_cdk::api::call::{CallResult, RejectionCode};
use serde::Serialize;

// inter canister call
pub async fn call_inter_canister<T, U>(
    function: &str,
    args: T,
    canister_id: Principal,
) -> Result<U, String>
where
    T: CandidType + Serialize,
    U: CandidType + for<'de> serde::Deserialize<'de>,
{
    let response: CallResult<(Result<U, String>,)> =
        ic_cdk::call(canister_id, function, (args,)).await;

    let res0: Result<(Result<U, String>,), (RejectionCode, String)> = response;

    match res0 {
        Ok((Ok(value),)) => Ok(value),
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => match code {
            RejectionCode::NoError => Err("NoError".to_string()),
            RejectionCode::SysFatal => Err("SysFatal".to_string()),
            RejectionCode::SysTransient => Err("SysTransient".to_string()),
            RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
            RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
            _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
        },
    }
}
