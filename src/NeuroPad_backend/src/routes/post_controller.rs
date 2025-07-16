use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk::update;
use crate::{with_state, ImageData};
use crate::guards::*;

type ReturnResult = Result<u32, String>;

// upload image
#[update(guard = prevent_anonymous)] // temp
pub async fn upload_image(image_data: ImageData) -> Result<String, String> {
    // dao canister id
    // with_state(|state|)
    // let canister_id = with_state(|state| {
    //     state.get_canister_ids()
    // })?;
    let canister_id = with_state(|state| state.canister_data.get(&0));

    let canister_id = match canister_id {
        Some(val) => val,
        None => return Err(String::from("Canister Meta data not found.")),
    };

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(
        canister_id.ic_asset_canister,
        // Principal::from_text(canister_id.ic_asset_canister).unwrap(),
        "create_file",
        (image_data,),
    )
    .await;
    // format!("{:?}", result.ok());

    let res0: Result<(Result<u32, String>,), (RejectionCode, String)> = response;

    let formatted_value = match res0 {
        Ok((Ok(value),)) => {
            Ok(format!("{}", value))
            // value
        }
        Ok((Err(err),)) => Err(err),
        Err((code, message)) => {
            match code {
                RejectionCode::NoError => Err("NoError".to_string()),
                RejectionCode::SysFatal => Err("SysFatal".to_string()),
                RejectionCode::SysTransient => Err("SysTransient".to_string()),
                RejectionCode::DestinationInvalid => Err("DestinationInvalid".to_string()),
                RejectionCode::CanisterReject => Err("CanisterReject".to_string()),
                // Handle other rejection codes here
                _ => Err(format!("Unknown rejection code: {:?}: {}", code, message)),
                // _ => Err(format!("Unknown rejection code: {:?}", code)),
            }
        }
    };

    formatted_value
}