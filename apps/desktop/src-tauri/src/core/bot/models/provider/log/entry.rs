// apps/desktop/src-tauri/src/core/bot/models/provider/log/entry.rs
use super::super::super::super::super::{
    AppLogger, LogEntry,
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
    /// Records a structured log entry for a Provider failure.
    ///
    /// 为供应商失败记录结构化日志条目。
    pub(in crate::core::bot) fn record_failure(logger: &AppLogger, error: &ProviderError) {
        logger.record(Self::new(error.into(), error.attribution().clone()).generalize(Error));
    }

    /// Generalizes this Provider log entry into a shared structured log entry.
    ///
    /// 将当前供应商日志条目通用化为共享结构化日志条目。
    fn generalize(
        self,
        level: LogLevel,
    ) -> LogEntry<ProviderOccurrence, ProviderStage, ProviderSubject, ProviderOperation> {
        LogEntry::from_observation(level, self.occurrence, self.attribution.generalize())
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
