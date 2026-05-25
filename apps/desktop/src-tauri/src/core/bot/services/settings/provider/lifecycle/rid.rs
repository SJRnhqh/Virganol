// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/rid.rs
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use super::super::super::super::super::ProviderCheckTrigger;

/// Process-local run sequence used to avoid same-millisecond run_id collisions.
///
/// 进程级 run 序列号，用于规避同毫秒内的 run_id 冲突。
static RUN_SEQ: AtomicU64 = AtomicU64::new(0);

/// Generates the correlation id for one provider lifecycle check.
///
/// 生成一轮 Provider 生命周期检查的关联 ID，用于串联 started/status/completed/failed 事件。
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
