// apps/desktop/src-tauri/src/core/bot/services/settings/common/mod.rs
mod persistence;
mod store;

pub(super) use persistence::save_settings;
pub(super) use store::load_settings;
