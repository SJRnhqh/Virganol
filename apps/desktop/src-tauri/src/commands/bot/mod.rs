// apps/desktop/src-tauri/src/commands/bot/mod.rs
mod provider;
mod providers;

pub(crate) use provider::{connect_and_save_provider, reset_provider, update_enabled_models};

pub(crate) use providers::{trigger_provider_manual_refresh, trigger_provider_startup_check};
