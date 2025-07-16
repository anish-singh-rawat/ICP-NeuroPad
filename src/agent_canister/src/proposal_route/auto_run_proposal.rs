use ic_cdk_timers::set_timer;
use std::time::Duration;

// use crate::functions::icrc_transfer;

pub fn start_proposal_checker(expird_at : u64) {
    set_timer(Duration::from_nanos(expird_at), move || {
        // check_proposals();
        // icrc_transfer(ledger_canister_id, args)
    });
}