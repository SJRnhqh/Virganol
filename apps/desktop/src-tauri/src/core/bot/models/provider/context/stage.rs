// apps/desktop/src-tauri/src/core/bot/models/provider/context/stage.rs

/// Provider-domain stage carried by reliability context.
///
/// Provider 领域可靠性上下文携带的阶段。
#[derive(Debug, Clone, Copy)]
pub(super) enum ProviderStage {
    /// Provider manager orchestration.
    ///
    /// Provider manager 编排阶段。
    Manager,
    /// Provider lifecycle event emission.
    ///
    /// Provider 生命周期事件推送阶段。
    LifecycleEmit,
    /// Provider connection path.
    ///
    /// Provider 连接阶段。
    Connection,
    /// Provider config store path.
    ///
    /// Provider 配置存储阶段。
    ConfigStore,
    /// Provider secret store path.
    ///
    /// Provider 密钥存储阶段。
    SecretStore,
}

impl ProviderStage {
    /// Creates the manager orchestration stage.
    ///
    /// 创建 manager 编排阶段。
    pub(super) fn manager() -> Self {
        Self::Manager
    }

    /// Creates the lifecycle-event emission stage.
    ///
    /// 创建生命周期事件推送阶段。
    pub(super) fn lifecycle_emit() -> Self {
        Self::LifecycleEmit
    }

    /// Creates the connection stage.
    ///
    /// 创建连接阶段。
    pub(super) fn connection() -> Self {
        Self::Connection
    }

    /// Creates the config-store stage.
    ///
    /// 创建配置存储阶段。
    pub(super) fn config_store() -> Self {
        Self::ConfigStore
    }

    /// Creates the secret-store stage.
    ///
    /// 创建密钥存储阶段。
    pub(super) fn secret_store() -> Self {
        Self::SecretStore
    }

    /// Returns a natural phrase for internal error context messages.
    ///
    /// 返回用于内部错误上下文消息的自然语言短语。
    pub(super) fn as_phrase(self) -> &'static str {
        match self {
            Self::Manager => "the manager stage",
            Self::LifecycleEmit => "the lifecycle-event stage",
            Self::Connection => "the connection stage",
            Self::ConfigStore => "the config-store stage",
            Self::SecretStore => "the secret-store stage",
        }
    }
}
