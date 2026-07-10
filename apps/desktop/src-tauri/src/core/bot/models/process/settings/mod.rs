// apps/desktop/src-tauri/src/core/bot/models/process/settings/mod.rs
mod context;
mod error;

pub(self) use context::SettingsErrorContext;
pub(in crate::core::bot) use context::SettingsStorageContext;
pub(in crate::core::bot) use error::{SettingsError, SettingsFailure};
