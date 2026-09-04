// apps/desktop/src-tauri/src/container/logging/filter.rs
use tracing_subscriber::filter::EnvFilter;

use super::DEFAULT_LOG_LEVEL;

/// Builds the RUST_LOG-aware filter that falls back to the default level.
///
/// 构建感知 RUST_LOG 的过滤器，未设置时回落默认级别。
pub(super) fn default_env_filter() -> EnvFilter {
    EnvFilter::builder()
        .with_default_directive(DEFAULT_LOG_LEVEL.into())
        .from_env_lossy()
}
