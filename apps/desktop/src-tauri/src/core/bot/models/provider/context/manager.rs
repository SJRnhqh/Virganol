// apps/desktop/src-tauri/src/core/bot/models/provider/context/manager.rs
use super::super::ProviderId;
use super::{
    ProviderContext, ProviderErrorContext, ProviderExecutionContext, ProviderManagerOperation,
    ProviderStage,
};

/// Interactive management business context fields.
///
/// 交互式管理业务上下文字段。
struct ManagerExtra {
    /// Provider targeted by the interactive management operation.
    ///
    /// 当前交互式管理操作目标供应商。
    provider_id: ProviderId,
    /// Interactive management operation currently being executed.
    ///
    /// 当前正在执行的交互式管理操作。
    operation: ProviderManagerOperation,
}

/// Provider subject reality interactive management business context.
///
/// 供应商主体实在交互式管理业务上下文。
pub(in crate::core::bot) struct ProviderManagerContext(
    /// Shared context state backing this interactive management view.
    ///
    /// 支撑当前交互式管理视图的共享上下文状态。
    ProviderContext<ManagerExtra>,
);

impl ProviderManagerContext {
    /// Creates an interactive management context for connecting one provider.
    ///
    /// 创建用于连接单个供应商的交互式管理上下文。
    pub(in crate::core::bot) fn connect(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderManagerOperation::connect())
    }

    /// Creates an interactive management context for resetting one provider.
    ///
    /// 创建用于重置单个供应商的交互式管理上下文。
    pub(in crate::core::bot) fn reset(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderManagerOperation::reset())
    }

    /// Creates an interactive management context for updating enabled models.
    ///
    /// 创建用于更新启用模型列表的交互式管理上下文。
    pub(in crate::core::bot) fn update_models(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderManagerOperation::update_models())
    }

    /// Consumes this interactive management context into the connection stage.
    ///
    /// 消费当前交互式管理上下文，并将其转换为连接阶段。
    pub(in crate::core::bot) fn into_connection(self) -> Self {
        Self(self.0.into_connection())
    }

    /// Consumes this interactive management context into the config-store stage.
    ///
    /// 消费当前交互式管理上下文，并将其转换为配置存储阶段。
    pub(in crate::core::bot) fn into_config_store(self) -> Self {
        Self(self.0.into_config_store())
    }

    /// Converts this interactive management context into an execution context.
    ///
    /// 将当前交互式管理上下文转换为执行上下文。
    pub(in crate::core::bot) fn into_execution_context(self) -> ProviderExecutionContext {
        let stage = self.0.stage();
        let extra = self.0.into_extra();

        ProviderExecutionContext::from_parts(
            stage,
            extra.provider_id.into(),
            extra.operation.into(),
        )
    }

    /// Projects this interactive management context into an error attribution snapshot.
    ///
    /// 将当前交互式管理上下文投影为错误归因快照。
    pub(in crate::core::bot::models::provider) fn error_context(&self) -> ProviderErrorContext {
        self.0.error_context_for(
            self.0.extra().provider_id.into(),
            self.0.extra().operation.into(),
        )
    }

    /// Centralizes interactive management context construction.
    ///
    /// 集中创建交互式管理上下文。
    fn new(provider_id: ProviderId, operation: ProviderManagerOperation) -> Self {
        Self(ProviderContext::new(
            ProviderStage::manager(),
            ManagerExtra {
                provider_id,
                operation,
            },
        ))
    }
}
