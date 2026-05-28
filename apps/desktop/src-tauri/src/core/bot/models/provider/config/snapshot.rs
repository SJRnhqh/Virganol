// apps/desktop/src-tauri/src/core/bot/models/provider/config/snapshot.rs
use super::super::{ProviderId, SkippedProviderDetail};
use super::ProviderRecord;

/// Provider check snapshot loaded from persisted settings.
///
/// 从持久化配置加载得到的 Provider 检查快照。
pub(crate) struct ProviderCheckSnapshot {
    pub(crate) total: usize,
    pub(crate) supported: Vec<(ProviderId, ProviderRecord)>,
    pub(crate) skipped: Vec<SkippedProviderDetail>,
}
