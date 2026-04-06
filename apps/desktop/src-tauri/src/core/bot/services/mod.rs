// apps/desktop/src-tauri/src/core/bot/services/mod.rs
// 导出内容
mod settings;

pub(crate) use settings::{
    check_providers_lifecycle, connect_and_save, load_supported_providers, reset_provider_config,
    save_provider, update_provider_enabled_models,
};
