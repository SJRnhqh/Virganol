// apps/desktop/src-tauri/src/core/bot/models/provider/error/app.rs
use super::super::super::super::super::AppError;
use super::{ProviderErrorCode, ProviderErrorDetails};

/// Provider-specific application boundary error type.
///
/// Provider 领域的应用边界错误类型。
pub(super) type ProviderAppError = AppError<ProviderErrorCode, ProviderErrorDetails>;
