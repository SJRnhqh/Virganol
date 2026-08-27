// apps/desktop/src-tauri/src/container/mod.rs
mod app;
mod lifecycle;
mod logging;
mod registration;
mod sidecar;

pub use app::run;
pub(self) use lifecycle::{handle_event, setup};
pub(self) use logging::init_logging;
pub(self) use registration::register;
pub(self) use sidecar::{prepare_sidecar, shutdown_sidecar};
