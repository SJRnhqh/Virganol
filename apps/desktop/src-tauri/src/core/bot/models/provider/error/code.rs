// apps/desktop/src-tauri/src/core/bot/models/provider/error/code.rs
use serde::Serialize;

use super::ProviderError;

/// Provider-specific application boundary error code.
///
/// Provider 领域的应用边界错误码。
#[derive(Serialize)]
pub(super) enum ProviderErrorCode {
    /// Manager/request layer: received a command payload without required data.
    ///
    /// manager/request 层：收到缺少必需 data 字段的命令载荷。
    #[serde(rename = "missing_request_data")]
    MissingRequestData,
    /// Lifecycle layer: provider check lifecycle event emission failed.
    ///
    /// lifecycle 层：Provider 检查生命周期事件推送失败。
    #[serde(rename = "check_lifecycle_failed")]
    CheckLifecycleFailed,
    /// Connection layer: provider health check failed.
    ///
    /// connection 层：Provider 健康检查失败。
    #[serde(rename = "health_check_failed")]
    HealthCheckFailed,
    /// Store/config layer: requested provider has no persisted configuration.
    ///
    /// store/config 层：请求的 provider 在 store 中没有持久化配置。
    #[serde(rename = "provider_not_found")]
    ProviderNotFound,
    /// Store/config layer: provider config store could not be read or written.
    ///
    /// store/config 层：Provider 配置存储读取或写入失败。
    #[serde(rename = "config_store_failed")]
    ConfigStoreFailed,
    /// Store/secret layer: system secret store could not be read or written.
    ///
    /// store/secret 层：系统密钥存储读取或写入失败。
    #[serde(rename = "secret_store_failed")]
    SecretStoreFailed,
    /// Unknown internal error (catch-all for unclassified provider errors).
    ///
    /// 未知内部错误（未分类的 provider 错误兜底）。
    #[serde(rename = "unknown")]
    Unknown,
}

impl ProviderErrorCode {
    /// Returns the safe fallback message for this error code.
    ///
    /// 返回该错误码对应的安全兜底消息。
    pub(super) fn default_message(&self) -> &'static str {
        match self {
            Self::MissingRequestData => "Missing request data.",
            Self::CheckLifecycleFailed => "Provider check lifecycle event emission failed.",
            Self::HealthCheckFailed => "Provider health check failed.",
            Self::ProviderNotFound => "Provider configuration not found.",
            Self::ConfigStoreFailed => "Provider configuration store operation failed.",
            Self::SecretStoreFailed => "Provider secret store operation failed.",
            Self::Unknown => "An unexpected error occurred.",
        }
    }
}

impl From<&ProviderError> for ProviderErrorCode {
    /// Coarsens an internal provider error into a provider boundary error code.
    ///
    /// 将内部 Provider 错误粗粒化为 Provider 边界错误码。
    fn from(error: &ProviderError) -> Self {
        match error {
            ProviderError::ManagerRequestPayloadAbsent { .. } => Self::MissingRequestData,
            ProviderError::CheckStartedEmit(_)
            | ProviderError::CheckStatusEmit(_)
            | ProviderError::CheckCompletedEmit(_)
            | ProviderError::CheckFailedEmit(_)
            | ProviderError::CheckConcurrentFailed(_) => Self::CheckLifecycleFailed,
            ProviderError::HealthCheckMissingConfig(_)
            | ProviderError::HealthCheckNetwork(_)
            | ProviderError::HealthCheckHttp(_)
            | ProviderError::HealthCheckResponseFormat(_) => Self::HealthCheckFailed,
            ProviderError::ConfigNotFound { .. } => Self::ProviderNotFound,
            ProviderError::JsonSerialize { .. }
            | ProviderError::JsonDeserialize { .. }
            | ProviderError::ConfigStoreOpen { .. }
            | ProviderError::ConfigStorePath { .. }
            | ProviderError::ConfigStoreSerialize { .. }
            | ProviderError::ConfigStoreTempCreate { .. }
            | ProviderError::ConfigStoreWrite { .. }
            | ProviderError::ConfigStoreSync { .. }
            | ProviderError::ConfigStoreReplace { .. } => Self::ConfigStoreFailed,
            ProviderError::SecretStoreInit { .. }
            | ProviderError::SecretStoreWrite { .. }
            | ProviderError::SecretStoreRead { .. }
            | ProviderError::SecretStoreRemove { .. } => Self::SecretStoreFailed,
            _ => Self::Unknown,
        }
    }
}
