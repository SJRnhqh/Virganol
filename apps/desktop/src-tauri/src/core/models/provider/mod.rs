// apps/desktop/src-tauri/src/core/models/provider/mod.rs
// 导出内容
pub mod check;
pub mod error;
mod id;
mod snapshot;

pub use id::ProviderId;
pub use snapshot::SupportedProvidersSnapshot;
