use crate::{state_handler::State, ProposalValueStore};

// to record new proposals
pub fn add_proposal_controller(
    state: &mut State,
    args: ProposalValueStore,
) -> Result<String, String> {
    state.token_proposal_store.insert(args.proposal_id.clone(), args);

    Ok(String::from("Proposal added"))
}