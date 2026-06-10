// apps/desktop/src-tauri/src/core/bot/models/provider/error/skip.rs
// 内部引用
use super::ProviderErrorKind;

/// 被跳过的 provider 配置明细（可恢复兼容性问题，不中断生命周期）
#[derive(Debug, Clone)]
pub struct SkippedProviderDetail {
    pub raw_id: String,
    pub code: ProviderErrorKind,
    pub message: String,
}

impl SkippedProviderDetail {
    /// 构造一条被跳过的 provider 明细。
    pub fn new(
        raw_id: impl Into<String>,
        code: ProviderErrorKind,
        message: impl Into<String>,
    ) -> Self {
        Self {
            raw_id: raw_id.into(),
            code,
            message: message.into(),
        }
    }
}
