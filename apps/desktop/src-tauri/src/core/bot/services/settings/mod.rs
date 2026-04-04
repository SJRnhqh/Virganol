// apps/desktop/src-tauri/src/core/bot/services/settings/mod.rs
// 导出内容
mod common;
mod provider;

pub(crate) use common::{load_settings, load_settings_strict, save_settings};
pub(crate) use provider::{
    compute_enabled_models, connect_and_save, health_check, load_provider_key,
    load_provider_key_from_env, load_provider_record, load_supported_providers, remove_provider,
    remove_provider_key, save_provider, update_models,
};
