// apps/desktop/src-tauri/src/core/bot/services/settings/provider/mod.rs
// 导出内容
mod connection;
mod crud;
mod key;
mod lifecycle;
mod persistence;
mod selection;

pub(crate) use connection::health_check;
pub(crate) use crud::{connect_and_save, reset_provider_config, update_provider_enabled_models};
pub(crate) use key::{
    load_provider_key, load_provider_key_from_env, remove_provider_key, save_provider_key,
};
pub(crate) use lifecycle::check_providers_lifecycle;
pub(crate) use persistence::{
    load_provider_record, load_supported_providers, remove_provider, save_provider, update_models,
};
pub(crate) use selection::compute_enabled_models;
