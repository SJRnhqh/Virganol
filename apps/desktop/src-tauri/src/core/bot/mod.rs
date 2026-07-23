// apps/desktop/src-tauri/src/core/bot/mod.rs
mod constants;
mod interfaces;
mod models;
mod services;

pub(self) use constants::{
    DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
    PROVIDER_CONFIG_STORE_SCOPES, PROVIDER_CONNECTION_SCOPES, PROVIDER_KEYRING_SERVICE,
    PROVIDER_LIFECYCLE_EMIT_SCOPES, PROVIDER_MANAGER_SCOPES, PROVIDER_SECRET_STORE_SCOPES,
    SETTINGS_FILE, SPIRIT_PROVIDERS_KEY,
};
pub(self) use interfaces::{DriverFuture, ProviderDriver};
pub(super) use models::ProviderState;
pub(crate) use models::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderAppError,
    ProviderCheckTrigger, ResetProviderRequest, ResetProviderResponse, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};
pub(self) use models::{
    HealthCheckResult, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckFinalization, ProviderCheckRunResult, ProviderCheckSnapshot,
    ProviderCheckStartedPayload, ProviderCheckStatusPayload, ProviderError,
    ProviderExecutionContext, ProviderId, ProviderKey, ProviderKeyChange, ProviderKeyMeta,
    ProviderKeySource, ProviderLifecycleContext, ProviderManagerContext, ProviderRecord,
    ProviderResolvedKey, ProviderSubject, SettingsError, SettingsStorageContext,
};
pub(crate) use services::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    update_provider_enabled_models,
};
