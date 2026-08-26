// apps/desktop/src-tauri/src/core/shared/models/log/entry.rs
use std::time::SystemTime;

use super::super::AppAttribution;
use super::LogLevel;

/// Structured log entry.
///
/// 结构化日志条目。
pub(in crate::core) struct LogEntry<Stage, Subject, Operation> {
    /// Time when this structured observation was recorded.
    ///
    /// 当前结构化观测被记录的时间。
    timestamp: SystemTime,
    /// Severity of the observed occurrence.
    ///
    /// 所观测发生事实的严重级别。
    level: LogLevel,
    /// Attribution of the observed runtime fact.
    ///
    /// 所观测运行时事实的归因。
    attribution: AppAttribution<Stage, Subject, Operation>,
}

impl<Stage, Subject, Operation> LogEntry<Stage, Subject, Operation> {
    /// Creates a structured log entry from a subject reality observation.
    ///
    /// 根据主体实在观测创建结构化日志条目。
    pub(in crate::core) fn from_observation(
        level: LogLevel,
        attribution: AppAttribution<Stage, Subject, Operation>,
    ) -> Self {
        Self::new(SystemTime::now(), level, attribution)
    }

    /// Creates a structured log entry.
    ///
    /// 创建结构化日志条目。
    fn new(
        timestamp: SystemTime,
        level: LogLevel,
        attribution: AppAttribution<Stage, Subject, Operation>,
    ) -> Self {
        Self {
            timestamp,
            level,
            attribution,
        }
    }
}
