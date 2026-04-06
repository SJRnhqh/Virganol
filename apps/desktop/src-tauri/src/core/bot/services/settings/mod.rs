// apps/desktop/src-tauri/src/core/bot/services/settings/mod.rs
// 导出内容
mod common;
mod provider;

pub(crate) use common::{load_settings, save_settings};
pub(crate) use provider::{
    check_providers_lifecycle, connect_and_save, load_supported_providers, reset_provider_config,
    save_provider, update_provider_enabled_models,
};
