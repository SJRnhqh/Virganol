// apps/desktop/src-tauri/src/core/bot/models/provider/context/lifecycle.rs
use super::super::{ProviderCheckTrigger, ProviderSubject};
use super::{
    ProviderContext, ProviderErrorContext, ProviderExecutionContext, ProviderOperation,
    ProviderStage,
};

/// Lifecycle business context fields.
///
/// 生命周期业务上下文字段。
#[derive(Clone)]
struct LifecycleExtra<'a> {
    /// Stable correlation id for this lifecycle run.
    ///
    /// 本次生命周期运行的稳定关联标识。
    run_id: &'a str,
    /// Source trigger for this lifecycle check.
    ///
    /// 触发本次生命周期检查的来源。
    trigger: &'a ProviderCheckTrigger,
}

/// Provider lifecycle domain business context.
///
/// 供应商领域生命周期业务上下文。
pub(in crate::core::bot) struct ProviderLifecycleContext<'a>(
    /// Shared context state backing this lifecycle view.
    ///
    /// 支撑当前生命周期视图的共享上下文状态。
    ProviderContext<LifecycleExtra<'a>>,
);

impl<'a> ProviderLifecycleContext<'a> {
    /// Starts a lifecycle business context.
    ///
    /// 启动生命周期业务上下文。
    pub(in crate::core::bot) fn start(run_id: &'a str, trigger: &'a ProviderCheckTrigger) -> Self {
        Self::new(run_id, trigger)
    }

    /// Derives an owned lifecycle-event stage view from this lifecycle context.
    ///
    /// 从当前生命周期上下文派生一个拥有所有权的生命周期事件阶段视图，不改变来源上下文。
    pub(in crate::core::bot) fn for_lifecycle_emit(&self) -> Self {
        Self(self.0.for_lifecycle_emit())
    }

    /// Derives an owned connection stage view from this lifecycle context.
    ///
    /// 从当前生命周期上下文派生一个拥有所有权的连接阶段视图，不改变来源上下文。
    pub(in crate::core::bot) fn for_connection(&self) -> Self {
        Self(self.0.for_connection())
    }

    /// Derives an owned config-store stage view from this lifecycle context.
    ///
    /// 从当前生命周期上下文派生一个拥有所有权的配置存储阶段视图，不改变来源上下文。
    pub(in crate::core::bot) fn for_config_store(&self) -> Self {
        Self(self.0.for_config_store())
    }

    /// Converts this lifecycle context into an execution context with a Provider-domain subject.
    ///
    /// 将当前生命周期上下文转换为携带指定供应商领域主体的执行上下文。
    pub(in crate::core::bot) fn into_execution_context_with(
        self,
        subject: ProviderSubject,
    ) -> ProviderExecutionContext {
        ProviderExecutionContext::from_parts(
            self.0.stage(),
            subject,
            ProviderOperation::lifecycle_check(),
        )
    }

    /// Projects this lifecycle context into an error attribution snapshot.
    ///
    /// 将当前生命周期上下文投影为错误归因快照。
    pub(in crate::core::bot::models::provider) fn error_context(&self) -> ProviderErrorContext {
        self.0.error_context_for(
            ProviderSubject::configured_providers(),
            ProviderOperation::lifecycle_check(),
        )
    }

    /// Returns the stable correlation id for this lifecycle run.
    ///
    /// 返回本次生命周期运行的稳定关联标识。
    pub(in crate::core::bot) fn run_id(&self) -> &str {
        self.0.extra().run_id
    }

    /// Returns the source trigger for this lifecycle check.
    ///
    /// 返回触发本次生命周期检查的来源。
    pub(in crate::core::bot) fn trigger(&self) -> &ProviderCheckTrigger {
        self.0.extra().trigger
    }

    /// Creates a lifecycle business context.
    ///
    /// 创建生命周期业务上下文。
    fn new(run_id: &'a str, trigger: &'a ProviderCheckTrigger) -> Self {
        Self(ProviderContext::new(
            ProviderStage::lifecycle_emit(),
            LifecycleExtra { run_id, trigger },
        ))
    }
}
