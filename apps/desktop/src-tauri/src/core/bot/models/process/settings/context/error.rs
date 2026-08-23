// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/error.rs
use std::fmt;

use super::SettingsStage;

/// Settings error context snapshot.
///
/// 设置错误上下文快照。
#[derive(Debug)]
pub(in crate::core::bot::models::process::settings) struct SettingsErrorContext {
    /// Settings process execution stage where the failure was observed.
    ///
    /// 观察到失败时所在的设置业务过程执行阶段。
    stage: SettingsStage,
}

impl SettingsErrorContext {
    /// Creates a settings error context snapshot.
    ///
    /// 创建设置错误上下文快照。
    pub(super) fn from_parts(stage: SettingsStage) -> Self {
        Self { stage }
    }
}

impl fmt::Display for SettingsErrorContext {
    /// Formats the context for internal error messages.
    ///
    /// 将上下文格式化为内部错误消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "the settings process at {}", self.stage.as_phrase())
    }
}
