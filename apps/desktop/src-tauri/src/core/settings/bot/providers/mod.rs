// apps/desktop/src-tauri/src/core/settings/bot/providers/mod.rs
// 导出内容
pub mod lifecycle;
pub mod service;
#[path = "lifecycle/snapshot.rs"]
mod snapshot;
pub mod store;
mod utils;
