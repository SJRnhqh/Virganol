// apps/desktop/src-tauri/src/core/bot/services/settings/provider/mod.rs
// 导出内容
mod connection;
mod crud;
mod selection;

pub(crate) use connection::health_check;
pub(crate) use crud::connect_and_save;
pub(crate) use selection::compute_enabled_models;
