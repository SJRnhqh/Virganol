// apps/desktop/src-tauri/src/core/bot/models/provider/context/operation.rs
use std::fmt;

/// Interactive management operation carried by the interactive management context.
///
/// 交互式管理上下文携带的交互式供应商操作意图。
#[derive(Debug, Clone, Copy)]
pub(super) enum ProviderManagerOperation {
    /// Connect a provider and persist its configuration after a successful probe.
    ///
    /// 连接供应商，并在探测成功后持久化配置。
    Connect,
    /// Reset a provider by removing persisted configuration and secret material.
    ///
    /// 重置供应商，移除持久化配置与密钥材料。
    Reset,
    /// Update enabled models for a persisted provider.
    ///
    /// 更新已持久化供应商的启用模型列表。
    UpdateModels,
}

impl ProviderManagerOperation {
    /// Creates an interactive management operation for connecting one provider.
    ///
    /// 创建连接单个供应商的交互式管理操作。
    pub(super) fn connect() -> Self {
        Self::Connect
    }

    /// Creates an interactive management operation for resetting one provider.
    ///
    /// 创建重置单个供应商的交互式管理操作。
    pub(super) fn reset() -> Self {
        Self::Reset
    }

    /// Creates an interactive management operation for updating enabled models.
    ///
    /// 创建更新启用模型列表的交互式管理操作。
    pub(super) fn update_models() -> Self {
        Self::UpdateModels
    }
}

/// Provider business operation carried across domain context views.
///
/// 跨领域上下文视图传播的供应商业务操作意图。
#[derive(Debug, Clone, Copy)]
pub(super) enum ProviderOperation {
    /// Interactive management operation.
    ///
    /// 交互式管理操作。
    Manager(
        /// Interactive management operation details.
        ///
        /// 交互式管理操作详情。
        ProviderManagerOperation,
    ),
    /// Provider lifecycle health check.
    ///
    /// 供应商生命周期健康检查。
    LifecycleCheck,
}

impl ProviderOperation {
    /// Creates operation context for a lifecycle check.
    ///
    /// 创建生命周期检查对应的操作上下文。
    pub(super) fn lifecycle_check() -> Self {
        Self::LifecycleCheck
    }
}

impl From<ProviderManagerOperation> for ProviderOperation {
    /// Wraps an interactive management operation as a Provider operation.
    ///
    /// 将交互式管理操作包装为供应商操作。
    fn from(operation: ProviderManagerOperation) -> Self {
        Self::Manager(operation)
    }
}

impl fmt::Display for ProviderOperation {
    /// Formats this Provider operation for diagnostic context messages.
    ///
    /// 将当前供应商操作格式化为诊断上下文消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Manager(ProviderManagerOperation::Connect) => {
                f.write_str("the connect operation")
            }
            Self::Manager(ProviderManagerOperation::Reset) => f.write_str("the reset operation"),
            Self::Manager(ProviderManagerOperation::UpdateModels) => {
                f.write_str("the update models operation")
            }
            Self::LifecycleCheck => f.write_str("the lifecycle check operation"),
        }
    }
}
