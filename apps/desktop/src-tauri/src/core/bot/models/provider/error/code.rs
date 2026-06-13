// apps/desktop/src-tauri/src/core/bot/models/provider/error/code.rs
use serde::Serialize;

use super::ProviderError;

/// Provider-specific application boundary error code.
///
/// Provider 领域的应用边界错误码。
#[derive(Serialize)]
pub(super) enum ProviderErrorCode {
    /// Manager/request layer received a command payload without required data.
    ///
    /// manager/request 层收到缺少必需 data 字段的命令载荷。
    #[serde(rename = "missing_request_data")]
    MissingRequestData,
    /// Requested provider has no persisted configuration in the store.
    ///
    /// 请求的 provider 在 store 中没有持久化配置。
    #[serde(rename = "provider_not_found")]
    ProviderNotFound,
    /// Local provider storage could not be read or written.
    ///
    /// 本地 provider 存储读取或写入失败。
    #[serde(rename = "storage_failed")]
    StorageFailed,
}

impl ProviderErrorCode {
    /// Returns the safe fallback message for this error code.
    ///
    /// 返回该错误码对应的安全兜底消息。
    pub(super) fn default_message(&self) -> &'static str {
        match self {
            Self::MissingRequestData => "Missing request data.",
            Self::ProviderNotFound => "Provider configuration not found.",
            Self::StorageFailed => "Failed to access local provider storage.",
        }
    }
}

impl From<&ProviderError> for ProviderErrorCode {
    /// Coarsens an internal provider error into a provider boundary error code.
    ///
    /// 将内部 Provider 错误粗粒化为 Provider 边界错误码。
    fn from(error: &ProviderError) -> Self {
        match error {
            ProviderError::ConfigNotFound(_) => Self::ProviderNotFound,
            ProviderError::JsonSerialize(_)
            | ProviderError::JsonDeserialize(_)
            | ProviderError::ConfigStoreOpen(_)
            | ProviderError::ConfigStorePath(_)
            | ProviderError::ConfigStoreSerialize(_)
            | ProviderError::ConfigStoreTempCreate(_)
            | ProviderError::ConfigStoreWrite(_)
            | ProviderError::ConfigStoreSync(_)
            | ProviderError::ConfigStoreReplace(_) => Self::StorageFailed,
            _ => Self::StorageFailed,
        }
    }
}
