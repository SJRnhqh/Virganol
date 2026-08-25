// apps/desktop/src-tauri/src/core/bot/models/provider/log/occurrence.rs
use super::super::{ProviderError, ProviderFailureKind};

/// Business occurrence facts observed by the Provider subject reality logging branch.
///
/// 供应商主体实在日志分支观测到的业务发生事实。
pub(super) enum ProviderOccurrence {
    /// Provider internal error observed as a failure occurrence.
    ///
    /// 将供应商内部错误观测为失败发生事实。
    Failure(
        /// Provider failure kind observed from the internal error.
        ///
        /// 从内部错误中观测到的供应商失败种类。
        ProviderFailureKind,
    ),
}

impl From<&ProviderError> for ProviderOccurrence {
    /// Observes an internal Provider error as a failure occurrence.
    ///
    /// 将供应商内部错误观测为失败发生事实。
    fn from(error: &ProviderError) -> Self {
        Self::Failure(error.failure_kind())
    }
}
