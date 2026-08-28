// apps/desktop/src-tauri/src/core/shared/models/log/app.rs
use log::log;
use std::fmt::Display;

use super::LogEntry;

/// Application-scoped structured logging write facade.
///
/// 应用级结构化日志写入门面。
#[derive(Clone)]
pub(crate) struct AppLogger;

impl AppLogger {
    /// Records a structured log entry through the application logger.
    ///
    /// 通过应用日志记录器记录结构化日志条目。
    pub(in crate::core) fn record<Occurrence, Stage, Subject, Operation>(
        &self,
        entry: LogEntry<Occurrence, Stage, Subject, Operation>,
    ) where
        LogEntry<Occurrence, Stage, Subject, Operation>: Display,
    {
        log!(entry.level().into(), "{entry}");
    }
}
