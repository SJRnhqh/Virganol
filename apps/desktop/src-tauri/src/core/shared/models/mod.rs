// apps/desktop/src-tauri/src/core/shared/models/mod.rs
mod error;
mod log;
mod state;

pub(in crate::core) use error::AppError;
pub(in crate::core) use log::{LogEntry, LogLevel};
pub(crate) use state::AppState;
