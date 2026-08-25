// apps/desktop/src-tauri/src/core/shared/models/mod.rs
mod error;
mod log;
mod state;

pub(in crate::core) use error::AppError;
pub(crate) use state::AppState;
