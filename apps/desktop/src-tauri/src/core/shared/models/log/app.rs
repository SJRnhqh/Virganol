// apps/desktop/src-tauri/src/core/shared/models/log/app.rs
use std::fmt::Display;
use tracing::{debug, error, info, trace, warn};

use super::super::AppAttribution;
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
        AppAttribution<Stage, Subject, Operation>: Display,
    {
        let (level, occurrence, attribution) = entry.into_parts();

        match level {
            Error => error!(%occurrence, %attribution),
            Warn => warn!(%occurrence, %attribution),
            Info => info!(%occurrence, %attribution),
            Debug => debug!(%occurrence, %attribution),
            Trace => trace!(%occurrence, %attribution),
        }
    }
}
