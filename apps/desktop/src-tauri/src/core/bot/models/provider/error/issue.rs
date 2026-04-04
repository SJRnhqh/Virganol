// apps/desktop/src-tauri/src/core/bot/models/provider/error/issue.rs
// 外部依赖
use serde::{Deserialize, Serialize};

// 内部引用
use super::super::ProviderId;
use super::ProviderErrorCode;

/// 一条 Provider 级问题（严格绑定具体 provider，不允许 None）。
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProviderIssue {
    /// 问题所属的 Provider。
    pub provider: ProviderId,
    /// 结构化问题编码，与 ProviderError variant 一一对应。
    pub code: ProviderErrorCode,
    /// 面向前端展示或日志记录的问题描述。
    pub message: String,
}

impl ProviderIssue {
    /// 构造一条 Provider 级问题。
    pub fn new(provider: ProviderId, code: ProviderErrorCode, message: impl Into<String>) -> Self {
        Self {
            provider,
            code,
            message: message.into(),
        }
    }
}
