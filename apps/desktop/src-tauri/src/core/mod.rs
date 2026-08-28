// apps/desktop/src-tauri/src/core/mod.rs
mod bot;
mod shared;

pub(self) use bot::ProviderState;
pub(super) use bot::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models, ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse,
    ProviderAppError, ProviderCheckTrigger, ResetProviderRequest, ResetProviderResponse,
    UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub(self) use shared::{impl_downgrade, AppAttribution, AppError, Downgrade, LogEntry, LogLevel};
pub(super) use shared::{AppLogger, AppState};

// TODO: standardize
mod init;
mod manager;
mod rpc;

pub(super) use init::init;
pub(super) use manager::{SidecarManager, SidecarState};
