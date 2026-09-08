// apps/desktop/src-tauri/src/container/logging/console.rs
use std::io::stderr;
use tracing::Subscriber;
use tracing_subscriber::{
    fmt::{layer, time::ChronoLocal},
    registry::LookupSpan,
    Layer,
};

use super::{default_env_filter, ColoredFields};

/// Builds the console logging layer.
///
/// 构建控制台日志层。
pub(super) fn console_layer<S>() -> impl Layer<S>
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    layer()
        .compact()
        .fmt_fields(ColoredFields)
        .with_timer(ChronoLocal::new("%H:%M:%S%.3f".to_string()))
        .with_target(false)
        .with_writer(stderr)
        .with_filter(default_env_filter())
}
