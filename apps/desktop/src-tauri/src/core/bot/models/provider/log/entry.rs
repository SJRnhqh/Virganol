// apps/desktop/src-tauri/src/core/bot/models/provider/log/entry.rs
use super::super::{ProviderError, ProviderLogContext};
use super::ProviderOccurrence;

/// Structured log entry for the Provider subject reality.
///
/// 供应商主体实在的结构化日志条目。
pub(in crate::core::bot) struct ProviderLogEntry {
    /// Logging observation context captured from the originating business context.
    ///
    /// 从来源业务上下文固化的日志观测上下文。
    context: ProviderLogContext,
    /// Business occurrence fact observed by this entry.
    ///
    /// 当前条目观测到的业务发生事实。
    occurrence: ProviderOccurrence,
}

impl ProviderLogEntry {
    /// Observes a business context failure as a Provider log entry.
    ///
    /// 将业务上下文中的失败观测为供应商日志条目。
    pub(in crate::core::bot) fn observe_failure<C>(context: &C, error: &ProviderError) -> Self
    where
        for<'a> &'a C: Into<ProviderLogContext>,
    {
        Self::new(context.into(), error.into())
    }

    /// Creates a Provider structured log entry.
    ///
    /// 创建供应商结构化日志条目。
    fn new(context: ProviderLogContext, occurrence: ProviderOccurrence) -> Self {
        Self {
            context,
            occurrence,
        }
    }
}
