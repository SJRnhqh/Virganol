// apps/desktop/src-tauri/src/core/bot/models/mod.rs
mod provider;

pub(in crate::core) use provider::ProviderState;
pub(crate) use provider::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderCheckTrigger,
    ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
pub(super) use provider::{
    HealthCheckResult, ProviderAppError, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckFinalization, ProviderCheckRunResult, ProviderCheckSnapshot,
    ProviderCheckStartedPayload, ProviderCheckStatusPayload, ProviderError, ProviderId,
    ProviderIssue, ProviderKey, ProviderKeyChange, ProviderKeyMeta, ProviderKeyResolution,
    ProviderKeySource, ProviderRecord,
};
