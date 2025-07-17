use candid::Principal;
use ic_cdk::api;

use crate::with_state;

// middleware guard to prevent anonymous user
pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from(crate::utils::ANONYMOUS_USER));
    }
    Ok(())
}

// check user existance
pub fn check_for_user_guard(user: &Principal) -> Result<(), String> {
    prevent_anonymous()?;
    if with_state(|state| state.user_profile.contains_key(&user)) {
        return Ok(());
    } else {
        return Err(String::from(crate::utils::USER_DOES_NOT_EXIST));
    }
}
