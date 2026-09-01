// apps/desktop/src-tauri/src/container/logging/registration.rs
use tracing_subscriber::{layer::SubscriberExt, registry, util::SubscriberInitExt};

use super::console_layer;

/// Initializes the desktop logging backend.
///
/// 初始化桌面日志后端。
pub(in crate::container) fn init_logging() {
    registry().with(console_layer()).init();
}
