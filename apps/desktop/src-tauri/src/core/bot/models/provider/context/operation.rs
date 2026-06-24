// apps/desktop/src-tauri/src/core/bot/models/provider/context/operation.rs

/// Interactive provider manager operation carried by manager context.
///
/// manager 上下文携带的交互式 Provider 操作意图。
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
    /// Creates a manager operation for connecting one provider.
    ///
    /// 创建连接单个 Provider 的 manager 操作意图。
    pub(super) fn connect() -> Self {
        Self::Connect
    }

    /// Creates a manager operation for resetting one provider.
    ///
    /// 创建重置单个 Provider 的 manager 操作意图。
    pub(super) fn reset() -> Self {
        Self::Reset
    }

    /// Creates a manager operation for updating enabled models.
    ///
    /// 创建更新启用模型列表的 manager 操作意图。
    pub(super) fn update_models() -> Self {
        Self::UpdateModels
    }
}

/// Provider-scoped execution operation carried by shared execution context.
///
/// 共享执行上下文携带的单 Provider 执行操作意图。
pub(super) enum ProviderExecutionOperation {
    /// Shared execution entered from an interactive manager operation.
    ///
    /// 从交互式 manager 操作进入共享执行链路。
    Manager(ProviderManagerOperation),
    /// Shared execution entered from the provider lifecycle check flow.
    ///
    /// 从 Provider 生命周期检查链路进入共享执行链路。
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
    /// Wraps a manager operation as a shared execution operation.
    ///
    /// 将 manager 操作包装为共享执行操作。
    fn from(operation: ProviderManagerOperation) -> Self {
        Self::Manager(operation)
    }
}
