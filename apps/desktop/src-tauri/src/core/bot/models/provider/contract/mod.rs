// apps/desktop/src-tauri/src/core/bot/models/provider/contract/mod.rs
mod connect;
mod reset;

pub(crate) use connect::{ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse};
pub(crate) use reset::ResetProviderResponse;
