// apps/desktop/src-tauri/src/core/shared/mod.rs
mod interfaces;
mod models;

pub(super) use interfaces::Downgrade;
pub(super) use models::AppError;
pub(crate) use models::AppState;
