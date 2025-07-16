use crate::guards::*;

use crate::{
    routes::{
        add_proposal_controller,
        get_proposal_controller,
    },
    with_state, ProposalValueStore,
};


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