use crate::State;

use crate::types::UserProfile;
use candid::Principal;
use ic_cdk::api;

pub fn get_user_profile(state: &State) -> Result<UserProfile, String> {
    let principal_id = api::caller();

    let user_submitted_proposals : u64  = state.token_proposal_store.iter().filter(|(_key, proposal)| proposal.created_by == principal_id).count().try_into().unwrap();

    if principal_id == Principal::anonymous() {
        Err("Anonymous principal not allowed to make calls.".to_string())
    } else if let Some(profile) = state.user_profile.get(&principal_id) {
        let mut user_profile: UserProfile = profile.clone();
        // user_profile.submitted_proposals = user_submitted_proposals;
        Ok(user_profile)

    } else {
        Err("User profile not found".to_string())
    }
}

