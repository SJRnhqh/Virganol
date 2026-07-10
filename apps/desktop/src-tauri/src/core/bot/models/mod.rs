// apps/desktop/src-tauri/src/core/bot/models/mod.rs
mod process;
mod provider;

pub(super) use process::{SettingsError, SettingsFailure, SettingsStorageContext};
pub(in crate::core) use provider::ProviderState;
pub(crate) use provider::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderAppError,
    ProviderCheckTrigger, ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
pub(super) use provider::{
    HealthCheckResult, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckFinalization, ProviderCheckRunResult, ProviderCheckSnapshot,
    ProviderCheckStartedPayload, ProviderCheckStatusPayload, ProviderError,
    ProviderExecutionContext, ProviderId, ProviderKey, ProviderKeyChange, ProviderKeyMeta,
    ProviderKeySource, ProviderLifecycleContext, ProviderManagerContext, ProviderRecord,
    ProviderResolvedKey, ProviderSubject,
};
