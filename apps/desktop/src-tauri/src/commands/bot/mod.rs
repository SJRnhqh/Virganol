// apps/desktop/src-tauri/src/commands/bot/mod.rs
mod provider;
mod providers;

pub(crate) use providers::{
    connect_and_save_provider, trigger_provider_manual_refresh, trigger_provider_startup_check,
};

pub(crate) use provider::{reset_provider, update_enabled_models};
