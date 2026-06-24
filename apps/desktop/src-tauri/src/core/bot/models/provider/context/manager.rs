// apps/desktop/src-tauri/src/core/bot/models/provider/context/manager.rs
use super::super::ProviderId;
use super::{ProviderContext, ProviderErrorContext, ProviderManagerOperation, ProviderStage};

/// Link-specific metadata for interactive manager flows.
///
/// 交互式 manager 链路携带的可靠性元信息。
pub(super) struct ManagerExtra {
    /// Provider targeted by the manager operation.
    ///
    /// 当前 manager 操作目标 Provider。
    provider_id: ProviderId,
    /// Interactive manager operation currently being executed.
    ///
    /// 当前正在执行的交互式 manager 操作。
    operation: ProviderManagerOperation,
}

/// Provider manager reliability context.
///
/// Provider 交互式 manager 链路的可靠性上下文。
pub(in crate::core::bot) struct ProviderManagerContext(ProviderContext<ManagerExtra>);

impl ProviderManagerContext {
    /// Creates context for connecting one provider.
    ///
    /// 创建连接单个 Provider 的上下文。
    pub(in crate::core::bot) fn connect(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderManagerOperation::connect())
    }

    /// Creates context for resetting one provider.
    ///
    /// 创建重置单个 Provider 的上下文。
    pub(in crate::core::bot) fn reset(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderManagerOperation::reset())
    }

    /// Creates context for updating enabled models for one provider.
    ///
    /// 创建更新单个 Provider 启用模型列表的上下文。
    pub(in crate::core::bot) fn update_models(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderManagerOperation::update_models())
    }

    /// Derives this interactive manager flow context at the config-store stage.
    ///
    /// 将当前交互式 manager 链路上下文派生到配置存储阶段。
    pub(in crate::core::bot) fn at_config_store(self) -> Self {
        Self(self.0.at_config_store())
    }

    /// Derives this interactive manager flow context at the secret-store stage.
    ///
    /// 将当前交互式 manager 链路上下文派生到密钥存储阶段。
    pub(in crate::core::bot) fn at_secret_store(self) -> Self {
        Self(self.0.at_secret_store())
    }

    /// Derives this interactive manager flow context at the connection stage.
    ///
    /// 将当前交互式 manager 链路上下文派生到连接阶段。
    pub(in crate::core::bot) fn at_connection(self) -> Self {
        Self(self.0.at_connection())
    }

    /// Projects this live manager context into an error attribution snapshot.
    ///
    /// 将当前 manager 执行上下文投影为错误归因快照。
    pub(in crate::core::bot) fn error_context(&self) -> ProviderErrorContext {
        self.0
            .error_context()
            .with_provider(self.0.extra().provider_id)
    }

    /// Centralizes manager context construction while keeping the base context private.
    ///
    /// 集中管理 manager 上下文构造，并保持基础上下文不向业务调用方外泄。
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
