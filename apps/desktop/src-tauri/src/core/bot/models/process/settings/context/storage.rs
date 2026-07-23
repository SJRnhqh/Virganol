// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/storage.rs
use super::{SettingsErrorContext, SettingsStage};

/// Settings storage business context.
///
/// 设置存储业务上下文。
pub(in crate::core::bot) struct SettingsStorageContext {
    /// Settings process execution stage represented by this context view.
    ///
    /// 当前上下文视图表示的设置业务过程执行阶段。
    stage: SettingsStage,
}

impl SettingsStorageContext {
    /// Creates a settings storage context.
    ///
    /// 创建设置存储上下文。
    pub(in crate::core::bot) fn storage() -> Self {
        Self {
            stage: SettingsStage::storage(),
        }
    }

    /// Projects this storage context into an error attribution snapshot.
    ///
    /// 将当前存储上下文投影为错误归因快照。
    pub(in crate::core::bot::models::process::settings) fn error_context(
        &self,
    ) -> SettingsErrorContext {
        SettingsErrorContext::from_parts(self.stage)
    }
}
