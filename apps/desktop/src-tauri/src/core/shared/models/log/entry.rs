// apps/desktop/src-tauri/src/core/shared/models/log/entry.rs
use std::time::SystemTime;

use super::LogLevel;

/// Structured log entry.
///
/// 结构化日志条目。
pub(in crate::core) struct LogEntry {
    /// Time when this structured observation was recorded.
    ///
    /// 当前结构化观测被记录的时间。
    timestamp: SystemTime,
    /// Severity of the observed occurrence.
    ///
    /// 所观测发生事实的严重级别。
    level: LogLevel,
}

impl LogEntry {
    /// Creates a structured log entry from a subject reality observation.
    ///
    /// 根据主体实在观测创建结构化日志条目。
    pub(in crate::core) fn from_observation(level: LogLevel) -> Self {
        // TODO: Accept and retain the common structured observation fields.
        Self::new(SystemTime::now(), level)
    }

    /// Creates a structured log entry.
    ///
    /// 创建结构化日志条目。
    fn new(timestamp: SystemTime, level: LogLevel) -> Self {
        Self { timestamp, level }
    }
}
