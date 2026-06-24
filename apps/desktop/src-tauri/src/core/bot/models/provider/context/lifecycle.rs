// apps/desktop/src-tauri/src/core/bot/models/provider/context/lifecycle.rs
use super::super::lifecycle::ProviderCheckTrigger;
use super::{ProviderContext, ProviderErrorContext, ProviderOperation, ProviderStage};

/// Link-specific metadata for the lifecycle flow.
///
/// 生命周期链路携带的可靠性元信息。
struct LifecycleExtra {
    /// Stable correlation id for this lifecycle run.
    ///
    /// 本次生命周期运行的稳定关联标识。
    run_id: String,
    /// Source trigger for this lifecycle check.
    ///
    /// 触发本次生命周期检查的来源。
    trigger: ProviderCheckTrigger,
}

/// Provider lifecycle reliability context.
///
/// Provider 生命周期链路的可靠性上下文。
pub(in crate::core::bot) struct ProviderLifecycleContext(ProviderContext<LifecycleExtra>);

impl ProviderLifecycleContext {
    /// Derives this lifecycle context at the config-store stage.
    ///
    /// 将当前生命周期上下文派生到配置存储阶段。
    pub(in crate::core::bot) fn at_config_store(self) -> Self {
        Self(self.0.at_config_store())
    }

    /// Derives this lifecycle context at the secret-store stage.
    ///
    /// 将当前生命周期上下文派生到密钥存储阶段。
    pub(in crate::core::bot) fn at_secret_store(self) -> Self {
        Self(self.0.at_secret_store())
    }

    /// Derives this lifecycle context at the connection stage.
    ///
    /// 将当前生命周期上下文派生到连接阶段。
    pub(in crate::core::bot) fn at_connection(self) -> Self {
        Self(self.0.at_connection())
    }

    /// Projects this lifecycle context into an error attribution snapshot.
    ///
    /// 将当前生命周期执行上下文投影为错误归因快照。
    pub(in crate::core::bot) fn error_context(&self) -> ProviderErrorContext {
        self.0.error_context()
    }

    /// Returns the stable correlation id for this lifecycle run.
    ///
    /// 返回本次生命周期运行的稳定关联标识。
    pub(in crate::core::bot) fn run_id(&self) -> &str {
        &self.0.extra.run_id
    }

    /// Returns the source trigger for this lifecycle check.
    ///
    /// 返回触发本次生命周期检查的来源。
    pub(in crate::core::bot) fn trigger(&self) -> &ProviderCheckTrigger {
        &self.0.extra.trigger
    }

    /// Creates context for one provider lifecycle run.
    ///
    /// 为一次 Provider 生命周期运行创建上下文。
    fn new(run_id: String, trigger: ProviderCheckTrigger) -> Self {
        Self(ProviderContext {
            provider_id: None,
            operation: ProviderOperation::LifecycleCheck,
            stage: ProviderStage::LifecycleEmit,
            extra: LifecycleExtra { run_id, trigger },
        })
    }
}
