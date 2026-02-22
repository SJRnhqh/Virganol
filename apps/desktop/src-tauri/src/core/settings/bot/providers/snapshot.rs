// apps/desktop/src-tauri/src/core/settings/bot/providers/snapshot.rs
// 内部引用
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::ProviderRecord;

/// 被跳过的 provider 配置明细（可恢复兼容性问题，不中断生命周期）
#[derive(Debug, Clone)]
pub struct SkippedProviderDetail {
    pub raw_id: String,
    pub code: String,
    pub message: String,
}

/// 启动检查用的 Provider 加载结果（已完成 provider_id 类型收敛）
pub struct SupportedProvidersSnapshot {
    pub total: usize,
    pub supported: Vec<(ProviderId, ProviderRecord)>,
    pub skipped: Vec<SkippedProviderDetail>,
}
