// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/fail.rs
use super::super::super::super::super::super::AppLogger;
use super::super::super::super::super::{ProviderAppError, ProviderError, ProviderLogEntry};

/// Records a Provider failure and returns its application boundary projection.
///
/// 记录供应商失败，并返回其应用边界投影。
pub(super) fn fail(logger: &AppLogger, error: &ProviderError) -> ProviderAppError {
    ProviderLogEntry::record_failure(logger, error);
    ProviderAppError::from(error)
}
