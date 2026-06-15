// apps/desktop/src-tauri/src/core/bot/models/provider/contract/mod.rs
mod base;
mod lifecycle;
mod manager;

pub(self) use base::{ProviderCommandRequest, ProviderCommandResponse};
pub(in crate::core::bot) use lifecycle::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckStatusPayload,
};
pub(crate) use manager::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
