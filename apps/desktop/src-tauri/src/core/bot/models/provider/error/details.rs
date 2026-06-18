// apps/desktop/src-tauri/src/core/bot/models/provider/error/details.rs
use serde::Serialize;

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
    /// Provider boundary error produced while recovering from the primary failure.
    ///
    /// 主错误发生后，恢复状态时产生的 Provider 边界错误。
    #[serde(skip_serializing_if = "Option::is_none")]
    recovery_failure: Option<Box<ProviderAppError>>,
}

impl ProviderErrorDetails {
    /// Creates provider details with a recovery failure attached.
    ///
    /// 创建附带恢复失败的 Provider 错误细节。
    pub(super) fn with_recovery_failure(
        error: &ProviderError,
        recovery_failure: &ProviderError,
    ) -> Self {
        Self {
            domain_scope: Self::domain_scope_from(error).to_string(),
            recovery_failure: Some(Box::new(ProviderAppError::from(recovery_failure))),
        }
    }

    /// Projects an internal provider error into a provider-domain scope.
    ///
    /// 将内部 Provider 错误投影为 Provider 领域范围。
    fn domain_scope_from(error: &ProviderError) -> &'static str {
        match error {
            ProviderError::ManagerRequestPayloadAbsent(_) => "provider.manager.request.validate",
            ProviderError::CheckStartedEmit(_)
            | ProviderError::CheckStatusEmit(_)
            | ProviderError::CheckCompletedEmit(_)
            | ProviderError::CheckFailedEmit(_) => "provider.lifecycle.event.emit",
            ProviderError::CheckConcurrentFailed(_) => "provider.lifecycle.check.execute",
            ProviderError::HealthCheckMissingConfig(_) => "provider.connection.check.validate",
            ProviderError::HealthCheckNetwork(_) | ProviderError::HealthCheckHttp(_) => {
                "provider.connection.check.request"
            }
            ProviderError::HealthCheckResponseFormat(_) => "provider.connection.check.parse",
            ProviderError::ConfigNotFound(_) => "provider.store.config.find",
            ProviderError::JsonSerialize(_) | ProviderError::ConfigStoreSerialize(_) => {
                "provider.store.config.serialize"
            }
            ProviderError::JsonDeserialize(_) => "provider.store.config.deserialize",
            ProviderError::ConfigStoreOpen(_) => "provider.store.config.open",
            ProviderError::ConfigStorePath(_) => "provider.store.config.resolve",
            ProviderError::ConfigStoreTempCreate(_)
            | ProviderError::ConfigStoreWrite(_)
            | ProviderError::ConfigStoreSync(_)
            | ProviderError::ConfigStoreReplace(_) => "provider.store.config.write",
            ProviderError::SecretStoreInit(_) => "provider.store.secret.init",
            ProviderError::SecretStoreWrite(_) => "provider.store.secret.write",
            ProviderError::SecretStoreRead(_) => "provider.store.secret.read",
            ProviderError::SecretStoreRemove(_) => "provider.store.secret.remove",
            _ => "provider.unknown",
        }
    }
}

impl From<&ProviderError> for ProviderErrorDetails {
    /// Projects an internal provider error into structured boundary details.
    ///
    /// 将内部 Provider 错误投影为结构化边界细节。
    fn from(error: &ProviderError) -> Self {
        Self {
            domain_scope: Self::domain_scope_from(error).to_string(),
            recovery_failure: None,
        }
    }
}
