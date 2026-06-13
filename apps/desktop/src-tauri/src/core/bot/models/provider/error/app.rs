// apps/desktop/src-tauri/src/core/bot/models/provider/error/app.rs
use serde::Serialize;

use super::super::super::super::super::AppError;
use super::{ProviderError, ProviderErrorCode, ProviderErrorDetails};

/// Provider-specific application boundary error type.
///
/// Provider 领域的应用边界错误类型。
#[derive(Serialize)]
#[serde(transparent)]
pub(in crate::core::bot) struct ProviderAppError(AppError<ProviderErrorCode, ProviderErrorDetails>);

impl ProviderAppError {
    /// Creates a provider boundary error from an error code.
    ///
    /// 使用错误码创建 Provider 边界错误。
    fn new(code: ProviderErrorCode) -> Self {
        let message = code.default_message();

        Self(AppError::new(code, message))
    }

    /// Creates an error for command payloads missing required request data.
    ///
    /// 创建命令载荷缺少必需请求数据时的错误。
    pub(in crate::core::bot) fn missing_request_data() -> Self {
        Self::new(ProviderErrorCode::MissingRequestData)
    }
}

impl From<ProviderError> for ProviderAppError {
    /// Translates an internal provider error into a provider app boundary error.
    ///
    /// 将内部 Provider 错误翻译为 Provider 应用边界错误。
    fn from(error: ProviderError) -> Self {
        Self::new(ProviderErrorCode::from(&error))
    }
}
