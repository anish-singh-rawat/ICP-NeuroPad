use candid::Principal;
use ic_cdk::api;

use crate::{with_state, ProposalCreation, ProposalType};

pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from(crate::utils::WARNING_ANONYMOUS_CALL));
    }
    Ok(())
}

pub fn check_voting_right(proposal_id: &String) -> Result<(), String> {
    // guard_check_members()?;
    prevent_anonymous()?;
    let principal_id = api::caller();

    with_state(|state| match state.proposals.get(&proposal_id) {
        Some(pro) => {
            if !pro.approved_votes_list.contains(&principal_id)
                && !pro.rejected_votes_list.contains(&principal_id)
            {
                Ok(())
            } else {
                Err(String::from(crate::utils::WARNING_ALREADY_VOTED))
            }
        }
        None => Err(String::from(crate::utils::WARNING_NO_PROPOSAL)),
    })
}

pub fn guard_check_proposal_creation(proposal_data : ProposalCreation) -> Result<(), String> {
    with_state(|state| {
        if let Some(proposal_place) = state.dao.proposal_entry.iter().find(|p| p.place_name == proposal_data.entry) {
            if let Some(group) = state.dao_groups.get(&proposal_data.entry) {
                if group.group_members.contains(&api::caller()) {
                    if group.group_permissions.contains(&proposal_data.proposal_type) {
                        return Ok(());
                    } else {
                        return Err(format!("{} doesn't have permission for creating this proposal", proposal_place.place_name));
                    }
                } else {
                    return Err(format!("You are not part of group {}", proposal_place.place_name));
                }
            } else {
                if state.dao.members.contains(&api::caller()) {
                    if state.dao.members_permissions.contains(&proposal_data.proposal_type) {
                        return Ok(());
                    } else {
                        return Err(format!("Members don't have permission for creating this type of proposal"));
                    }
                } else {
                    return Err(format!("You are not a member of {}", proposal_data.entry));
                }
            }
        } else {
            return Err(format!("No place found with the name of {}", proposal_data.entry));
        }
    })
}

pub fn guard_check_if_proposal_exists(
    action_principal: Principal,
    proposal_type: ProposalType,
) -> Result<(), String> {
    prevent_anonymous()?;
    with_state(|state| {
        for (_key, val) in state.proposals.iter() {
            if val.proposal_type == proposal_type && val.principal_of_action == action_principal {
                return Err(String::from(crate::utils::WARNING_PROPOSAL_EXISTS));
            }
        }
        Ok(())
    })
}

pub fn guard_daohouse_exclusive_method() -> Result<(), String> {
    if api::caller() == with_state(|state| state.dao.daohouse_canister_id) {
        return Ok(());
    } else {
        return Err(String::from(crate::utils::WARNING_NOT_ALLOWED));
    }
}

pub fn vote_allow_dao_user_only() -> Result<(), String>{
    prevent_anonymous()?;
    with_state(|state| {
    if state.dao.all_dao_user.contains(&api::caller()) {
        return Ok(());
   }
   else{
    return Err(String::from(crate::utils::WARNING_DAO_USER_ONLY));
   }
   })
}