// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/mod.rs
mod error;
mod stage;
mod storage;

pub(super) use error::SettingsErrorContext;
pub(self) use stage::SettingsStage;
pub(in crate::core::bot) use storage::SettingsStorageContext;
