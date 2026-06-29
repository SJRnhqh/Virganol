// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/storage.rs

/// Settings business process context.
///
/// 设置业务过程上下文。
pub(in crate::core::bot) struct SettingsProcessContext;

impl SettingsProcessContext {
    /// Creates a settings storage context.
    ///
    /// 创建 settings 存储上下文。
    pub(in crate::core::bot) fn storage() -> Self {
        Self
    }
}
