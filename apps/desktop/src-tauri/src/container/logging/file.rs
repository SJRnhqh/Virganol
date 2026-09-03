// apps/desktop/src-tauri/src/container/logging/file.rs
use std::path::Path;
use tracing::Subscriber;
use tracing_appender::{
    non_blocking,
    non_blocking::WorkerGuard,
    rolling::{InitError, RollingFileAppender, Rotation},
};
use tracing_subscriber::{
    filter::{EnvFilter, LevelFilter},
    fmt::{format::FmtSpan, layer},
    registry::LookupSpan,
    Layer,
};

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
        .filename_prefix("virganol")
        .filename_suffix("jsonl")
        .build(log_dir)?;

    let (writer, guard) = non_blocking(appender);

    Ok((
        layer()
            .json()
            .with_span_events(FmtSpan::CLOSE)
            .with_writer(writer)
            .with_filter(
                EnvFilter::builder()
                    .with_default_directive(LevelFilter::INFO.into())
                    .from_env_lossy(),
            ),
        guard,
    ))
}
