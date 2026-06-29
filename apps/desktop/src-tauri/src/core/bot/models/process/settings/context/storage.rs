// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/storage.rs

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
}
