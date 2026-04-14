// apps/desktop/src-tauri/src/core/bot/services/settings/common/mod.rs
// 导出内容
mod persistence;

pub(super) use persistence::{load_settings, save_settings};
