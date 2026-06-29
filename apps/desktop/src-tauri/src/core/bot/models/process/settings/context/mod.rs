// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/mod.rs
mod error;
mod storage;

pub(in crate::core::bot) use error::SettingsErrorContext;
pub(in crate::core::bot) use storage::SettingsStorageContext;
