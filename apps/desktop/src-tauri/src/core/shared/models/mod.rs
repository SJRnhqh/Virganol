// apps/desktop/src-tauri/src/core/shared/models/mod.rs
mod context;
mod error;
mod log;
mod state;

pub(in crate::core) use context::AppAttribution;
pub(in crate::core) use error::AppError;
pub(crate) use log::AppLogger;
pub(in crate::core) use log::{LogEntry, LogLevel};
pub(crate) use state::AppState;
