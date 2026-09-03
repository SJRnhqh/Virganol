// apps/desktop/src-tauri/src/container/logging/mod.rs
mod color;
mod console;
mod constants;
mod file;
mod registration;
mod reporting;
mod retention;

pub(self) use color::ColoredFields;
pub(self) use console::console_layer;
pub(self) use constants::{LOG_FILE_EXT, LOG_FILE_STEM};
pub(self) use file::jsonl_layer;
pub(super) use registration::init_logging;
pub(self) use reporting::ReportingWriter;
pub(self) use retention::clean_expired_logs;
