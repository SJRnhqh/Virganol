// apps/desktop/src-tauri/src/core/bot/models/mod.rs
// 导出内容
pub mod provider;

pub(crate) use provider::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderCheckCompletedPayload,
    ProviderCheckFailedPayload, ProviderCheckStartedPayload, ProviderCheckTrigger, ProviderIssue,
    ProviderKeySource, ProviderSecretMeta, ProviderState, ProviderStatusPayload,
    ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
pub(super) use provider::{
    HealthCheckResponse, ProviderError, ProviderId, ProviderKey, ProviderRecord,
    SkippedProviderDetail, SupportedProvidersSnapshot,
};
