// apps/desktop/src-tauri/src/core/bot/models/mod.rs
// 导出内容
pub mod provider;

pub(crate) use provider::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderCheckCompletedPayload,
    ProviderCheckFailedPayload, ProviderCheckStartedPayload, ProviderCheckTrigger, ProviderId,
    ProviderIssue, ProviderKeySource, ProviderSecretMeta, ProviderStatusPayload,
};
pub(super) use provider::{
    HealthCheckResponse, ProviderError, ProviderKey, ProviderRecord, SkippedProviderDetail,
    SupportedProvidersSnapshot,
};
