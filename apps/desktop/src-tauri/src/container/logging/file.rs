// apps/desktop/src-tauri/src/container/logging/file.rs
use std::path::Path;
use tracing::Subscriber;
use tracing_appender::rolling::{InitError, RollingFileAppender, Rotation};
use tracing_subscriber::{
    filter::{EnvFilter, LevelFilter},
    fmt::layer,
    registry::LookupSpan,
    Layer,
};

/// Builds the daily JSONL file logging layer.
///
/// 构建每日轮转的 JSONL 文件日志层。
pub(super) fn jsonl_layer<S>(log_dir: impl AsRef<Path>) -> Result<impl Layer<S>, InitError>
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    let writer = RollingFileAppender::builder()
        .rotation(Rotation::DAILY)
        .filename_prefix("virganol")
        .filename_suffix("jsonl")
        .build(log_dir)?;

    Ok(layer().json().with_writer(writer).with_filter(
        EnvFilter::builder()
            .with_default_directive(LevelFilter::INFO.into())
            .from_env_lossy(),
    ))
}
