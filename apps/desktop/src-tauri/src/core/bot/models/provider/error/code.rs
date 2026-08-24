// apps/desktop/src-tauri/src/core/bot/models/provider/error/code.rs
use serde::Serialize;

use super::{
    ProviderError,
    ProviderFailure::{
        CheckAggregate, CheckCompletedEmit, CheckFailedEmit, CheckStartedEmit, CheckStatusEmit,
        CheckTaskJoin, ConfigNotFound, ConfigStore, HealthCheckHttp, HealthCheckMissingConfig,
        HealthCheckNetwork, HealthCheckResponseFormat, JsonDeserialize, JsonSerialize,
        ManagerRequestPayloadAbsent, SecretStoreInit, SecretStoreRead, SecretStoreRemove,
        SecretStoreWrite, UnsupportedProvider,
    },
};

/// Application boundary error codes for the Provider subject subdomain.
///
/// 供应商主体子域的应用边界错误码。
#[derive(Serialize)]
pub(super) enum ProviderErrorCode {
    /// Required data is missing from a Provider manager command payload.
    ///
    /// 供应商管理命令载荷缺少必要数据。
    #[serde(rename = "missing_request_data")]
    MissingRequestData,
    /// Provider check lifecycle event emission failed.
    ///
    /// 供应商检查生命周期事件推送失败。
    #[serde(rename = "check_lifecycle_failed")]
    CheckLifecycleFailed,
    /// Provider health check failed.
    ///
    /// 供应商健康检查失败。
    #[serde(rename = "health_check_failed")]
    HealthCheckFailed,
    /// Stored Provider id is not supported by the current backend.
    ///
    /// 存储中的供应商标识不受当前后端支持。
    #[serde(rename = "unsupported_provider")]
    UnsupportedProvider,
    /// Requested Provider has no persisted configuration.
    ///
    /// 请求的供应商没有持久化配置。
    #[serde(rename = "provider_not_found")]
    ProviderNotFound,
    /// Provider configuration store operation failed.
    ///
    /// 供应商配置存储操作失败。
    #[serde(rename = "config_store_failed")]
    ConfigStoreFailed,
    /// Provider secret store operation failed.
    ///
    /// 供应商密钥存储操作失败。
    #[serde(rename = "secret_store_failed")]
    SecretStoreFailed,
}

impl ProviderErrorCode {
    /// Returns the safe default message for this error code.
    ///
    /// 返回错误码对应的安全默认消息。
    pub(super) fn default_message(&self) -> &'static str {
        match self {
            Self::MissingRequestData => "Missing request data.",
            Self::CheckLifecycleFailed => "Provider check lifecycle event emission failed.",
            Self::HealthCheckFailed => "Provider health check failed.",
            Self::UnsupportedProvider => "Provider is not supported by the current backend.",
            Self::ProviderNotFound => "Provider configuration not found.",
            Self::ConfigStoreFailed => "Provider configuration store operation failed.",
            Self::SecretStoreFailed => "Provider secret store operation failed.",
        }
    }
}

impl From<&ProviderError> for ProviderErrorCode {
    /// Projects an internal Provider error into a boundary error code.
    ///
    /// 将供应商内部错误投影为边界错误码。
    fn from(error: &ProviderError) -> Self {
        match error.failure() {
            ManagerRequestPayloadAbsent => Self::MissingRequestData,
            CheckStartedEmit { .. }
            | CheckStatusEmit { .. }
            | CheckCompletedEmit { .. }
            | CheckFailedEmit { .. }
            | CheckTaskJoin { .. }
            | CheckAggregate => Self::CheckLifecycleFailed,
            HealthCheckMissingConfig
            | HealthCheckNetwork { .. }
            | HealthCheckHttp
            | HealthCheckResponseFormat { .. } => Self::HealthCheckFailed,
            UnsupportedProvider => Self::UnsupportedProvider,
            ConfigNotFound => Self::ProviderNotFound,
            JsonSerialize { .. } | JsonDeserialize { .. } | ConfigStore { .. } => {
                Self::ConfigStoreFailed
            }
            SecretStoreInit { .. }
            | SecretStoreWrite { .. }
            | SecretStoreRead { .. }
            | SecretStoreRemove { .. } => Self::SecretStoreFailed,
        }
    }
}
