// apps/desktop/src-tauri/src/core/bot/models/provider/context/stage.rs
use std::fmt;

/// Provider domain business execution stage.
///
/// Provider 领域业务执行阶段。
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
}

impl fmt::Display for ProviderStage {
    /// Formats this Provider stage for diagnostic context messages.
    ///
    /// 将当前 Provider 阶段格式化为诊断上下文消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Manager => f.write_str("the manager stage"),
            Self::LifecycleEmit => f.write_str("the lifecycle event stage"),
            Self::Connection => f.write_str("the connection stage"),
            Self::ConfigStore => f.write_str("the config store stage"),
            Self::SecretStore => f.write_str("the secret store stage"),
        }
    }
}
