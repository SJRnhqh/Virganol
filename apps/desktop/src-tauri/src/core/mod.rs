// apps/desktop/src-tauri/src/core/mod.rs
mod bot;
mod init;
mod manager;
mod rpc;
mod shared;

pub(self) use bot::ProviderState;
pub(super) use bot::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models, ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse,
    ProviderCheckTrigger, ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
pub(super) use init::init;
pub(super) use manager::{SidecarManager, SidecarState};
pub(super) use shared::AppState;
