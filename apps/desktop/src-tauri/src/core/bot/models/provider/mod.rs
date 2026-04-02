// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
// 导出内容
mod connection;
mod error;
mod id;
mod record;

pub use connection::{ConnectAndSaveProviderRequest, HealthCheckResponse};
pub use error::{ProviderError, ProviderErrorCode, ProviderIssue, SkippedProviderDetail};
pub use id::ProviderId;
pub use record::ProviderRecord;
