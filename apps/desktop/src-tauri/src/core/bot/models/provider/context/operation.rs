// apps/desktop/src-tauri/src/core/bot/models/provider/context/operation.rs

/// Provider-domain operation carried by reliability context.
///
/// Provider 领域可靠性上下文携带的操作意图。
pub(super) enum ProviderOperation {
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
    /// Run the provider lifecycle check flow.
    ///
    /// 执行 Provider 生命周期检查流程。
    LifecycleCheck,
}
