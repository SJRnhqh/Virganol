// apps/desktop/src-tauri/src/core/bot/models/process/settings/error/mod.rs
mod failure;
mod internal;

pub(in crate::core::bot) use failure::SettingsFailure;
pub(in crate::core::bot) use internal::SettingsError;
