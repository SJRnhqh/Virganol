// apps/desktop/src-tauri/src/core/shared/models/log/app.rs
use std::fmt::Display;
use tracing::{debug, error, info, trace, warn};

use super::{
    LogEntry,
    LogLevel::{Debug, Error, Info, Trace, Warn},
};

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
        Occurrence: Display,
        Stage: Display,
        Subject: Display,
        Operation: Display,
    {
        let (level, occurrence, attribution) = entry.into_parts();
        let (attribution_stage, attribution_subject, attribution_operation) =
            attribution.into_parts();

        /// Records the entry fields through one severity macro.
        ///
        /// 通过单个严重级别宏记录条目字段。
        macro_rules! record_at {
            ($record:ident) => {
                $record!(
                    %occurrence,
                    %attribution_stage,
                    %attribution_subject,
                    %attribution_operation
                )
            };
        }

        match level {
            Error => record_at!(error),
            Warn => record_at!(warn),
            Info => record_at!(info),
            Debug => record_at!(debug),
            Trace => record_at!(trace),
        }
    }
}
