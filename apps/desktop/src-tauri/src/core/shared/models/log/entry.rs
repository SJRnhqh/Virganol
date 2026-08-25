// apps/desktop/src-tauri/src/core/shared/models/log/entry.rs

/// Structured log entry.
///
/// 结构化日志条目。
pub(in crate::core) struct LogEntry;

impl LogEntry {
    /// Creates a structured log entry from its common parts.
    ///
    /// 使用通用组成部分创建结构化日志条目。
    pub(in crate::core) fn from_parts() -> Self {
        Self::new()
    }

    /// Creates a structured log entry.
    ///
    /// 创建结构化日志条目。
    fn new() -> Self {
        Self
    }
}
