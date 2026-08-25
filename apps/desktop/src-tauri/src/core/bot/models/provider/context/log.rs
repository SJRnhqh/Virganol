// apps/desktop/src-tauri/src/core/bot/models/provider/context/log.rs
use super::super::ProviderSubject;
use super::{
    ProviderExecutionContext, ProviderLifecycleContext, ProviderManagerContext, ProviderOperation,
    ProviderStage,
};

/// Provider subject reality logging observation context that captures stable attribution facts.
///
/// 固化稳定归因事实的供应商主体实在日志观测上下文。
pub(in crate::core::bot) struct ProviderLogContext {
    /// Provider subject reality execution stage where the event was observed.
    ///
    /// 观察到事件时所在的供应商主体实在执行阶段。
    stage: ProviderStage,
    /// Subject within the Provider subject reality targeted by the event.
    ///
    /// 当前事件归因的供应商主体实在中的主体。
    subject: ProviderSubject,
    /// Provider business operation being performed when the event was observed.
    ///
    /// 观察到事件时正在执行的供应商业务操作。
    operation: ProviderOperation,
}

impl ProviderLogContext {
    /// Creates a logging observation context from its constituent parts.
    ///
    /// 基于组成部分创建日志观测上下文。
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

impl From<&ProviderManagerContext> for ProviderLogContext {
    /// Creates a logging observation context from an interactive management context.
    ///
    /// 根据交互式管理上下文创建日志观测上下文。
    fn from(context: &ProviderManagerContext) -> Self {
        let (stage, subject, operation) = context.attribution_parts();

        Self::from_parts(stage, subject, operation)
    }
}

impl<'a> From<&ProviderLifecycleContext<'a>> for ProviderLogContext {
    /// Creates a logging observation context from a lifecycle context.
    ///
    /// 根据生命周期上下文创建日志观测上下文。
    fn from(context: &ProviderLifecycleContext<'a>) -> Self {
        let (stage, subject, operation) = context.attribution_parts();

        Self::from_parts(stage, subject, operation)
    }
}

impl From<&ProviderExecutionContext> for ProviderLogContext {
    /// Creates a logging observation context from an execution context.
    ///
    /// 根据执行上下文创建日志观测上下文。
    fn from(context: &ProviderExecutionContext) -> Self {
        let (stage, subject, operation) = context.attribution_parts();

        Self::from_parts(stage, subject, operation)
    }
}
