// apps/desktop/src-tauri/src/container/logging/console.rs
use std::io::stderr;
use tracing::Subscriber;
use tracing_subscriber::{
    filter::{EnvFilter, LevelFilter},
    fmt::layer,
    registry::LookupSpan,
    Layer,
};

/// Builds the console logging layer.
///
/// 构建控制台日志层。
pub(super) fn console_layer<S>() -> impl Layer<S>
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    layer().with_writer(stderr).with_filter(
        EnvFilter::builder()
            .with_default_directive(LevelFilter::INFO.into())
            .from_env_lossy(),
    )
}
