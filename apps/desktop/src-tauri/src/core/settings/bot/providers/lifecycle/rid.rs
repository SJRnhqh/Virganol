// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/rid.rs
// 外部依赖
use std::time::{SystemTime, UNIX_EPOCH};

// 内部引用
use crate::core::models::providers::check::ProviderCheckTrigger;

/// 生成一轮检查的唯一 run_id（后续用于 started/status/completed 关联）
pub(super) fn next_run_id(trigger: ProviderCheckTrigger) -> String {
    let timestamp_ms = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);

    format!("provider-check-{}-{}", trigger.as_tag(), timestamp_ms)
}
