// apps/desktop/src-tauri/src/core/bot/services/settings/mod.rs
// 导出内容
mod common;
mod provider;

pub(crate) use common::{load_settings, load_settings_strict, save_settings};
pub(crate) use provider::{
    check_providers_lifecycle, compute_enabled_models, connect_and_save, health_check,
    load_provider_key, load_provider_key_from_env, load_supported_providers, reset_provider_config,
    save_provider, update_provider_enabled_models,
};
