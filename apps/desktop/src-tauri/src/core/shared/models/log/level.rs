// apps/desktop/src-tauri/src/core/shared/models/log/level.rs
use log::Level;

use self::LogLevel::{Debug, Error, Info, Trace, Warn};

/// Severity level of a structured log entry.
///
/// 结构化日志条目的严重级别。
pub(in crate::core) enum LogLevel {
    /// An error that prevents an operation from completing.
    ///
    /// 阻止操作完成的错误。
    Error,
    /// A warning about a recoverable or potentially harmful condition.
    ///
    /// 可恢复或潜在有害状况的警告。
    Warn,
    /// Informational progress during normal operation.
    ///
    /// 正常运行期间的信息性进展。
    Info,
    /// Diagnostic information for development and troubleshooting.
    ///
    /// 用于开发与排障的诊断信息。
    Debug,
    /// Fine-grained execution details for deep troubleshooting.
    ///
    /// 用于深度排障的细粒度执行详情。
    Trace,
}

impl From<&LogLevel> for Level {
    /// Converts a structured log severity into a facade log level.
    ///
    /// 将结构化日志严重级别转换为日志门面级别。
    fn from(level: &LogLevel) -> Self {
        match level {
            Error => Self::Error,
            Warn => Self::Warn,
            Info => Self::Info,
            Debug => Self::Debug,
            Trace => Self::Trace,
        }
    }
}
