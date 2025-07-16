use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(Clone, Debug, CandidType, Deserialize, PartialEq)]
pub enum ProposalState {
    Open,
    Accepted,
    Rejected,
    Executing,
    Succeeded,
    Expired,
    Unreachable,
}

#[derive(Clone, Debug, CandidType, Deserialize, PartialEq)]
pub enum TransferResult {
    Ok(String),
    Err(String),
}

#[derive(
    CandidType, Serialize, Deserialize, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Default,
)]
pub struct ProposalPlace {
    pub place_name : String,
    pub min_required_thredshold : u64,
}


#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct ProposalCreation{
    pub entry: String, 
    pub proposal_type: ProposalType
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum ProposalType {
    AddMemberToDaoProposal,
    AddMemberToGroupProposal,
    RemoveMemberToDaoProposal,
    RemoveMemberToGroupProposal,
    ChangeDaoConfig,
    ChangeDaoPolicy,
    BountyRaised,
    BountyDone,
    Polls,
    TokenTransfer,
    GeneralPurpose,
    MintNewTokens,
    ChangeGroupPermissions,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct AccountBalance {
    pub id: Principal,
    pub staked: u32,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct MintTokenArgs {
    pub total_amount: u64,
    pub description: String,
    pub proposal_entry : String,
}


#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct ProposalStakes {
    pub proposal_id: String,
    pub balances: Vec<AccountBalance>,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct JoinDao {
    pub place_to_join : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct UpdateGroupPermission{
    pub group_name : String,
    pub updated_permissions : Vec<ProposalType>
}

#[derive(Clone, CandidType, Deserialize, Serialize, Debug)]
pub struct UpdatePermissionPayload {
    pub proposal_entry : String,
    pub description : String,
    pub updated_permissions : UpdateGroupPermission,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct Proposals {
    pub proposal_id: String,
    pub proposal_title: String,
    pub proposal_description: String,
    pub proposal_status: ProposalState,
    pub proposal_submitted_at: u64,
    pub proposal_expired_at: u64,
    pub proposal_approved_votes: u64,
    pub approved_votes_list: Vec<Principal>,
    pub proposal_rejected_votes: u64,
    pub rejected_votes_list: Vec<Principal>,
    pub required_votes: u32,
    pub created_by: Principal,
    pub comments: u32,
    pub likes: u32,
    pub comments_list: Vec<Comment>,
    pub proposal_type: ProposalType,
    pub share_count: u64,
    pub principal_of_action: Principal, 
    pub group_to_join: Option<String>,
    pub new_dao_name : Option<String>,
    pub new_dao_purpose : Option<String>,
    pub group_to_remove: Option<String>,
    pub cool_down_period: Option<u32>,
    pub tokens: Option<u64>,
    pub token_from: Option<Principal>,
    pub token_to: Option<Principal>,
    pub has_been_processed: bool, 
    pub has_been_processed_second : bool,
    pub minimum_threadsold : u64,
    pub link_of_task : Option<String>,
    pub bounty_task : Option<String>,
    pub associated_proposal_id : Option<String>,
    pub new_required_votes : Option<u32>,
    pub poll_query :  Option<String>,
    pub poll_options: Option<Vec<PollOptions>>,
    pub ask_to_join_dao : Option<bool>,
    pub updated_group_permissions : Option<UpdateGroupPermission>,
}


#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct Comment {
    pub author_principal: Principal,
    pub comment_text: String,
    pub comment_id: String,
    pub replies: Vec<ReplayComment>,
    pub likes: u16,
    pub created_at: u64,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct ReplayComment {
    pub reply_comment : String,
    pub commented_by : Principal,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct ProposalInput {
    pub proposal_title: String,
    pub proposal_description: String,
    pub required_votes: Option<u32>,
    pub group_to_join: Option<String>,
    pub group_to_remove: Option<String>,
    pub proposal_type: ProposalType,
    pub principal_of_action: Option<Principal>,
    pub new_dao_name : Option<String>,
    pub dao_purpose : Option<String>,
    pub tokens : Option<u64>,
    pub token_to: Option<Principal>,
    pub token_from: Option<Principal>,
    pub proposal_created_at: Option<u64>,
    pub proposal_expired_at: Option<u64>,
    pub bounty_task : Option<String>,
    pub cool_down_period : Option<u32>,
    pub minimum_threadsold : u64,
    pub link_of_task : Option<String>,
    pub associated_proposal_id :  Option<String>,
    pub new_required_votes : Option<u32>,
    pub poll_query :  Option<String>,
    pub poll_options: Option<Vec<PollOptions>>,
    pub ask_to_join_dao : Option<bool>,
    pub updated_group_permissions : Option<UpdateGroupPermission>,
}

#[derive(Clone , Debug, CandidType, Serialize, Deserialize)]
pub struct PollOptions {
    pub option : String,
    pub id: String,
    pub poll_approved_votes : u64,
    pub approved_users : Vec<Principal>,
}

#[derive(CandidType, Serialize, Deserialize)]
pub struct Pagination {
    pub start: u32,
    pub end: u32,
}

#[derive(CandidType, Serialize, Deserialize)]
pub struct CommentLikeArgs {
    pub proposal_id: String,
    pub comment_id: String,
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ReplyCommentArgs {
    pub proposal_id: String,
    pub comment_id: String,
    pub comment: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct LedgerCanisterId {
    pub id: Principal,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct Dao {
    pub dao_id: Principal,
    pub dao_name: String,
    pub purpose: String,
    pub link_of_document: String,
    pub cool_down_period: u32,
    pub linksandsocials: Vec<String>,
    pub required_votes: u32,
    pub groups_count: u64,
    pub image_canister: Principal,
    pub image_id: String,
    pub members: Vec<Principal>,
    pub members_count: u32,
    pub members_permissions: Vec<ProposalType>,
    pub proposals_count: u32,
    pub proposal_ids: Vec<String>,
    pub token_ledger_id: LedgerCanisterId,
    pub total_tokens: u32,
    pub token_symbol: String,
    pub daohouse_canister_id: Principal,
    pub proposal_entry : Vec<ProposalPlace>,
    pub ask_to_join_dao : bool,
    pub all_dao_user : Vec<Principal>,
    pub requested_dao_user : Vec<Principal>,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct ChangeDaoConfigArg {
    pub new_dao_name: String,
    pub purpose: String,
    pub description: String,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct ChangeDaoPolicyArg {
    pub cool_down_period: u32,
    pub required_votes: u32,
    pub action_member: Principal,
    pub proposal_entry : String,
}



#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct DaoGroup {
    pub group_name: String,
    pub group_members: Vec<Principal>,
    pub group_permissions: Vec<ProposalType>,
    pub quorem: u8,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct DaoInput {
    pub dao_name: String,
    pub purpose: String,
    pub link_of_document: String,
    pub cool_down_period: u32,
    pub members: Vec<Principal>,
    pub linksandsocials: Vec<String>,
    pub required_votes: u32,
    pub dao_groups: Vec<DaoGroup>,
    pub image_canister: Principal,
    pub image_id: String,
    pub members_permissions: Vec<ProposalType>,
    pub token_symbol: String,
    pub token_supply: u32,
    pub daohouse_canister_id: Principal,
    pub proposal_entry : Vec<ProposalPlace>,
    pub ask_to_join_dao : bool,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct AddMemberArgs {
    pub group_name: String,
    pub new_member: Principal,
    pub description: String,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct AddMemberToDaoArgs {
    pub new_member: Principal,
    pub description: String,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct RemoveMemberArgs {
    pub group_name: String,
    pub action_member: Principal,
    pub description: String,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct RemoveDaoMemberArgs {
    pub action_member: Principal,
    pub description: String,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct ChangeDaoPolicy{
    pub description: String,
    pub required_votes : u32,
    pub cool_down_period : u32,
    pub proposal_entry : String,
    pub ask_to_join_dao : bool,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct TokenTransferPolicy{
    pub description: String,
    pub tokens: u64,
    pub to : Principal,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct BountyRaised{
    pub description: String,
    pub bounty_task : String,
    pub proposal_entry : String,
    pub tokens: u64,
}
#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct BountyDone{
    pub description: String,
    pub tokens: u64,
    pub proposal_entry : String,
    pub associated_proposal_id : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct CreatePoll{
    pub description: String,
    pub poll_options : Vec<String>,
    pub proposal_expired_at: u64,
    pub proposal_entry : String,
    pub poll_query : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct CreateGeneralPurpose{
    pub proposal_title : String,
    pub description: String,
    pub proposal_entry : String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, PartialEq)]
pub enum VoteParam {
    Yes,
    No,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct ProposalInstance {
    pub associated_dao_canister_id: Principal,
    pub proposal_id: String,
    pub propsal_title: String,
    pub proposal_description: String,
    pub proposal_submitted_at: u64,
    pub proposal_expired_at : u64,
    pub required_votes: u32,
    pub created_by: Principal,
    pub proposal_type: ProposalType,
    pub principal_action : Principal,
    pub dao_members: Vec<Principal>,
    pub minimum_threadsold : u64,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct TokenTransferArgs {
    pub tokens: u64,
    pub from: Principal,
    pub to: Principal,
}

#[derive(CandidType, Serialize, Deserialize)]
pub struct TokenBalanceArgs {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

const MAX_VALUE_SIZE: u32 = 600;

impl Storable for Proposals {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}


impl Storable for DaoGroup {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

impl Storable for ProposalStakes {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}
