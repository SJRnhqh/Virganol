// apps/desktop/src-tauri/src/core/bot/models/provider/error/details.rs
use serde::Serialize;

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
    /// Provider boundary error produced while recovering from the primary failure.
    ///
    /// 主错误发生后，恢复状态时产生的 Provider 边界错误。
    #[serde(skip_serializing_if = "Option::is_none")]
    recovery_failure: Option<Box<ProviderAppError>>,
}

impl ProviderErrorDetails {
    /// Projects an internal provider error into the base boundary details.
    ///
    /// 将内部 Provider 错误投影为基础边界细节。
    fn from_error(error: &ProviderError) -> Self {
        Self {
            domain_scope: Self::domain_scope_from(error).to_string(),
            provider_id: Self::provider_id_from(error),
            recovery_failure: None,
        }
    }

    /// Projects provider task context from an internal provider error when present.
    ///
    /// 从内部 Provider 错误中投影可用的 Provider 任务上下文。
    fn provider_id_from(error: &ProviderError) -> Option<ProviderId> {
        match error {
            ProviderError::ManagerRequestPayloadAbsent { provider_id }
            | ProviderError::ConfigNotFound { provider_id }
            | ProviderError::JsonSerialize { provider_id, .. }
            | ProviderError::ConfigStoreSerialize { provider_id, .. }
            | ProviderError::ConfigStorePath { provider_id, .. }
            | ProviderError::ConfigStoreTempCreate { provider_id, .. }
            | ProviderError::ConfigStoreWrite { provider_id, .. }
            | ProviderError::ConfigStoreSync { provider_id, .. }
            | ProviderError::ConfigStoreReplace { provider_id, .. }
            | ProviderError::SecretStoreInit { provider_id, .. }
            | ProviderError::SecretStoreWrite { provider_id, .. }
            | ProviderError::SecretStoreRead { provider_id, .. }
            | ProviderError::SecretStoreRemove { provider_id, .. }
            | ProviderError::HealthCheckMissingConfig { provider_id }
            | ProviderError::HealthCheckNetwork { provider_id, .. }
            | ProviderError::HealthCheckHttp { provider_id }
            | ProviderError::HealthCheckResponseFormat { provider_id, .. } => Some(*provider_id),
            ProviderError::JsonDeserialize { provider_id, .. }
            | ProviderError::ConfigStoreOpen { provider_id, .. } => *provider_id,
            _ => None,
        }
    }

    /// Creates provider details with a recovery failure attached.
    ///
    /// 创建附带恢复失败的 Provider 错误细节。
    pub(super) fn with_recovery_failure(
        error: &ProviderError,
        recovery_failure: &ProviderError,
    ) -> Self {
        Self {
            recovery_failure: Some(Box::new(ProviderAppError::from(recovery_failure))),
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
            | ProviderError::CheckStatusEmit(_)
            | ProviderError::CheckCompletedEmit { .. }
            | ProviderError::CheckFailedEmit(_) => "provider.lifecycle.event.emit",
            ProviderError::CheckConcurrentFailed(_) => "provider.lifecycle.check.execute",
            ProviderError::HealthCheckMissingConfig { .. } => "provider.connection.check.validate",
            ProviderError::HealthCheckNetwork { .. } | ProviderError::HealthCheckHttp { .. } => {
                "provider.connection.check.request"
            }
            ProviderError::HealthCheckResponseFormat { .. } => "provider.connection.check.parse",
            ProviderError::ConfigNotFound { .. } => "provider.store.config.find",
            ProviderError::JsonSerialize { .. } | ProviderError::ConfigStoreSerialize { .. } => {
                "provider.store.config.serialize"
            }
            ProviderError::JsonDeserialize { .. } => "provider.store.config.deserialize",
            ProviderError::ConfigStoreOpen { .. } => "provider.store.config.open",
            ProviderError::ConfigStorePath { .. } => "provider.store.config.resolve",
            ProviderError::ConfigStoreTempCreate { .. }
            | ProviderError::ConfigStoreWrite { .. }
            | ProviderError::ConfigStoreSync { .. }
            | ProviderError::ConfigStoreReplace { .. } => "provider.store.config.write",
            ProviderError::SecretStoreInit { .. } => "provider.store.secret.init",
            ProviderError::SecretStoreWrite { .. } => "provider.store.secret.write",
            ProviderError::SecretStoreRead { .. } => "provider.store.secret.read",
            ProviderError::SecretStoreRemove { .. } => "provider.store.secret.remove",
            _ => "provider.unknown",
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
