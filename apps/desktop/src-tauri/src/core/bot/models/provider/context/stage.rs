// apps/desktop/src-tauri/src/core/bot/models/provider/context/stage.rs
use strum::Display;

/// Provider subject reality business execution stage.
///
/// 供应商主体实在业务执行阶段。
#[derive(Display, Debug, Clone, Copy)]
#[strum(serialize_all = "snake_case")]
pub(in crate::core::bot::models::provider) enum ProviderStage {
    /// Provider manager orchestration.
    ///
    /// 供应商管理编排阶段。
    Manager,
    /// Provider lifecycle event emission.
    ///
    /// 供应商生命周期事件推送阶段。
    LifecycleEmit,
    /// Provider connection path.
    ///
    /// 供应商连接阶段。
    Connection,
    /// Provider config store path.
    ///
    /// 供应商配置存储阶段。
    ConfigStore,
    /// Provider secret store path.
    ///
    /// 供应商密钥存储阶段。
    SecretStore,
}

impl ProviderStage {
    /// Creates the manager orchestration stage.
    ///
    /// 创建管理编排阶段。
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
