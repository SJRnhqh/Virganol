// apps/desktop/src-tauri/src/commands/bot/mod.rs
mod provider;

pub(crate) use provider::{
    connect_and_save_provider, reset_provider, trigger_provider_manual_refresh,
    trigger_provider_startup_check, update_enabled_models,
};
