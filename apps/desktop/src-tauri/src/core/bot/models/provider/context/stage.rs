// apps/desktop/src-tauri/src/core/bot/models/provider/context/stage.rs

/// Provider-scoped shared execution stage.
///
/// 单 Provider 共享执行链路的执行阶段。
#[derive(Debug, Clone, Copy)]
pub(super) enum ProviderExecutionStage {
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

impl ProviderExecutionStage {
    /// Creates the connection execution stage.
    ///
    /// 创建连接执行阶段。
    fn connection() -> Self {
        Self::Connection
    }

    /// Creates the config-store execution stage.
    ///
    /// 创建配置存储执行阶段。
    fn config_store() -> Self {
        Self::ConfigStore
    }

    /// Creates the secret-store execution stage.
    ///
    /// 创建密钥存储执行阶段。
    fn secret_store() -> Self {
        Self::SecretStore
    }

    /// Returns a natural phrase for internal error context messages.
    ///
    /// 返回用于内部错误上下文消息的自然语言短语。
    fn as_phrase(self) -> &'static str {
        match self {
            Self::Connection => "the connection stage",
            Self::ConfigStore => "the config-store stage",
            Self::SecretStore => "the secret-store stage",
        }
    }
}

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
    /// Provider-scoped shared execution stage.
    ///
    /// 单 Provider 共享执行阶段。
    Execution(ProviderExecutionStage),
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
        Self::execution(ProviderExecutionStage::connection())
    }

    /// Creates the config-store stage.
    ///
    /// 创建配置存储阶段。
    pub(super) fn config_store() -> Self {
        Self::execution(ProviderExecutionStage::config_store())
    }

    /// Creates the secret-store stage.
    ///
    /// 创建密钥存储阶段。
    pub(super) fn secret_store() -> Self {
        Self::execution(ProviderExecutionStage::secret_store())
    }

    /// Returns this stage as a provider-scoped shared execution stage, when possible.
    ///
    /// 当当前阶段属于单 Provider 共享执行阶段时返回对应执行阶段。
    pub(super) fn as_execution_stage(self) -> Option<ProviderExecutionStage> {
        match self {
            Self::Execution(stage) => Some(stage),
            _ => None,
        }
    }

    /// Creates a provider-scoped shared execution stage.
    ///
    /// 创建单 Provider 共享执行阶段。
    pub(super) fn execution(stage: ProviderExecutionStage) -> Self {
        Self::Execution(stage)
    }

    /// Returns a natural phrase for internal error context messages.
    ///
    /// 返回用于内部错误上下文消息的自然语言短语。
    pub(super) fn as_phrase(self) -> &'static str {
        match self {
            Self::Manager => "the manager stage",
            Self::LifecycleEmit => "the lifecycle-event stage",
            Self::Execution(stage) => stage.as_phrase(),
        }
    }
}
