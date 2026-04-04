// apps/desktop/src-tauri/src/core/bot/services/settings/provider/mod.rs
// 导出内容
mod connection;
mod crud;
mod persistence;
mod selection;

pub(crate) use connection::health_check;
pub(crate) use crud::connect_and_save;
pub(crate) use persistence::{
    load_provider_record, load_supported_providers, remove_provider, save_provider, update_models,
};
pub(crate) use selection::compute_enabled_models;
