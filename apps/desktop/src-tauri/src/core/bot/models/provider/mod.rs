// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
// 导出内容
mod check;
mod connection;
mod error;
mod id;
mod key;
mod record;
mod security;
mod snapshot;

pub use check::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckTrigger, ProviderStatusPayload,
};
pub use connection::{ConnectAndSaveProviderRequest, HealthCheckResponse};
pub use error::{ProviderError, ProviderErrorCode, ProviderIssue, SkippedProviderDetail};
pub use id::ProviderId;
pub use key::ProviderKey;
pub use record::ProviderRecord;
pub use security::{ProviderKeySource, ProviderSecretMeta};
pub use snapshot::SupportedProvidersSnapshot;
