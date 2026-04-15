// apps/desktop/src-tauri/src/core/bot/mod.rs
// 导出内容
mod constants;
mod helpers;
mod interfaces;
mod models;
mod services;

pub(self) use helpers::compute_enabled_models;
pub(self) use models::ProviderRecord;
pub(crate) use models::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderCheckTrigger, ProviderId,
};
pub(crate) use services::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models,
};
