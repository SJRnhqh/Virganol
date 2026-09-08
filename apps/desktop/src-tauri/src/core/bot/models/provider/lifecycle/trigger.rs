// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/trigger.rs
use serde::Serialize;
use strum::Display;

/// The source that triggers a provider lifecycle check.
///
/// 供应商生命周期检查的触发来源。
#[derive(Display, Serialize)]
#[serde(rename_all = "snake_case")]
#[strum(serialize_all = "snake_case")]
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
