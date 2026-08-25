// apps/desktop/src-tauri/src/core/shared/mod.rs
mod interfaces;
mod models;

pub(super) use interfaces::{impl_downgrade, Downgrade};
pub(crate) use models::AppState;
pub(super) use models::{AppError, LogEntry, LogLevel};
