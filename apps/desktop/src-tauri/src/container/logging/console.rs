// apps/desktop/src-tauri/src/container/logging/console.rs
use std::io::stderr;
use tracing::Subscriber;
use tracing_subscriber::{
    filter::{EnvFilter, LevelFilter},
    fmt::{layer, time::ChronoLocal},
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
    layer()
        .compact()
        .with_timer(ChronoLocal::new("%H:%M:%S%.3f".to_string()))
        .with_target(false)
        .with_writer(stderr)
        .with_filter(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
}
