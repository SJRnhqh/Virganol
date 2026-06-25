// apps/desktop/src-tauri/src/core/bot/models/provider/context/lifecycle.rs
use super::super::{lifecycle::ProviderCheckTrigger, ProviderId};
use super::{
    ProviderContext, ProviderErrorContext, ProviderExecutionContext, ProviderExecutionOperation,
    ProviderStage,
};

/// Lifecycle business context fields.
///
/// 生命周期业务上下文字段。
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
/// Provider 领域生命周期业务上下文。
pub(in crate::core::bot) struct ProviderLifecycleContext<'a>(ProviderContext<LifecycleExtra<'a>>);

impl<'a> ProviderLifecycleContext<'a> {
    /// Starts a lifecycle business context.
    ///
    /// 启动生命周期业务上下文。
    pub(in crate::core::bot) fn start(run_id: &'a str, trigger: &'a ProviderCheckTrigger) -> Self {
        Self::new(run_id, trigger)
    }

    /// Consumes this lifecycle context into the lifecycle-event stage.
    ///
    /// 消费当前生命周期上下文，并将其转换为生命周期事件阶段。
    pub(in crate::core::bot) fn into_lifecycle_emit(self) -> Self {
        Self(self.0.into_lifecycle_emit())
    }

    /// Consumes this lifecycle context into the connection stage.
    ///
    /// 消费当前生命周期上下文，并将其转换为连接阶段。
    pub(in crate::core::bot) fn into_connection(self) -> Self {
        Self(self.0.into_connection())
    }

    /// Consumes this lifecycle context into the config-store stage.
    ///
    /// 消费当前生命周期上下文，并将其转换为配置存储阶段。
    pub(in crate::core::bot) fn into_config_store(self) -> Self {
        Self(self.0.into_config_store())
    }

    /// Consumes this lifecycle context into the secret-store stage.
    ///
    /// 消费当前生命周期上下文，并将其转换为密钥存储阶段。
    pub(in crate::core::bot) fn into_secret_store(self) -> Self {
        Self(self.0.into_secret_store())
    }

    /// Creates an execution context for checking one provider in this lifecycle run.
    ///
    /// 基于当前生命周期运行创建单个 Provider 检查对应的执行上下文。
    pub(in crate::core::bot) fn execution_context_for(
        &self,
        provider_id: ProviderId,
    ) -> ProviderExecutionContext {
        ProviderExecutionContext::from_operation(
            self.0.stage(),
            provider_id,
            ProviderExecutionOperation::lifecycle_check(),
        )
    }

    /// Projects this lifecycle context into an error attribution snapshot.
    ///
    /// 将当前生命周期上下文投影为错误归因快照。
    pub(in crate::core::bot) fn error_context(&self) -> ProviderErrorContext {
        self.0.error_context()
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
