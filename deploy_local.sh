set -e
# dfx generate

# dfx build

# add delete canister for icrc1_ledger_canister

dfx identity new minter --storage-mode=plaintext || true
dfx identity new reciever --storage-mode=plaintext || true
dfx identity new testing --storage-mode=plaintext || true
# dfx identity new Bhanu --storage-mode=plaintext || true
dfx identity new Anish --storage-mode=plaintext || true


# dfx identity use default
# dfx identity use Bhanu

# to generate wasm
# cargo build --target wasm32-unknown-unknown -p agent_canister
dfx canister create agent_canister
dfx canister create ic_asset_handler
dfx canister create NeuroPad_backend

dfx canister create icrc1_ledger_canister
dfx build icrc1_ledger_canister

dfx build agent_canister
dfx build ic_asset_handler
dfx build NeuroPad_backend


# FOR ICP LEDGER
MINTER_ACCOUNT_ID=$(dfx --identity anonymous ledger account-id)
DEFAULT_ACCOUNT_ID=$(dfx --identity default ledger account-id)

# CANISTER IDS
ASSET_CANISTER_ID=$(dfx canister id ic_asset_handler)
AGENT_CANISTER_ID=$(dfx canister id agent_canister)



# cargo install candid-extractor

# create .did files
chmod 777 ./generate_did.sh
./generate_did.sh

MINTER=$(dfx --identity default identity get-principal)
DEFAULT=$(dfx --identity default identity get-principal)
RECIEVER="kws6j-lg7qz-4hnac-saj7i-l2i7g-i2rnx-zaby7-yvn5r-ggp37-ebev6-aae" 
# m2zqz-pr5r2-ozayk-w5trf-mt6mw-7vuys-mitrw-4qdpb-dm5p7-77ey6-fae
PRO=$(dfx --identity minter identity get-principal) # rmehg-adw5r-6trpq-epk4r-tyl4c-dd2u4-erbw4-kcjzr-rrjpf-dfvi2-oae
Anish=$(dfx --identity Anish identity get-principal)  # yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae

TOKEN_SYMBOL=TOK
TOKEN_NAME="DAOTOKEN"
TRANSFER_FEE=1000
PRE_MINTED_TOKENS=100000000000
DIFFERENT=20000000
echo $RECIEVER


dfx deploy icrc1_ledger_canister --argument "(variant {Init = 
record {
    token_symbol = \"${TOKEN_SYMBOL}\";
    token_name = \"${TOKEN_NAME}\";
    minting_account = record { owner = principal \"${MINTER}\" };
    transfer_fee = ${TRANSFER_FEE};
    metadata = vec {}; 
    initial_balances = vec {
        record { record { owner = principal \"${Anish}\" }; ${PRE_MINTED_TOKENS} };
        record { record { owner = principal \"${PRO}\" }; ${PRE_MINTED_TOKENS} };
        record { record { owner = principal \"${RECIEVER}\" }; ${DIFFERENT} }
    };
    archive_options = record {
        num_blocks_to_archive = 100;
        trigger_threshold = 100;
        controller_id = principal \"${DEFAULT}\";
    };
    feature_flags = opt record { icrc2 = true; };
}
})"

NEUROPAD_BACKEND_ID=$(dfx canister id NeuroPad_backend)



dfx deploy agent_canister --argument "(record {
    daohouse_canister_id = principal \"${NEUROPAD_BACKEND_ID}\";
    dao_name = \"Sample DAO\";
    token_symbol = \"BUNNU\";
    token_supply = 12;
    purpose = \"To manage community projects\";
    link_of_document = \"https://example.com/charter.pdf\";
    cool_down_period = 7;
    members = vec {
        principal \"aaaaa-aa\";
    };
    tokenissuer = \"sample_token_issuer\";
    linksandsocials = vec {
        \"https://twitter.com/sampledao\";
        \"https://discord.gg/sampledao\";
    };
    required_votes = 100;
    image_id = \"1\";
    image_canister = principal \"aaaaa-aa\";
    members_permissions = vec {
        variant { AddMemberToGroupProposal };
        variant { Polls };
        variant { TokenTransfer };
    };
    proposal_entry = vec {
        record {
            place_name = \"Council\";
            min_required_thredshold = 53;
        };
        record {
            place_name = \"Example Group\";
            min_required_thredshold = 94;
        };
    };

    dao_groups = vec {
        record {
            group_name = \"Example Group\";
            group_members = vec { principal \"yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae\" };
            group_permissions = vec {
              variant { AddMemberToGroupProposal };
              variant { Polls };
              variant { TokenTransfer };
            };
            quorem = 75;
        };
    };
    ask_to_join_dao = true;
})"



dfx deploy NeuroPad_backend --argument "(record { payment_recipient = principal \"${RECIEVER}\"; ic_asset_canister_id = principal \"${ASSET_CANISTER_ID}\"; agent_canister_id = principal \"${AGENT_CANISTER_ID}\"; })"

 dfx deploy ic_asset_handler
 dfx deploy internet_identity
 dfx deploy NeuroPad_backend
dfx deploy NeuroPad_frontend
# dfx deploy


# dfx generate

