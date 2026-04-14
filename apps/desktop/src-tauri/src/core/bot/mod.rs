// apps/desktop/src-tauri/src/core/bot/mod.rs
// 导出内容
mod constants;
mod helpers;
pub(crate) mod interfaces;
pub(crate) mod models;
mod services;

pub(crate) use services::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models,
};
