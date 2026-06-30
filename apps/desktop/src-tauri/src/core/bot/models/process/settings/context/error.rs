// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/error.rs
use std::fmt;

use super::SettingsStage;

/// Settings error attribution context snapshot.
///
/// settings 错误归因上下文快照。
#[derive(Debug)]
pub(in crate::core::bot::models::process::settings) struct SettingsErrorContext {
    /// Settings process execution stage where the failure was observed.
    ///
    /// 观察到失败时所在的 settings 过程执行阶段。
    stage: SettingsStage,
}

impl SettingsErrorContext {
    /// Creates an error context snapshot from settings attribution.
    ///
    /// 基于 settings 归因创建错误上下文快照。
    pub(super) fn from_parts(stage: SettingsStage) -> Self {
        Self { stage }
    }
}

impl fmt::Display for SettingsErrorContext {
    /// Formats this error context snapshot for internal error messages.
    ///
    /// 将此错误上下文快照格式化为内部错误消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "the settings process at {}", self.stage.as_phrase())
    }
}
