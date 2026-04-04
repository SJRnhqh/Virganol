// apps/desktop/src-tauri/src/core/bot/models/provider/snapshot.rs
// 内部引用
use super::{ProviderId, ProviderRecord, SkippedProviderDetail};

/// 启动检查用的 Provider 加载结果（已完成 provider_id 类型收敛）
pub struct SupportedProvidersSnapshot {
    pub total: usize,
    pub supported: Vec<(ProviderId, ProviderRecord)>,
    pub skipped: Vec<SkippedProviderDetail>,
}
