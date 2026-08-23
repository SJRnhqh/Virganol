// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/storage.rs
use super::{SettingsErrorContext, SettingsStage};

/// Settings storage context.
///
/// 设置存储上下文。
pub(in crate::core::bot) struct SettingsStorageContext {
    /// Settings process execution stage represented by this context.
    ///
    /// 当前上下文表示的设置业务过程执行阶段。
    stage: SettingsStage,
}

impl SettingsStorageContext {
    /// Creates a settings storage context.
    ///
    /// 创建设置存储上下文。
    pub(in crate::core::bot::models) fn storage() -> Self {
        Self {
            stage: SettingsStage::storage(),
        }
    }

    /// Creates an error context snapshot from this storage context.
    ///
    /// 根据当前存储上下文创建错误上下文快照。
    pub(in crate::core::bot::models::process::settings) fn error_context(
        &self,
    ) -> SettingsErrorContext {
        SettingsErrorContext::from_parts(self.stage)
    }
}
