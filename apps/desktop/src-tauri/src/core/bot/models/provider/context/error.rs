// apps/desktop/src-tauri/src/core/bot/models/provider/context/error.rs
use std::fmt::{Display, Formatter, Result};

use super::super::ProviderSubject;
use super::{ProviderOperation, ProviderScope, ProviderStage};

/// Provider error attribution context snapshot.
///
/// 供应商错误归因上下文快照。
#[derive(Debug, Clone)]
pub(in crate::core::bot::models::provider) struct ProviderErrorContext {
    /// Provider subject reality execution stage where the failure was observed.
    ///
    /// 观察到失败时所在的供应商主体实在执行阶段。
    stage: ProviderStage,
    /// Subject within the Provider subject reality targeted by the failure.
    ///
    /// 当前失败归因的供应商主体实在中的主体。
    subject: ProviderSubject,
    /// Provider business operation being performed when the failure was observed.
    ///
    /// 观察到失败时正在执行的供应商业务操作。
    operation: ProviderOperation,
}

impl ProviderErrorContext {
    /// Derives the stable Provider business scope carried by this error context.
    ///
    /// 派生当前错误上下文携带的稳定供应商业务范围。
    pub(in crate::core::bot::models::provider) fn scope(&self) -> ProviderScope {
        ProviderScope::from_parts(self.stage, self.operation)
    }

    /// Returns the subject carried by this error context within the Provider subject reality.
    ///
    /// 返回当前错误上下文携带的供应商主体实在中的主体。
    pub(in crate::core::bot::models::provider) fn subject(&self) -> &ProviderSubject {
        &self.subject
    }

    /// Creates an error context snapshot from stage, subject, and operation.
    ///
    /// 基于执行阶段、供应商主体实在中的主体与业务操作创建错误上下文快照。
    pub(super) fn from_parts(
        stage: ProviderStage,
        subject: ProviderSubject,
        operation: ProviderOperation,
    ) -> Self {
        Self {
            stage,
            subject,
            operation,
        }
    }
}

impl Display for ProviderErrorContext {
    /// Formats this error context snapshot for internal error messages.
    ///
    /// 将此错误上下文快照格式化为内部错误消息。
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(
            f,
            "{} during {} at {}",
            self.subject, self.operation, self.stage
        )
    }
}
