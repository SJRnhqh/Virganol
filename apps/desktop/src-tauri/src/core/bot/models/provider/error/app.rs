// apps/desktop/src-tauri/src/core/bot/models/provider/error/app.rs
use serde::Serialize;

use super::super::super::super::super::AppError;
use super::{ProviderError, ProviderErrorCode, ProviderErrorDetails};

/// Application boundary error for the Provider subject subdomain.
///
/// 供应商主体子域的应用边界错误类型。
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct ProviderAppError(AppError<ProviderErrorCode, ProviderErrorDetails>);

impl ProviderAppError {
    /// Creates a Provider boundary error with suppressed errors attached.
    ///
    /// 创建附带被抑制错误的供应商边界错误。
    pub(in crate::core::bot) fn with_suppressed_errors(
        error: &ProviderError,
        suppressed_errors: Vec<ProviderAppError>,
    ) -> Self {
        let details = ProviderErrorDetails::with_suppressed_errors(error, suppressed_errors);

        Self::from_details(error, details)
    }

    /// Creates a Provider boundary error from an internal error and projected details.
    ///
    /// 使用内部错误和已投影细节创建供应商边界错误。
    fn from_details(error: &ProviderError, details: ProviderErrorDetails) -> Self {
        let code = ProviderErrorCode::from(error);

        Self::new(code, details)
    }

    /// Creates a Provider boundary error from a code and details.
    ///
    /// 使用错误码和细节创建供应商边界错误。
    fn new(code: ProviderErrorCode, details: ProviderErrorDetails) -> Self {
        let message = code.default_message();

        Self(AppError::new(code, message, details))
    }
}

impl From<&ProviderError> for ProviderAppError {
    /// Projects an internal Provider error into a boundary error.
    ///
    /// 将供应商内部错误投影为边界错误。
    fn from(error: &ProviderError) -> Self {
        let details = ProviderErrorDetails::from(error);

        Self::from_details(error, details)
    }
}
