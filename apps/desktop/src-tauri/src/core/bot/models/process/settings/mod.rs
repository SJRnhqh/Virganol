// apps/desktop/src-tauri/src/core/bot/models/process/settings/mod.rs
mod context;
mod error;

pub(in crate::core::bot) use context::{SettingsErrorContext, SettingsStorageContext};
pub(in crate::core::bot) use error::SettingsError;
