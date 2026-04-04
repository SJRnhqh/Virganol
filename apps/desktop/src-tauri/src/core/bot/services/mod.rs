// apps/desktop/src-tauri/src/core/bot/services/mod.rs
// 导出内容
mod settings;

pub(crate) use settings::{
    compute_enabled_models, connect_and_save, health_check, load_settings, load_settings_strict,
    save_settings,
};
