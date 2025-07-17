use candid::{CandidType, Decode, Encode, Principal};
use serde::{Deserialize, Serialize};

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
pub struct AgentDetails {
    pub agent_id: Principal,
    pub agent_name: String,
    pub purpose: String,
    pub link_of_document: String,
    pub cool_down_period: u32,
    pub image_canister: Principal,
    pub image_id: String,
    pub members: Vec<Principal>,
    pub members_count: u32,
    pub proposals_count: u32,
    pub proposal_ids: Vec<String>,
    pub token_ledger_id: LedgerCanisterId,
    pub total_tokens: u32,
    pub token_symbol: String,
    pub agent_canister_id: Principal,
    pub all_agent_user : Vec<Principal>,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct AgentCreationInput {
    pub agent_name: String,
    pub purpose: String,
    pub link_of_document: String,
    pub cool_down_period: u32,
    pub members: Vec<Principal>,
    pub linksandsocials: Vec<String>,
    pub image_canister: Principal,
    pub image_id: String,
    pub token_symbol: String,
    pub token_supply: u32,
    pub parent_agent_canister_id: Principal,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct AddMemberArgs {
    pub group_name: String,
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