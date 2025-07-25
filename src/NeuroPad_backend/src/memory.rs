use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;

const USER_DATA: MemoryId = MemoryId::new(1);
const AGENT_DATA: MemoryId = MemoryId::new(2);
const WASM_DATA: MemoryId = MemoryId::new(4);
const CANISTER_META_DATA: MemoryId = MemoryId::new(5);
const TOKEN_STACK_STATE: MemoryId = MemoryId::new(7);


pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

pub fn get_user_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(USER_DATA))
}

pub fn get_agent_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(AGENT_DATA))
}

pub fn get_wasm_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(WASM_DATA))
}

pub fn get_canister_data_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(CANISTER_META_DATA))
}
pub fn get_token_stack_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(TOKEN_STACK_STATE))
}
