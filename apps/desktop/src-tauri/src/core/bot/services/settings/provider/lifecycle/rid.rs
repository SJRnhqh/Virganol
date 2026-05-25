// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/rid.rs
// 外部依赖
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

// 内部引用
use crate::core::bot::models::ProviderCheckTrigger;

/// 进程级 run 序列号：用于规避同毫秒内 run_id 冲突。
static RUN_SEQ: AtomicU64 = AtomicU64::new(0);

/// 生成一轮检查的唯一 run_id（后续用于 started/status/completed 关联）
pub(super) fn next_run_id(trigger: &ProviderCheckTrigger) -> String {
    let timestamp_ms = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let seq = RUN_SEQ.fetch_add(1, Ordering::Relaxed);

    format!(
        "provider-check-{}-{}-{}",
        trigger.as_tag(),
        timestamp_ms,
        seq
    )
}
