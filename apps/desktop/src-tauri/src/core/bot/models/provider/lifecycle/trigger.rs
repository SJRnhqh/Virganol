// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/trigger.rs
use serde::Serialize;

/// The source that triggers a provider lifecycle check.
///
/// 供应商生命周期检查的触发来源。
#[derive(Serialize)]
#[serde(rename_all = "snake_case")]
pub(crate) enum ProviderCheckTrigger {
    /// Triggered automatically after application startup.
    ///
    /// 应用启动后自动触发的检查。
    Startup,
    /// Triggered by a user-initiated full refresh.
    ///
    /// 用户手动发起的全量刷新检查。
    ManualRefresh,
}

impl ProviderCheckTrigger {
    /// Returns the stable trigger tag used in lifecycle logs and run ids.
    ///
    /// 返回生命周期日志与运行标识中使用的稳定触发来源标签。
    pub(in crate::core::bot) fn as_tag(&self) -> &'static str {
        match self {
            Self::Startup => "startup",
            Self::ManualRefresh => "manual_refresh",
        }
    }
}
