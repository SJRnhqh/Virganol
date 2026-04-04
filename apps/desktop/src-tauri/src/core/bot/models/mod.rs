// apps/desktop/src-tauri/src/core/bot/models/mod.rs
// 导出内容
pub(crate) mod provider;

pub use provider::{
    ConnectAndSaveProviderRequest, HealthCheckResponse, ProviderCheckCompletedPayload,
    ProviderCheckFailedPayload, ProviderCheckStartedPayload, ProviderCheckTrigger, ProviderError,
    ProviderId, ProviderIssue, ProviderKey, ProviderKeySource, ProviderRecord, ProviderSecretMeta,
    ProviderStatusPayload, SkippedProviderDetail, SupportedProvidersSnapshot,
};
