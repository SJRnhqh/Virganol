// apps/desktop/src-tauri/src/core/bot/services/settings/mod.rs
// 导出内容
mod provider;

pub(crate) use provider::{compute_enabled_models, connect_and_save, health_check};
