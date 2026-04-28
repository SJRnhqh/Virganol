// apps/desktop/src-tauri/src/commands/mod.rs
mod bot;

pub(super) use bot::{
    connect_and_save_provider, reset_provider, trigger_provider_manual_refresh,
    trigger_provider_startup_check, update_enabled_models,
};
