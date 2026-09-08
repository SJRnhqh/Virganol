// apps/desktop/src-tauri/src/core/bot/models/provider/log/observation.rs
use strum::{Display, EnumProperty};

use super::super::super::super::super::LogLevel::{self, Info, Warn};

/// Observation facts observed by the Provider subject reality logging branch.
///
/// 供应商主体实在日志分支观测到的观测事实。
#[derive(Display, EnumProperty)]
#[strum(serialize_all = "snake_case")]
pub(super) enum ProviderObservation {
    /// Provider key rollback skipped to preserve a newer key value.
    ///
    /// 为保留较新的密钥值而跳过供应商密钥回滚。
    #[strum(props(severity = "warn"))]
    SecretRollbackSkipped,
    /// One provider was connected and persisted successfully.
    ///
    /// 已成功连接并持久化一个供应商。
    ProviderConnected,
    /// Provider key change was rolled back successfully.
    ///
    /// 已成功回滚供应商密钥变更。
    ProviderKeyRolledBack,
    /// Persisted configuration and secret material were reset for one provider.
    ///
    /// 已重置一个供应商的持久化配置与密钥材料。
    ProviderReset,
    /// Persisted configuration was restored after one provider reset failed.
    ///
    /// 一次供应商重置失败后，已恢复持久化配置。
    ProviderConfigRestored,
    /// Enabled models were updated successfully for one provider.
    ///
    /// 已成功更新一个供应商的启用模型列表。
    EnabledModelsUpdated,
    /// One provider check lifecycle run started.
    ///
    /// 一轮供应商检查生命周期开始运行。
    CheckStarted,
    /// One provider check lifecycle run completed.
    ///
    /// 一轮供应商检查生命周期完成运行。
    CheckCompleted,
}

impl ProviderObservation {
    /// Severity assigned to each Provider observation by the logging contract.
    ///
    /// 日志契约为每个供应商观测事实指定的严重级别，未声明时默认为信息级。
    pub(super) fn severity(&self) -> LogLevel {
        match self.get_str("severity") {
            Some("warn") => Warn,
            _ => Info,
        }
    }
}
