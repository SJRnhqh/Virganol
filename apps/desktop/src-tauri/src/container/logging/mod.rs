// apps/desktop/src-tauri/src/container/logging/mod.rs
mod color;
mod console;
mod file;
mod registration;

pub(self) use color::ColoredFields;
pub(self) use console::console_layer;
pub(self) use file::jsonl_layer;
pub(super) use registration::init_logging;
