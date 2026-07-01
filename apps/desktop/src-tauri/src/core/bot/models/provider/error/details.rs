// apps/desktop/src-tauri/src/core/bot/models/provider/error/details.rs
use serde::Serialize;

use super::super::super::SettingsError;
use super::super::ProviderId;
use super::{ProviderAppError, ProviderError};

/// Provider-specific structured application boundary error details.
///
/// Provider 领域的结构化应用边界错误细节。
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct ProviderErrorDetails {
    /// Provider-domain scope that identifies where the error originated.
    ///
    /// 标识错误来源位置的 Provider 领域范围。
    domain_scope: String,
    /// Provider task context where this error occurred, when available.
    ///
    /// 错误发生时可归属的 Provider 任务上下文。
    #[serde(skip_serializing_if = "Option::is_none")]
    provider_id: Option<ProviderId>,
    /// Provider boundary errors observed but not selected as the primary error.
    ///
    /// 已观察到但未被选为主错误的 Provider 边界错误。
    #[serde(skip_serializing_if = "Option::is_none")]
    suppressed_errors: Option<Vec<ProviderAppError>>,
}

impl ProviderErrorDetails {
    /// Projects an internal provider error into the base boundary details.
    ///
    /// 将内部 Provider 错误投影为基础边界细节。
    fn from_error(error: &ProviderError) -> Self {
        Self {
            domain_scope: Self::domain_scope_from(error).to_string(),
            provider_id: Self::provider_id_from(error),
            suppressed_errors: None,
        }
    }

    /// Projects provider task context from an internal provider error when present.
    ///
    /// 从内部 Provider 错误中投影可用的 Provider 任务上下文。
    fn provider_id_from(error: &ProviderError) -> Option<ProviderId> {
        match error {
            ProviderError::ManagerRequestPayloadAbsent { context }
            | ProviderError::CheckStartedEmit { context, .. }
            | ProviderError::CheckStatusEmit { context, .. }
            | ProviderError::CheckCompletedEmit { context, .. }
            | ProviderError::CheckFailedEmit { context, .. }
            | ProviderError::CheckTaskJoin { context, .. }
            | ProviderError::CheckAggregate { context }
            | ProviderError::HealthCheckMissingConfig { context }
            | ProviderError::HealthCheckNetwork { context, .. }
            | ProviderError::HealthCheckHttp { context }
            | ProviderError::HealthCheckResponseFormat { context, .. }
            | ProviderError::UnsupportedProvider { context, .. }
            | ProviderError::ConfigNotFound { context }
            | ProviderError::JsonSerialize { context, .. }
            | ProviderError::JsonDeserialize { context, .. }
            | ProviderError::ConfigStore { context, .. }
            | ProviderError::SecretStoreInit { context, .. }
            | ProviderError::SecretStoreWrite { context, .. }
            | ProviderError::SecretStoreRead { context, .. }
            | ProviderError::SecretStoreRemove { context, .. } => context.subject().provider_id(),
        }
    }

    /// Creates provider details with suppressed boundary errors attached.
    ///
    /// 创建附带被抑制边界错误的 Provider 错误细节。
    pub(super) fn with_suppressed_errors(
        error: &ProviderError,
        suppressed_errors: Vec<ProviderAppError>,
    ) -> Self {
        Self {
            suppressed_errors: (!suppressed_errors.is_empty()).then_some(suppressed_errors),
            ..Self::from_error(error)
        }
    }

    /// Projects an internal provider error into a provider-domain scope.
    ///
    /// 将内部 Provider 错误投影为 Provider 领域范围。
    fn domain_scope_from(error: &ProviderError) -> &'static str {
        match error {
            ProviderError::ManagerRequestPayloadAbsent { .. } => {
                "provider.manager.request.validate"
            }
            ProviderError::CheckStartedEmit { .. }
            | ProviderError::CheckStatusEmit { .. }
            | ProviderError::CheckCompletedEmit { .. }
            | ProviderError::CheckFailedEmit { .. } => "provider.lifecycle.event.emit",
            ProviderError::CheckTaskJoin { .. } | ProviderError::CheckAggregate { .. } => {
                "provider.lifecycle.check.execute"
            }
            ProviderError::HealthCheckMissingConfig { .. } => "provider.connection.check.validate",
            ProviderError::HealthCheckNetwork { .. } | ProviderError::HealthCheckHttp { .. } => {
                "provider.connection.check.request"
            }
            ProviderError::HealthCheckResponseFormat { .. } => "provider.connection.check.parse",
            ProviderError::UnsupportedProvider { .. } => "provider.store.config.validate",
            ProviderError::ConfigNotFound { .. } => "provider.store.config.find",
            ProviderError::JsonSerialize { .. } => "provider.store.config.serialize",
            ProviderError::JsonDeserialize { .. } => "provider.store.config.deserialize",
            ProviderError::ConfigStore { source, .. } => match *source {
                SettingsError::StoreOpen { .. } => "provider.store.config.open",
                SettingsError::StorePath { .. } => "provider.store.config.resolve",
                SettingsError::StoreSerialize { .. } => "provider.store.config.serialize",
                SettingsError::StoreTempCreate { .. }
                | SettingsError::StoreWrite { .. }
                | SettingsError::StoreSync { .. }
                | SettingsError::StoreReplace { .. } => "provider.store.config.write",
            },
            ProviderError::SecretStoreInit { .. } => "provider.store.secret.init",
            ProviderError::SecretStoreWrite { .. } => "provider.store.secret.write",
            ProviderError::SecretStoreRead { .. } => "provider.store.secret.read",
            ProviderError::SecretStoreRemove { .. } => "provider.store.secret.remove",
        }
    }
}

impl From<&ProviderError> for ProviderErrorDetails {
    /// Projects an internal provider error into structured boundary details.
    ///
    /// 将内部 Provider 错误投影为结构化边界细节。
    fn from(error: &ProviderError) -> Self {
        Self::from_error(error)
    }
}
