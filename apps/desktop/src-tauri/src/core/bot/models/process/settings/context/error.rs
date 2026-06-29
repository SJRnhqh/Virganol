// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/error.rs

/// Settings error attribution context snapshot.
///
/// settings 错误归因上下文快照。
pub(in crate::core::bot) struct SettingsErrorContext;

impl SettingsErrorContext {
    /// Creates an error context snapshot from settings attribution.
    ///
    /// 基于 settings 归因创建错误上下文快照。
    pub(super) fn from_parts() -> Self {
        Self
    }
}
