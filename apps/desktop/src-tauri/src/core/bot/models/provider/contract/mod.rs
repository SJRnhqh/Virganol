// apps/desktop/src-tauri/src/core/bot/models/provider/contract/mod.rs
mod base;
mod connect;
mod reset;
mod update;

pub(self) use base::ProviderCommandResponse;
pub(crate) use connect::{ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse};
pub(crate) use reset::ResetProviderResponse;
pub(crate) use update::{UpdateEnabledModelsRequest, UpdateEnabledModelsResponse};
