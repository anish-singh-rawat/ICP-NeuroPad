use crate::State;

use crate::types::UserProfile;
use candid::Principal;
use ic_cdk::api;

pub fn get_user_profile(state: &State) -> Result<UserProfile, String> {
    let principal_id = api::caller();

    if principal_id == Principal::anonymous() {
        Err("Anonymous principal not allowed to make calls.".to_string())
    } else if let Some(profile) = state.user_profile.get(&principal_id) {
        let user_profile: UserProfile = profile.clone();
        Ok(user_profile)

    } else {
        Err("User profile not found".to_string())
    }
}

