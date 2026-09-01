// apps/desktop/src-tauri/src/core/bot/models/mod.rs
mod process;
mod provider;

pub(super) use process::{SettingsError, SettingsStorageContext};
pub(in crate::core) use provider::ProviderState;
pub(crate) use provider::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderAppError,
    ProviderCheckTrigger, ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
pub(super) use provider::{
    HealthCheckResult, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckFinalization, ProviderCheckRunResult, ProviderCheckStartedPayload,
    ProviderCheckStatusPayload, ProviderError, ProviderExecutionContext, ProviderId, ProviderKey,
    ProviderKeyChange, ProviderKeyMeta, ProviderKeySource, ProviderLifecycleContext,
    ProviderLogEntry, ProviderManagerContext, ProviderRecord, ProviderResolvedKey, ProviderSpan,
    ProviderSubject,
};
