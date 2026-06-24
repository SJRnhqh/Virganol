// apps/desktop/src-tauri/src/core/bot/models/provider/context/manager.rs
use super::super::ProviderId;
use super::{ProviderContext, ProviderErrorContext, ProviderOperation, ProviderStage};

/// Provider manager reliability context.
///
/// Provider 交互式 manager 链路的可靠性上下文。
pub(in crate::core::bot) struct ProviderManagerContext(ProviderContext<()>);

impl ProviderManagerContext {
    /// Creates context for connecting one provider.
    ///
    /// 创建连接单个 Provider 的上下文。
    pub(in crate::core::bot) fn connect(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderOperation::Connect)
    }

    /// Creates context for resetting one provider.
    ///
    /// 创建重置单个 Provider 的上下文。
    pub(in crate::core::bot) fn reset(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderOperation::Reset)
    }

    /// Creates context for updating enabled models for one provider.
    ///
    /// 创建更新单个 Provider 启用模型列表的上下文。
    pub(in crate::core::bot) fn update_models(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderOperation::UpdateModels)
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
        self.0.error_context()
    }

    /// Centralizes manager context construction while keeping the base context private.
    ///
    /// 集中管理 manager 上下文构造，并保持基础上下文不向业务调用方外泄。
    fn new(provider_id: ProviderId, operation: ProviderOperation) -> Self {
        Self(ProviderContext {
            provider_id: Some(provider_id),
            operation,
            stage: ProviderStage::Manager,
            extra: (),
        })
    }
}
