// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/mod.rs
mod client;
mod deepseek;
mod health;
mod ollama;
mod probe;
mod registry;
mod resolved;

pub(self) use client::get_http_client;
pub(self) use deepseek::deepseek_check;
pub(self) use health::health_check;
pub(self) use ollama::ollama_check;
pub(super) use probe::probe_provider_connection;
pub(self) use registry::get_driver;
pub(super) use resolved::health_check_with_resolved_key;
