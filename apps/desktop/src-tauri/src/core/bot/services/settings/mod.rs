// apps/desktop/src-tauri/src/core/bot/services/settings/mod.rs
mod common;
mod provider;

pub(self) use common::{load_settings, save_settings};
pub(crate) use provider::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models,
};
