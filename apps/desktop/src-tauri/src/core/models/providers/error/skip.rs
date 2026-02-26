// apps/desktop/src-tauri/src/core/models/providers/error/skip.rs
// 内部引用
use super::code::ProviderErrorCode;

/// 被跳过的 provider 配置明细（可恢复兼容性问题，不中断生命周期）
#[derive(Debug, Clone)]
pub struct SkippedProviderDetail {
    pub raw_id: String,
    pub code: ProviderErrorCode,
    pub message: String,
}
