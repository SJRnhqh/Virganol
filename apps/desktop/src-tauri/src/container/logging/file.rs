// apps/desktop/src-tauri/src/container/logging/file.rs
use std::path::Path;
use tracing::Subscriber;
use tracing_appender::{
    non_blocking,
    non_blocking::WorkerGuard,
    rolling::{InitError, RollingFileAppender, Rotation},
};
use tracing_subscriber::{
    filter::EnvFilter,
    fmt::{format::FmtSpan, layer},
    registry::LookupSpan,
    Layer,
};

use super::{ReportingWriter, DEFAULT_LOG_LEVEL, LOG_FILE_EXT, LOG_FILE_STEM};

/// Builds the non-blocking daily rolling JSONL layer and its worker guard.
///
/// 构建非阻塞的每日轮转 JSONL 层及其后台写入守卫。
pub(super) fn jsonl_layer<S>(
    log_dir: impl AsRef<Path>,
) -> Result<(impl Layer<S>, WorkerGuard), InitError>
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    let appender = RollingFileAppender::builder()
        .rotation(Rotation::DAILY)
        .filename_prefix(LOG_FILE_STEM)
        .filename_suffix(LOG_FILE_EXT)
        .build(log_dir)?;

    let (writer, guard) = non_blocking(ReportingWriter::new(appender));

    Ok((
        layer()
            .json()
            .with_span_events(FmtSpan::CLOSE)
            .with_writer(writer)
            .with_filter(
                EnvFilter::builder()
                    .with_default_directive(DEFAULT_LOG_LEVEL.into())
                    .from_env_lossy(),
            ),
        guard,
    ))
}
