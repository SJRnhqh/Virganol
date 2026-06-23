// apps/desktop/src-tauri/src/core/bot/models/provider/context/stage.rs

/// Provider-domain execution stage carried by reliability context.
///
/// Provider 领域可靠性上下文携带的执行阶段。
pub(super) enum ProviderStage {
    /// Tauri command boundary.
    ///
    /// Tauri 命令边界。
    Command,
    /// Provider manager orchestration.
    ///
    /// Provider manager 编排阶段。
    Manager,
    /// Provider config store path.
    ///
    /// Provider 配置存储阶段。
    ConfigStore,
    /// Provider secret store path.
    ///
    /// Provider 密钥存储阶段。
    SecretStore,
    /// Provider connection path.
    ///
    /// Provider 连接阶段。
    Connection,
    /// Provider lifecycle event emission.
    ///
    /// Provider 生命周期事件推送阶段。
    LifecycleEmit,
    /// Fallback logging after a reliability reporting failure.
    ///
    /// 可靠性上报失败后的日志兜底阶段。
    FallbackLogging,
}
