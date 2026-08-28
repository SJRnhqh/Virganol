// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/stage.rs

/// Settings process reality execution stage.
///
/// 设置过程实在执行阶段。
#[derive(Debug, Clone, Copy)]
pub(super) enum SettingsStage {
    /// Settings storage stage.
    ///
    /// 设置存储阶段。
    Storage,
}

impl SettingsStage {
    /// Creates the storage stage.
    ///
    /// 创建存储阶段。
    pub(super) fn storage() -> Self {
        Self::Storage
    }

    /// Returns a natural phrase for internal error attribution messages.
    ///
    /// 返回用于内部错误归因消息的自然语言短语。
    pub(super) fn as_phrase(self) -> &'static str {
        match self {
            Self::Storage => "the storage stage",
        }
    }
}
