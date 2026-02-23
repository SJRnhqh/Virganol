// apps/desktop/src-tauri/src/core/models/providers/issue.rs
use serde::{Deserialize, Serialize};

use crate::core::models::provider::ProviderId;

/// 一条 Provider 级问题（严格绑定具体 provider，不允许 None）。
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProviderIssue {
    /// 问题所属的 Provider。
    pub provider: ProviderId,
    /// 结构化问题编码（如 unsupported_provider / emit_status_failed）。
    pub code: String,
    /// 面向前端展示或日志记录的问题描述。
    pub message: String,
}

impl ProviderIssue {
    /// 构造一条 Provider 级问题。
    pub fn new(provider: ProviderId, code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            provider,
            code: code.into(),
            message: message.into(),
        }
    }
}
