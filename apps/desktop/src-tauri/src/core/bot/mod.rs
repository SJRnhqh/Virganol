// apps/desktop/src-tauri/src/core/bot/mod.rs
// 导出内容
mod constants;
mod helpers;
mod interfaces;
mod models;
mod services;

pub(self) use constants::{PROVIDER_KEYRING_SERVICE, SETTINGS_FILE, SPIRIT_PROVIDERS_KEY};
pub(self) use helpers::compute_enabled_models;
pub(self) use interfaces::{DriverFuture, ProviderDriver};
pub(crate) use models::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderCheckTrigger,
    ProviderId, ResetProviderResponse,
};
pub(self) use models::{
    HealthCheckResponse, ProviderError, ProviderKey, ProviderRecord, SkippedProviderDetail,
    SupportedProvidersSnapshot,
};
pub(crate) use services::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models,
};
