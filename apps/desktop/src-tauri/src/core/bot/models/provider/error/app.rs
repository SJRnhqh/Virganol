// apps/desktop/src-tauri/src/core/bot/models/provider/error/app.rs
use serde::Serialize;

use super::super::super::super::super::AppError;
use super::{ProviderError, ProviderErrorCode, ProviderErrorDetails};

/// Provider-specific application boundary error type.
///
/// Provider 领域的应用边界错误类型。
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct ProviderAppError(AppError<ProviderErrorCode, ProviderErrorDetails>);

impl ProviderAppError {
    /// Creates a provider boundary error from an error code.
    ///
    /// 使用错误码创建 Provider 边界错误。
    fn new(code: ProviderErrorCode, details: ProviderErrorDetails) -> Self {
        let message = code.default_message();

        Self(AppError::new(code, message, details))
    }

    /// Creates a provider boundary error from an internal error and projected details.
    ///
    /// 使用内部错误与已投影细节创建 Provider 边界错误。
    fn from_details(error: &ProviderError, details: ProviderErrorDetails) -> Self {
        let code = ProviderErrorCode::from(error);

        Self::new(code, details)
    }

    /// Creates a provider boundary error with suppressed errors attached.
    ///
    /// 创建附带被抑制错误的 Provider 边界错误。
    pub(in crate::core::bot) fn with_suppressed_errors(
        error: &ProviderError,
        suppressed_errors: Vec<ProviderAppError>,
    ) -> Self {
        let details = ProviderErrorDetails::with_suppressed_errors(error, suppressed_errors);

        Self::from_details(error, details)
    }
}

impl From<&ProviderError> for ProviderAppError {
    /// Converts an internal provider error into a provider boundary error.
    ///
    /// 将内部 Provider 错误转换为 Provider 边界错误。
    fn from(error: &ProviderError) -> Self {
        let details = ProviderErrorDetails::from(error);

        Self::from_details(error, details)
    }
}
