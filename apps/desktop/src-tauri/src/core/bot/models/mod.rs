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
    ProviderCheckStartedPayload, ProviderCheckStatusPayload, ProviderError,
    ProviderExecutionContext, ProviderId, ProviderKey, ProviderKeyChange, ProviderKeyMeta,
    ProviderKeySource, ProviderLifecycleContext, ProviderManagerContext, ProviderRecord,
    ProviderResolvedKey, ProviderSubject,
};
