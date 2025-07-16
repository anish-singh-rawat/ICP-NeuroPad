use candid::Principal;
use crate::guards::*;

use crate::{
    routes::{
        add_proposal_controller, get_latest_proposal_controller,
        get_proposal_controller,
    },
    with_state, ProposalValueStore,
};


#[ic_cdk::update(guard = guard_child_canister_only)]
pub async fn remove_joined_dao(dao_id: Principal, principal_id: Principal) -> Result<(), String> {
    with_state(|state| {
        if let Some(profile) = state.user_profile.get(&principal_id) {
            let mut updated_profile = profile.clone();
            if updated_profile.join_dao.contains(&dao_id) {
                updated_profile.join_dao.retain(|id| id != &dao_id);
                state.user_profile.insert(principal_id, updated_profile);
                Ok(())
            } else {
                Err(format!("You haven't join this DAO: {}", dao_id))
            }
        } else {
            Err(format!(
                "User profile not found for principal: {}",
                principal_id
            ))
        }
    })
}

#[ic_cdk::update(guard = guard_child_canister_only)]
pub async fn store_join_dao(dao_id: Principal, principal_id: Principal) -> Result<(), String> {
    with_state(|state| {
        if let Some(profile) = state.user_profile.get(&principal_id) {
            let mut updated_profile = profile.clone();
            updated_profile.join_dao.push(dao_id);
            state.user_profile.insert(principal_id, updated_profile);
            Ok(())
        } else {
            Err(format!(
                "User profile not found for principal: {}",
                principal_id
            ))
        }
    })
}

#[ic_cdk::update(guard = guard_child_canister_only)]
pub fn add_proposal(args: crate::ProposalValueStore) -> Result<String, String> {
    // with_state(|state| add_proposal_controller(state, args))
    //     .map_err(|err| return format!("Error in proposal: {:?}", err))

    with_state(|state| {
        let analytics = state.analytics_content.get(&0);

        add_proposal_controller(state, args)
            .map_err(|err| return format!("Error in proposal: {:?}", err))?;

        match analytics {
            Some(mut val) => {
                val.proposals_count = val.proposals_count + 1;
                state.analytics_content.insert(0, val);
                Ok(String::from(crate::utils::SUCCESS_PROPOSAL))
            }

            None => return Err(String::from(crate::utils::ERROR_ANALYTICS)),
        }
    })
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_proposals(args: crate::Pagination) -> Vec<ProposalValueStore> {
    with_state(|state| get_proposal_controller(state, args))
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub async fn get_my_proposals(args: crate::Pagination) -> Vec<ProposalValueStore> {
    let mut my_proposals: Vec<ProposalValueStore> = Vec::new();

    with_state(|state| {
        for (_key, proposal) in state.proposal_store.iter() {
            if ic_cdk::api::caller() == proposal.created_by {
                my_proposals.push(proposal.clone());
            }
        }

        let total_proposals = my_proposals.len();

        if total_proposals == 0 {
            return vec![];
        }

        let start = args.start as usize;
        let end = args.end as usize;

        if start < total_proposals {
            let end = end.min(total_proposals);
            return my_proposals[start..end].to_vec();
        }

        my_proposals
    })
}

#[ic_cdk::query(guard = prevent_anonymous)]
pub fn get_latest_proposals(args: crate::Pagination) -> Vec<ProposalValueStore> {
    with_state(|state| get_latest_proposal_controller(state, args))
}
