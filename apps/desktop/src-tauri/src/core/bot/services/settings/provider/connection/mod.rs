// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/mod.rs
// 导出内容
mod client;
mod deepseek;
mod health;
mod ollama;
mod registry;

pub(self) use client::get_http_client;
pub(self) use deepseek::deepseek_check;
pub(super) use health::health_check;
pub(self) use ollama::ollama_check;
pub(self) use registry::get_driver;
