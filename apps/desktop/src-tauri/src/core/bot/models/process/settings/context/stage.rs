// apps/desktop/src-tauri/src/core/bot/models/process/settings/context/stage.rs

/// Settings process business execution stage.
///
/// settings 过程业务执行阶段。
#[derive(Debug, Clone, Copy)]
pub(super) enum SettingsStage {
    /// Settings storage path.
    ///
    /// settings 存储阶段。
    Storage,
}

impl SettingsStage {
    /// Creates the storage stage.
    ///
    /// 创建存储阶段。
    pub(super) fn storage() -> Self {
        Self::Storage
    }

    /// Returns a natural phrase for internal error context messages.
    ///
    /// 返回用于内部错误上下文消息的自然语言短语。
    pub(super) fn as_phrase(self) -> &'static str {
        match self {
            Self::Storage => "the storage stage",
        }
    }
}
