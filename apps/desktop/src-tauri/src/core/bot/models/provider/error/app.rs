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

    /// Creates a provider boundary error with a recovery failure attached.
    ///
    /// 创建附带恢复失败的 Provider 边界错误。
    pub(in crate::core::bot) fn with_recovery_failure(
        error: &ProviderError,
        recovery_failure: &ProviderError,
    ) -> Self {
        let code = ProviderErrorCode::from(error);
        let details = ProviderErrorDetails::with_recovery_failure(error, recovery_failure);

        Self::new(code, details)
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
