// apps/desktop/src-tauri/src/core/bot/models/provider/contract/mod.rs
mod base;
mod connect;
mod manager;

pub(self) use base::{ProviderCommandRequest, ProviderCommandResponse};
pub(crate) use connect::{ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse};
pub(crate) use manager::{
    ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
