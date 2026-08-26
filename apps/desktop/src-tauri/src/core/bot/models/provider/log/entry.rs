// apps/desktop/src-tauri/src/core/bot/models/provider/log/entry.rs
use super::super::super::super::super::{
    LogEntry,
    LogLevel::{self, Error},
};
use super::super::{
    ProviderAttribution, ProviderError, ProviderOperation, ProviderStage, ProviderSubject,
};
use super::ProviderOccurrence;

/// Structured log entry for the Provider subject reality.
///
/// 供应商主体实在的结构化日志条目。
pub(in crate::core::bot) struct ProviderLogEntry {
    /// Business occurrence fact observed by this entry.
    ///
    /// 当前条目观测到的业务发生事实。
    occurrence: ProviderOccurrence,
    /// Attribution projected from the originating business context.
    ///
    /// 从来源业务上下文投影出的归因。
    attribution: ProviderAttribution,
}

impl ProviderLogEntry {
    /// Observes a business context failure as a Provider log entry.
    ///
    /// 将业务上下文中的失败观测为供应商日志条目。
    pub(in crate::core::bot::models::provider) fn observe_failure(
        error: &ProviderError,
    ) -> LogEntry<ProviderStage, ProviderSubject, ProviderOperation> {
        Self::new(error.into(), error.attribution().clone()).generalize(Error)
    }

    /// Generalizes this Provider log entry into a shared structured log entry.
    ///
    /// 将当前供应商日志条目通用化为共享结构化日志条目。
    fn generalize(
        self,
        level: LogLevel,
    ) -> LogEntry<ProviderStage, ProviderSubject, ProviderOperation> {
        LogEntry::from_observation(level, self.attribution.generalize())
    }

    /// Creates a Provider structured log entry.
    ///
    /// 创建供应商结构化日志条目。
    fn new(occurrence: ProviderOccurrence, attribution: ProviderAttribution) -> Self {
        Self {
            occurrence,
            attribution,
        }
    }
}
