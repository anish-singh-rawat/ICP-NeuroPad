cargo build --release --target wasm32-unknown-unknown --package agent_canister

candid-extractor target/wasm32-unknown-unknown/release/agent_canister.wasm >src/agent_canister/agent_canister.did

cargo build --release --target wasm32-unknown-unknown --package NeuroPad_backend

candid-extractor target/wasm32-unknown-unknown/release/NeuroPad_backend.wasm >src/NeuroPad_backend/NeuroPad_backend.did

cargo build --release --target wasm32-unknown-unknown --package ic_asset_handler

candid-extractor target/wasm32-unknown-unknown/release/ic_asset_handler.wasm >src/ic_asset_handler/ic_asset_handler.did

