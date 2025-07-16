use crate::proposal_route::{create_proposal_controller, execute_proposal_on_required_vote};
use crate::{
    guards::*, AddMemberArgs, AddMemberToDaoArgs, BountyDone, BountyRaised, ChangeDaoConfigArg, ChangeDaoPolicy, CreateGeneralPurpose, CreatePoll, DaoGroup, JoinDao, LedgerCanisterId, MintTokenArgs, PollOptions, ProposalCreation, ProposalInput, ProposalState, RemoveDaoMemberArgs, RemoveMemberArgs, TokenTransferPolicy, UpdatePermissionPayload
};
use crate::icrc_get_balance;
use crate::{with_state, ProposalType};
use candid::{Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{query, update};
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};
use sha2::{Digest, Sha256};

#[query(guard = prevent_anonymous)]
async fn get_members_of_group(group: String) -> Result<Vec<Principal>, String> {
    with_state(|state| match state.dao_groups.get(&group) {
        Some(val) => Ok(val.group_members),
        None => Err(String::from(crate::utils::NOTFOUND_GROUP)),
    })
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_add_member_to_group(args: AddMemberArgs) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::AddMemberToGroupProposal,
    };
    guard_check_proposal_creation(proposal_data)?;

    let result = with_state(|state| {
        match state
            .dao_groups
            .iter()
            .find(|(_, group)| group.group_name == args.group_name)
        {
            Some(_) => Ok(()),
            None => Err(format!("No Group Name found with '{}'", args.group_name)),
        }
    });

    if result.is_err() {
        return Err(format!("No Group Name found with '{}' ", args.group_name));
    }

    //create condition for check if group is exit or not for adding member , removing members

    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(args.new_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_ADD_MEMBER),
        proposal_type: ProposalType::AddMemberToGroupProposal,
        group_to_join: Some(args.group_name.clone()),
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
    };

    with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&args.group_name) {
            if dao_group.group_members.contains(&args.new_member) {
                return Err(format!("Member already exist in this group"));
            }
        }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;

    Ok(String::from(crate::utils::REQUEST_ADD_MEMBER))
}


#[update(guard = prevent_anonymous)]
async fn proposal_to_add_member_to_council(args: AddMemberToDaoArgs) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::AddMemberToDaoProposal,
    };
    guard_check_proposal_creation(proposal_data)?;
    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(args.new_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_ADD_MEMBER_TO_COUNCIL),
        proposal_type: ProposalType::AddMemberToDaoProposal,
        group_to_join: None,
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
        updated_group_permissions : None,
    };

    with_state(|state: &mut crate::state_handler::State| {
            if state.dao.members.contains(&args.new_member) {
                return Err(format!("Member already exist in this group"));
            }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;

    Ok(String::from(crate::utils::REQUEST_ADD_COUNCIL))
}


#[update(guard = prevent_anonymous)]
async fn proposal_to_remove_member_to_group(args: RemoveMemberArgs) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::RemoveMemberToGroupProposal,
    };
    guard_check_proposal_creation(proposal_data)?;
    let result = with_state(|state| {
        match state
            .dao_groups
            .iter()
            .find(|(_, group)| group.group_name == args.group_name)
        {
            Some(_) => Ok(()),
            None => Err(format!("No Group Name found with '{}'", args.group_name)),
        }
    });
    if result.is_err() {
        return Err(format!("No Group Name found with '{}' ", args.group_name));
    }
    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_REMOVE_MEMBER_FROM_GROUP),
        proposal_type: ProposalType::RemoveMemberToGroupProposal,
        group_to_remove: Some(args.group_name.clone()),
        new_dao_name: None,
        dao_purpose: None,
        group_to_join: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        required_votes: None,
        cool_down_period: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
        updated_group_permissions : None,
    };

    with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&args.group_name) {
            if !dao_group.group_members.contains(&args.action_member) {
                return Err(format!("Member does not exist in this group"));
            }
        }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::TITLE_DELETE_MEMBER))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_remove_member_to_dao(args: RemoveDaoMemberArgs) -> Result<String, String> {
    let mut required_thredshold = 0;
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::RemoveMemberToDaoProposal,
    };
    guard_check_proposal_creation(proposal_data)?;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_REMOVE_MEMBER),
        proposal_type: ProposalType::RemoveMemberToDaoProposal,
        group_to_join: None,
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
    };

    with_state(|state| {
        if !state.dao.members.contains(&args.action_member) {
            return Err(format!("Member does not exist in this dao"));
        }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::TITLE_DELETE_MEMBER))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_change_dao_config(args: ChangeDaoConfigArg) -> Result<String, String> {
    let mut required_thredshold = 0;
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::ChangeDaoConfig,
    };
    guard_check_proposal_creation(proposal_data)?;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CHANGE_DAO_CONFIG),
        proposal_type: ProposalType::ChangeDaoConfig,
        new_dao_name: Some(args.new_dao_name),
        group_to_join: None,
        dao_purpose: Some(args.purpose),
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
    };

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_CHANGE_DAO_CONFIG))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_change_dao_policy(args: ChangeDaoPolicy) -> Result<String, String> {
    let mut required_thredshold = 0;
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::ChangeDaoPolicy,
    };
    guard_check_proposal_creation(proposal_data)?;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CHANGE_DAO_POLICY),
        proposal_type: ProposalType::ChangeDaoPolicy,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        updated_group_permissions : None,
        group_to_remove: None,
        required_votes: None,
        cool_down_period: Some(args.cool_down_period),
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: Some(args.required_votes),
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : Some(args.ask_to_join_dao),
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_CHANGE_DAO_POLICY))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_transfer_token(args: TokenTransferPolicy) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::TokenTransfer,
    };
    guard_check_proposal_creation(proposal_data)?;
    let principal_id: Principal = api::caller();

    if principal_id == args.to {
        return Err(String::from("transfer token with the self isn't possible"));
    };
    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(principal_id),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_TOKEN_TRANSFER_POLICY),
        proposal_type: ProposalType::TokenTransfer,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(api::id()),
        token_to: Some(args.to),
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_TOKEN_TRANSFER_POLICY))
}

async fn transfer(tokens: u64, user_principal: Principal) -> Result<BlockIndex, String> {
    let canister_id: Principal = ic_cdk::api::id();
    let ledger_canister_id = with_state(|state| state.dao.token_ledger_id.id);

    let transfer_args = TransferFromArgs {
        amount: tokens.into(),
        to: Account {
            owner: canister_id,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: user_principal,
            subaccount: None,
        },
    };

    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    .0
    .map_err(|e| format!("ledger transfer error {:?}", e))
}

#[update(guard = prevent_anonymous)]
async fn make_payment(tokens: u64, user: Principal) -> Result<Nat, String> {
    if tokens.clone() < 1{
        return Err(String::from("tokens should be greater than 0"));
     }
    transfer(tokens, user).await
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_bounty_raised(args: BountyRaised) -> Result<String, String> {
    if args.tokens.clone() < 1{
        return Err(String::from("tokens should be greater than 0"));
     }
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::BountyRaised,
    };
    guard_check_proposal_creation(proposal_data)?;
    let principal_id: Principal = api::id();
    let token_ledger_id: Principal = with_state(|state| state.dao.token_ledger_id.id);
    let balance: Nat = icrc_get_balance(token_ledger_id, principal_id)
        .await
        .map_err(|err| format!("Error while fetching user balance: {}", err))?;

    if balance < args.tokens as u64 {
        return Err(format!("DAO doesn't have enough tokens."));
    }

    let mut required_thredshold = 0;
    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
               Err(format!("No place Found with the name of {}",args.proposal_entry))
            }
        }
    });
    
    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_BOUNTY_RAISED),
        proposal_type: ProposalType::BountyRaised,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(ic_cdk::api::id()),
        token_to: Some(api::caller()),
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: Some(args.bounty_task),
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        ask_to_join_dao : None,
        poll_options: None,
    };

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;

    Ok(String::from(crate::utils::MESSAGE_BOUNTY_RAISED))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_bounty_done(args: BountyDone) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::BountyRaised,
    };
    let daohouse_backend_id = with_state(|state| state.dao.daohouse_canister_id);
    guard_check_proposal_creation(proposal_data)?;
    let proposals_data = with_state(|state| state.proposals.get(&args.associated_proposal_id));
    
    let principal_id: Principal = api::id();
    let token_ledger_id: Principal = with_state(|state| state.dao.token_ledger_id.id);
    
    let balance: Nat = icrc_get_balance(token_ledger_id, principal_id)
    .await
        .map_err(|err| format!("Error while fetching user balance: {}", err))?;

    if balance < args.tokens as u64 {
        return Err(format!("DAO doesn't have enough tokens."));
    }

    let mut bounty_task: Option<String> = None;
    let mut token_to: Option<Principal> = None;

    if let Some(proposal) = proposals_data {
        let proposal_type = proposal.proposal_type;
        let proposal_status = proposal.proposal_status;
        let proposal_owner = proposal.created_by;

        if proposal_type != ProposalType::BountyRaised {
            return Err(String::from(
                "The Proposal you wish to done is not related to the bounty raised",
            ));
        };
        if proposal_status != ProposalState::Accepted {
            return Err(String::from(
                "The Proposal you wish to done is not under the Accepted status",
            ));
        }
        if proposal_owner != api::caller() {
            return Err(String::from(
                "bounty is not raised by you with this proposal ID",
            ));
        }

        token_to = proposal.token_to;
        bounty_task = proposal.bounty_task;
    } else {
        return Err(String::from("No proposal Found with this id"));
    }

    let mut required_thredshold = 0;
    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal_input = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_BOUNTY_DONE),
        proposal_type: ProposalType::BountyDone,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(api::id()),
        token_to: token_to,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task,
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: Some(args.associated_proposal_id.clone()),
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
    };
    create_proposal_controller(daohouse_backend_id.clone(), proposal_input.clone()).await;
    Ok(String::from(crate::utils::MESSAGE_BOUNTY_DONE))
}

#[update(guard = vote_allow_dao_user_only)]
async fn vote_on_poll_options(proposal_id: String, option_id: String) -> Result<String, String> {
    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(proposal_data) => {
            if proposal_data.proposal_type == ProposalType::Polls {
                if proposal_data.required_votes > (proposal_data.proposal_rejected_votes as u32 + proposal_data.proposal_approved_votes as u32) {
                if proposal_data.proposal_status == ProposalState::Open {
                    if let Some(option) = proposal_data.poll_options.iter_mut()
                        .flat_map(|options| options.iter_mut())
                        .find(|opt| opt.id == option_id)
                    {
                        if option.approved_users.contains(&api::caller()) {
                            Err("You have already voted on this option.".to_string())
                        } 
                        else if proposal_data.approved_votes_list.contains(&api::caller()) {
                            Err("You have already voted on this proposal.".to_string())
                        }
                        else {
                            option.poll_approved_votes += 1;
                            option.approved_users.push(api::caller());
                            proposal_data.approved_votes_list.push(api::caller());
                            proposal_data.proposal_approved_votes += 1;
                            if option.poll_approved_votes as u32 == proposal_data.required_votes {
                                state.proposals.insert(proposal_id, proposal_data.to_owned());
                                execute_proposal_on_required_vote(state, proposal_data.proposal_id.clone());
                            }
                            Ok("Vote submitted successfully.".to_string())
                        }
                    } else {
                        Err("Option ID not found in this poll.".to_string())
                    }
                } else {
                    Err(format!("Proposal has been {:?} ", proposal_data.proposal_status))
                }
            }
            else { Err(format!("The proposal received the maximum required votes"))}
                
            } else {
                Err("This is not a Poll type proposal".to_string())
            }
        }
        None => Err("Proposal ID is invalid!".to_string()),
    })
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_create_poll(args: CreatePoll) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::Polls,
    };
    guard_check_proposal_creation(proposal_data)?;

    let mut required_thredshold = 0;
    let proposal_expire_time =
        ic_cdk::api::time() + (args.proposal_expired_at as u64 * 86_400 * 1_000_000_000);
    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let uuids = raw_rand().await.unwrap().0;
    let option_id = format!("{:x}", Sha256::digest(&uuids));

    let mut counter = 0;
    let poll_options: Vec<PollOptions> = args
        .poll_options
        .iter()
        .map(|option| {
            let unique_id = format!("{}-{}", option_id, counter);
            counter += 1;
            PollOptions {
                option: option.clone(),
                id: unique_id,
                poll_approved_votes: 0,
                approved_users: Vec::new(),
            }
        })
        .collect();
    

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CREATE_POLL),
        proposal_type: ProposalType::Polls,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: Some(proposal_expire_time),
        bounty_task: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        ask_to_join_dao : None,
        poll_query: Some(args.poll_query),
        poll_options: Some(poll_options),
        updated_group_permissions : None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_POLL_CREATE_DONE))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_create_general_purpose(args: CreateGeneralPurpose) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::GeneralPurpose,
    };

    guard_check_proposal_creation(proposal_data)?;

    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CREATE_GENERAL_PURPOSE),
        proposal_type: ProposalType::GeneralPurpose,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        ask_to_join_dao : None,
        poll_query: None,
        poll_options: None,
        updated_group_permissions : None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_GENERAL_PURPOSE_CREATED))
}


#[update(guard = prevent_anonymous)]
async fn api_to_update_permission_groups(args : UpdatePermissionPayload)-> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::ChangeGroupPermissions,
    };

    guard_check_proposal_creation(proposal_data)?;
    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CREATE_CHANGE_GROUP_PERMISSION),
        proposal_type: ProposalType::ChangeGroupPermissions,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        ask_to_join_dao : None,
        poll_query: None,
        poll_options: None,
        updated_group_permissions : Some(args.updated_permissions)
    };

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;

    Ok(String::from("Change group proposal created successfully"))
}

#[update(guard = prevent_anonymous)]
async fn ask_to_join_dao(args: JoinDao) -> Result<String, String> {
    crate::guards::guard_check_if_proposal_exists(
        api::caller(),
        ProposalType::AddMemberToGroupProposal,
    )?;
    let daohouse_backend_id = with_state(|state| state.dao.daohouse_canister_id);

    with_state(|state| {
        if state.dao.all_dao_user.contains(&api::caller()) {
            return Err(format!("you are already in this dao"));
        }
        Ok(())
    })?;

    let should_ask = with_state(|state| state.dao.ask_to_join_dao);
    if !should_ask {
        let data: Result<(), &str> = with_state(|state| {
            if let Some(mut group) = state.dao_groups.get(&args.place_to_join) {
                state.dao.all_dao_user.push(api::caller());
                group.group_members.push(api::caller());
                state.dao_groups.insert(args.place_to_join.clone(), group);
            } else {
                return Err("Group does'not exist in this Dao");
            }
            Ok(())
        });

        if let Err(err) = data {
            return Err(err.to_string());
        }
        

        let response: CallResult<(Result<(), String>,)> = ic_cdk::call(
            daohouse_backend_id,
            "store_join_dao",
            (api::id(), api::caller()),
        ).await;

        match response {
            Ok((Ok(()),)) => (),
            Ok((Err(err),)) => return Err(err),
            Err((code, message)) => {
                let err_msg = match code {
                    RejectionCode::NoError => "NoError".to_string(),
                    RejectionCode::SysFatal => "SysFatal".to_string(),
                    RejectionCode::SysTransient => "SysTransient".to_string(),
                    RejectionCode::DestinationInvalid => "DestinationInvalid".to_string(),
                    RejectionCode::CanisterReject => "CanisterReject".to_string(),
                    _ => format!("Unknown rejection code: {:?}: {}", code, message),
                };
                return Err(err_msg);
            }
        };

        return Ok(String::from("Dao Joined successfully"));
    };
    let mut required_thredshold = 0;

    let result = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.place_to_join)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!("No place Found for join this dao"));
            }
        }
    });

    if result.is_err() {
        return Err(format!("No place Found for join this dao"));
    }

    let proposal = ProposalInput {
        proposal_description: String::from(crate::utils::REQUEST_JOIN_DAO),
        group_to_join: Some(args.place_to_join),
        proposal_title: String::from(crate::utils::TITLE_ADD_MEMBER),
        proposal_type: crate::ProposalType::AddMemberToGroupProposal,
        principal_of_action: Some(api::caller()),
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        poll_options: None,
        ask_to_join_dao : None,
        updated_group_permissions : None,
    };
    with_state(| state | state.dao.requested_dao_user.push(api::caller()));
    create_proposal_controller(daohouse_backend_id, proposal).await;
    Ok(String::from("Join DAO request sent successfully"))
}

#[query(guard = prevent_anonymous)]
fn get_dao_members() -> Vec<Principal> {
    with_state(|state| state.dao.members.clone())
}

#[update(guard=guard_daohouse_exclusive_method)]
fn add_ledger_canister_id(id: LedgerCanisterId) -> Result<(), String> {
    with_state(|state| state.dao.token_ledger_id = id);

    Ok(())
}

#[query(guard = prevent_anonymous)]
fn get_dao_groups() -> Vec<DaoGroup> {
    let mut groups: Vec<DaoGroup> = Vec::new();

    with_state(|state| {
        for x in state.dao_groups.iter() {
            groups.push(x.1)
        }
    });

    groups
}

#[update(guard = prevent_anonymous)]
pub async fn proposal_to_mint_new_dao_tokens(args: MintTokenArgs) -> Result<String, String> {
    if args.total_amount.clone() < 1{
       return Err(String::from("total amount should be greater than 0"));
    }
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::MintNewTokens,
    };
    guard_check_proposal_creation(proposal_data)?;
    let mut required_thredshold = 0;
    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });
    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_MINT_NEW_TOKENS),
        proposal_type: ProposalType::MintNewTokens,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.total_amount),
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        updated_group_permissions : None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        poll_query: None,
        ask_to_join_dao : None,
        poll_options: None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_TOKEN_MINT))
}
