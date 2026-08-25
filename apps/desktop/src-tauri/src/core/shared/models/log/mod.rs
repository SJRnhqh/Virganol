// apps/desktop/src-tauri/src/core/shared/models/log/mod.rs
mod app;
mod entry;
mod level;

pub(self) use app::AppLogger;
pub(in crate::core) use entry::LogEntry;
pub(in crate::core) use level::LogLevel;
