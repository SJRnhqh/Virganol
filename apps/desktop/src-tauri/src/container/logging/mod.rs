// apps/desktop/src-tauri/src/container/logging/mod.rs
mod console;
mod registration;

pub(self) use console::console_layer;
pub(super) use registration::init_logging;
