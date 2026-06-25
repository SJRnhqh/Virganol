// apps/desktop/src-tauri/src/core/bot/models/provider/context/operation.rs

/// Interactive management operation carried by the interactive management context.
///
/// 交互式管理上下文携带的交互式 Provider 操作意图。
#[derive(Clone)]
pub(super) enum ProviderManagerOperation {
    /// Connect a provider and persist its configuration after a successful probe.
    ///
    /// 连接 Provider，并在探测成功后持久化配置。
    Connect,
    /// Reset a provider by removing persisted configuration and secret material.
    ///
    /// 重置 Provider，移除持久化配置与密钥材料。
    Reset,
    /// Update enabled models for a persisted provider.
    ///
    /// 更新已持久化 Provider 的启用模型列表。
    UpdateModels,
}

impl ProviderManagerOperation {
    /// Creates an interactive management operation for connecting one provider.
    ///
    /// 创建连接单个 Provider 的交互式管理操作。
    pub(super) fn connect() -> Self {
        Self::Connect
    }

    /// Creates an interactive management operation for resetting one provider.
    ///
    /// 创建重置单个 Provider 的交互式管理操作。
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

/// Provider-scoped execution operation carried by the execution context.
///
/// 执行上下文携带的单 Provider 执行操作意图。
#[derive(Clone)]
pub(super) enum ProviderExecutionOperation {
    /// Interactive management operation.
    ///
    /// 交互式管理操作。
    Manager(ProviderManagerOperation),
    /// Provider lifecycle health check.
    ///
    /// Provider 生命周期健康检查。
    LifecycleCheck,
}

impl ProviderExecutionOperation {
    /// Creates execution operation context for a lifecycle check.
    ///
    /// 创建生命周期检查对应的执行操作上下文。
    pub(super) fn lifecycle_check() -> Self {
        Self::LifecycleCheck
    }
}

impl From<ProviderManagerOperation> for ProviderExecutionOperation {
    /// Wraps an interactive management operation as an execution operation.
    ///
    /// 将交互式管理操作包装为执行操作。
    fn from(operation: ProviderManagerOperation) -> Self {
        Self::Manager(operation)
    }
}
