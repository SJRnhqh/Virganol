// apps/desktop/src-tauri/src/core/bot/models/provider/context/attribution.rs
use std::fmt::{Display, Formatter, Result};

use super::super::super::super::super::AppAttribution;
use super::super::ProviderSubject;
use super::{ProviderExecutionContext, ProviderLifecycleContext, ProviderManagerContext};
use super::{ProviderOperation, ProviderScope, ProviderStage};

/// Provider attribution projected from runtime context.
///
/// 从运行时上下文投影出的供应商归因。
#[derive(Debug, Clone)]
pub(in crate::core::bot::models::provider) struct ProviderAttribution {
    /// Provider business execution stage.
    ///
    /// 供应商业务执行阶段。
    stage: ProviderStage,
    /// Provider subject.
    ///
    /// 供应商主体。
    subject: ProviderSubject,
    /// Provider business operation.
    ///
    /// 供应商业务操作。
    operation: ProviderOperation,
}

impl ProviderAttribution {
    /// Generalizes this Provider attribution into application attribution.
    ///
    /// 将当前供应商归因通用化为应用归因。
    pub(in crate::core::bot::models::provider) fn generalize(
        self,
    ) -> AppAttribution<ProviderStage, ProviderSubject, ProviderOperation> {
        AppAttribution::from_parts(self.stage, self.subject, self.operation)
    }

    /// Returns the stable Provider attribution parts.
    ///
    /// 返回稳定的供应商归因组成部分。
    pub(in crate::core::bot::models::provider) fn as_parts(
        &self,
    ) -> (ProviderStage, &ProviderSubject, ProviderOperation) {
        (self.stage, &self.subject, self.operation)
    }

    /// Derives the stable Provider business scope.
    ///
    /// 派生稳定的供应商业务范围。
    pub(in crate::core::bot::models::provider) fn scope(&self) -> ProviderScope {
        ProviderScope::from_parts(self.stage, self.operation)
    }

    /// Returns the Provider subject.
    ///
    /// 返回供应商主体。
    pub(in crate::core::bot::models::provider) fn subject(&self) -> &ProviderSubject {
        &self.subject
    }

    /// Creates Provider attribution.
    ///
    /// 创建供应商归因。
    fn new(stage: ProviderStage, subject: ProviderSubject, operation: ProviderOperation) -> Self {
        Self {
            stage,
            subject,
            operation,
        }
    }
}

impl Display for ProviderAttribution {
    /// Formats Provider attribution for internal messages.
    ///
    /// 格式化供应商归因以供内部消息使用。
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(
            f,
            "{} during {} at {}",
            self.subject, self.operation, self.stage
        )
    }
}

impl From<&ProviderManagerContext> for ProviderAttribution {
    /// Projects an interactive management context into Provider attribution.
    ///
    /// 将交互式管理上下文投影为供应商归因。
    fn from(context: &ProviderManagerContext) -> Self {
        let (stage, subject, operation) = context.attribution_parts();

        Self::new(stage, subject, operation)
    }
}

impl<'a> From<&ProviderLifecycleContext<'a>> for ProviderAttribution {
    /// Projects a lifecycle context into Provider attribution.
    ///
    /// 将生命周期上下文投影为供应商归因。
    fn from(context: &ProviderLifecycleContext<'a>) -> Self {
        let (stage, subject, operation) = context.attribution_parts();

        Self::new(stage, subject, operation)
    }
}

impl From<&ProviderExecutionContext> for ProviderAttribution {
    /// Projects an execution context into Provider attribution.
    ///
    /// 将执行上下文投影为供应商归因。
    fn from(context: &ProviderExecutionContext) -> Self {
        let (stage, subject, operation) = context.attribution_parts();

        Self::new(stage, subject, operation)
    }
}
