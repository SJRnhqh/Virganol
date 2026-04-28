// apps/desktop/src-tauri/src/core/bot/services/mod.rs
mod settings;

pub(crate) use settings::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models,
};
