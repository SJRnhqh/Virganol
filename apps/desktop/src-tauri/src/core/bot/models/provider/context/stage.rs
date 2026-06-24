// apps/desktop/src-tauri/src/core/bot/models/provider/context/stage.rs

/// Provider-domain execution stage carried by reliability context.
///
/// Provider 领域可靠性上下文携带的执行阶段。
#[derive(Debug, Clone, Copy)]
pub(super) enum ProviderStage {
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
}

impl ProviderStage {
    /// Returns a natural phrase for internal error context messages.
    ///
    /// 返回用于内部错误上下文消息的自然语言短语。
    pub(super) fn as_phrase(self) -> &'static str {
        match self {
            Self::Manager => "the manager stage",
            Self::ConfigStore => "the config-store stage",
            Self::SecretStore => "the secret-store stage",
            Self::Connection => "the connection stage",
            Self::LifecycleEmit => "the lifecycle-event stage",
        }
    }
}
