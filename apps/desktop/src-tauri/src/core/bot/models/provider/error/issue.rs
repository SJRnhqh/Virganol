// apps/desktop/src-tauri/src/core/bot/models/provider/error/issue.rs
// 外部依赖
use serde::Serialize;

// 内部引用
use super::super::ProviderId;
use super::ProviderAppError;

/// 一条 Provider 级问题（严格绑定具体 provider，不允许 None）。
#[derive(Serialize)]
pub struct ProviderIssue {
    /// 问题所属的 Provider。
    pub provider: ProviderId,
    /// 结构化错误信息。
    pub error: ProviderAppError,
}

impl ProviderIssue {
    /// 构造一条 Provider 级问题。
    pub fn new(provider: ProviderId, error: ProviderAppError) -> Self {
        Self { provider, error }
    }
}
