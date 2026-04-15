// apps/desktop/src-tauri/src/core/bot/models/mod.rs
// 导出内容
pub mod provider;

pub(super) use provider::ProviderRecord;
pub(crate) use provider::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, HealthCheckResponse,
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckTrigger, ProviderError, ProviderId, ProviderIssue, ProviderKey, ProviderKeySource,
    ProviderSecretMeta, ProviderStatusPayload, SkippedProviderDetail, SupportedProvidersSnapshot,
};
