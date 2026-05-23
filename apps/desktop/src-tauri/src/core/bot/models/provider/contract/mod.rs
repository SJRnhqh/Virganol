// apps/desktop/src-tauri/src/core/bot/models/provider/contract/mod.rs
mod base;
mod manager;

pub(self) use base::{ProviderCommandRequest, ProviderCommandResponse};
pub(crate) use manager::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
