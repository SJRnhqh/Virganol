// apps/desktop/src-tauri/src/core/bot/services/settings/provider/mod.rs
// 导出内容
mod connection;
mod key;
mod lifecycle;
mod manager;
mod store;

pub(self) use connection::health_check;
pub(self) use key::{load_provider_env, load_provider_key, remove_provider_key, save_provider_key};
pub(crate) use lifecycle::check_providers_lifecycle;
pub(crate) use manager::{connect_and_save, reset_provider_config, update_provider_enabled_models};
pub(self) use store::{
    load_provider_record, load_supported_providers, remove_provider, save_provider, update_models,
};
