// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/storage.rs
use super::SettingsErrorContext;

/// Settings storage business context.
///
/// settings 存储业务上下文。
pub(in crate::core::bot) struct SettingsStorageContext;

impl SettingsStorageContext {
    /// Creates a settings storage context.
    ///
    /// 创建 settings 存储上下文。
    pub(in crate::core::bot) fn storage() -> Self {
        Self
    }

    /// Projects this storage context into an error attribution snapshot.
    ///
    /// 将当前存储上下文投影为错误归因快照。
    pub(in crate::core::bot) fn error_context(&self) -> SettingsErrorContext {
        SettingsErrorContext::from_parts()
    }
}
