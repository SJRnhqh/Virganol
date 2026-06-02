// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/mod.rs
mod load;
mod save;

pub(in crate::core::bot::services::settings) use load::load_settings;
pub(self) use load::open_store;
pub(in crate::core::bot::services::settings) use save::save_settings;
