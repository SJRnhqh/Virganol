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
    fn new(code: ProviderErrorCode, details: ProviderErrorDetails) -> Self {
        let message = code.default_message();

        Self(AppError::new(code, message, details))
    }

    /// Creates a provider boundary error with a custom message.
    ///
    /// 使用自定义消息创建 Provider 边界错误。
    pub(in crate::core::bot) fn with_message(
        code: ProviderErrorCode,
        message: impl Into<String>,
    ) -> Self {
        Self(AppError::new(code, message))
    }
}

impl From<&ProviderError> for ProviderAppError {
    /// Converts an internal provider error into a provider boundary error.
    ///
    /// 将内部 Provider 错误转换为 Provider 边界错误。
    fn from(error: &ProviderError) -> Self {
        let code = ProviderErrorCode::from(error);
        let details = ProviderErrorDetails::from(error);

        Self::new(code, details)
    }
}
