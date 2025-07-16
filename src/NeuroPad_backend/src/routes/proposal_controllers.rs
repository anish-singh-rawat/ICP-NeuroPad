use crate::{state_handler::State, ProposalValueStore};

// to record new proposals
pub fn add_proposal_controller(
    state: &mut State,
    args: ProposalValueStore,
) -> Result<String, String> {
    state.proposal_store.insert(args.proposal_id.clone(), args);

    Ok(String::from("Proposal added"))
}

// to get all proposals
pub fn get_proposal_controller(
    state: &mut State,
    pagination: crate::Pagination,
) -> Vec<ProposalValueStore> {
    let mut all_proposals: Vec<ProposalValueStore> = Vec::new();

    for (_key, proposal) in state.proposal_store.iter() {
        all_proposals.push(proposal);
    }

    let ending = all_proposals.len();

    if ending == 0 {
        return vec![];
    }

    let start = pagination.start as usize;
    let end = pagination.end as usize;

    if start < ending {
        let end = end.min(ending);
        return all_proposals[start..end].to_vec();
    }

    all_proposals
}

// get latest proposals
pub fn get_latest_proposal_controller(
    state: &mut State,
    pagination: crate::Pagination,
) -> Vec<ProposalValueStore> {
    let mut all_proposals: Vec<ProposalValueStore> = Vec::new();

    for (_key, proposal) in state.proposal_store.iter() {
        all_proposals.push(proposal);
    }

    let ending = all_proposals.len();

    if ending == 0 {
        return vec![];
    }

    all_proposals.sort_by(|a, b| b.proposal_submitted_at.cmp(&a.proposal_submitted_at));

    let start = pagination.start as usize;
    let end = pagination.end as usize;

    if start < ending {
        let end = end.min(ending);
        return all_proposals[start..end].to_vec();
    }

    all_proposals
}

// get my proposals
pub fn get_my_proposal_controller(
    state: &mut State,
    pagination: crate::Pagination,
) -> Vec<ProposalValueStore> {
    let mut my_proposals: Vec<ProposalValueStore> = Vec::new();

    for (_key, val) in state.proposal_store.iter() {
        if val.dao_members.contains(&ic_cdk::api::caller()) {
            my_proposals.push(val);
        }
    }

    let ending: usize = my_proposals.len();

    if ending == 0 {
        return vec![];
    }

    my_proposals.sort_by(|a, b| b.proposal_submitted_at.cmp(&a.proposal_submitted_at));

    let start = pagination.start as usize;
    let end = pagination.end as usize;

    if start < ending {
        let end = end.min(ending);
        return my_proposals[start..end].to_vec();
    }

    my_proposals
}