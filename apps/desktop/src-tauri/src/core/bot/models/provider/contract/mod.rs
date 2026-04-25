// apps/desktop/src-tauri/src/core/bot/models/provider/contract/mod.rs
mod base;
mod connect;
mod manager;
mod reset;

pub(self) use base::{ProviderCommandRequest, ProviderCommandResponse};
pub(crate) use connect::{ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse};
pub(crate) use manager::{UpdateEnabledModelsRequest, UpdateEnabledModelsResponse};
pub(crate) use reset::{ResetProviderRequest, ResetProviderResponse};
