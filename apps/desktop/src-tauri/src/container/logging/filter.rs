// apps/desktop/src-tauri/src/container/logging/filter.rs
use std::env::var;
use tracing_subscriber::filter::EnvFilter;

use super::DEFAULT_LOG_LEVEL;

/// Builds the RUST_LOG-aware filter with the default level fallback.
///
/// 构建感知 RUST_LOG 的过滤器，未设置或非法时回落默认级别。
pub(super) fn default_env_filter() -> EnvFilter {
    EnvFilter::builder()
        .with_default_directive(DEFAULT_LOG_LEVEL.into())
        .from_env_lossy()
}

/// Resolves the banner level display from valid RUST_LOG directives.
///
/// 从合法的 RUST_LOG 指令推导横幅级别展示值，逐条丢弃非法指令，全无效时回落默认级别。
pub(super) fn banner_level() -> String {
    let value = var("RUST_LOG").unwrap_or_default();

    let valid = value.split(',').filter(|directive| !directive.is_empty());
    let display = valid
        .filter(|directive| EnvFilter::try_new(*directive).is_ok())
        .collect::<Vec<_>>()
        .join(",");

    if display.is_empty() {
        DEFAULT_LOG_LEVEL.to_string().to_ascii_lowercase()
    } else {
        display
    }
}
