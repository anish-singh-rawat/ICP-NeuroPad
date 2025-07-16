use candid::Principal;
use ic_cdk::api;

pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from(crate::utils::WARNING_ANONYMOUS_CALL));
    }
    Ok(())
}