// apps/desktop/src-tauri/src/core/shared/mod.rs
mod interfaces;
mod models;

pub(super) use interfaces::{impl_downgrade, Downgrade};
pub(super) use models::{AppAttribution, AppError, LogEntry, LogLevel};
pub(crate) use models::{AppLogger, AppState};
