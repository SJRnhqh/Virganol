// apps/desktop/src-tauri/src/core/shared/models/log/entry.rs
use super::super::AppAttribution;
use super::LogLevel;

/// Generic structured log entry.
///
/// 通用结构化日志条目。
pub(in crate::core) struct LogEntry<Occurrence, Stage, Subject, Operation> {
    /// Severity of the observed occurrence.
    ///
    /// 所观测发生事实的严重级别。
    level: LogLevel,
    /// Domain fact observed by this entry.
    ///
    /// 当前条目观测到的领域事实。
    occurrence: Occurrence,
    /// Attribution of the observed runtime fact.
    ///
    /// 所观测运行时事实的归因。
    attribution: AppAttribution<Stage, Subject, Operation>,
}

impl<Occurrence, Stage, Subject, Operation> LogEntry<Occurrence, Stage, Subject, Operation> {
    /// Creates a structured log entry from a subject reality observation.
    ///
    /// 根据主体实在观测创建结构化日志条目。
    pub(in crate::core) fn from_observation(
        level: LogLevel,
        occurrence: Occurrence,
        attribution: AppAttribution<Stage, Subject, Operation>,
    ) -> Self {
        Self::new(level, occurrence, attribution)
    }

    /// Consumes this entry into the fields written by the application logger.
    ///
    /// 消费当前条目并返回应用日志器写入的字段。
    pub(super) fn into_parts(
        self,
    ) -> (
        LogLevel,
        Occurrence,
        AppAttribution<Stage, Subject, Operation>,
    ) {
        (self.level, self.occurrence, self.attribution)
    }

    /// Creates a structured log entry.
    ///
    /// 创建结构化日志条目。
    fn new(
        level: LogLevel,
        occurrence: Occurrence,
        attribution: AppAttribution<Stage, Subject, Operation>,
    ) -> Self {
        Self {
            level,
            occurrence,
            attribution,
        }
    }
}
