// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/error.rs
use std::fmt::{Display, Formatter, Result};

use super::SettingsStage;

/// Settings error attribution context snapshot.
///
/// 设置错误归因上下文快照。
#[derive(Debug)]
pub(in crate::core::bot::models::process::settings) struct SettingsErrorContext {
    /// Settings process reality execution stage where the failure was observed.
    ///
    /// 观察到失败时所在的设置过程实在执行阶段。
    stage: SettingsStage,
}

impl SettingsErrorContext {
    /// Creates a settings error attribution context snapshot.
    ///
    /// 创建设置错误归因上下文快照。
    pub(super) fn from_parts(stage: SettingsStage) -> Self {
        Self { stage }
    }
}

impl Display for SettingsErrorContext {
    /// Formats the attribution context for internal error messages.
    ///
    /// 将归因上下文格式化为内部错误消息。
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(f, "the settings process at {}", self.stage.as_phrase())
    }
}
