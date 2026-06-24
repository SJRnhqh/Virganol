// apps/desktop/src-tauri/src/core/bot/models/provider/context/error.rs
use std::fmt;

use super::super::ProviderId;

/// Provider error attribution context snapshot.
///
/// Provider 错误归因上下文快照。
#[derive(Debug)]
pub(in crate::core::bot) struct ProviderErrorContext {
    /// Provider targeted by the failing execution, when attributable.
    ///
    /// 当失败执行可归属到单个 Provider 时携带对应 Provider ID。
    provider_id: Option<ProviderId>,
}

impl ProviderErrorContext {
    /// Creates error context for a failure without provider attribution.
    ///
    /// 创建无法归属到单个 Provider 的错误上下文。
    pub(in crate::core::bot) fn without_provider() -> Self {
        Self { provider_id: None }
    }

    /// Creates error context for a provider-attributed failure.
    ///
    /// 创建可归属到单个 Provider 的错误上下文。
    pub(in crate::core::bot) fn with_provider(provider_id: ProviderId) -> Self {
        Self {
            provider_id: Some(provider_id),
        }
    }

    /// Returns the provider attribution carried by this error context.
    ///
    /// 返回当前错误上下文携带的 Provider 归因。
    pub(in crate::core::bot) fn provider_id(&self) -> Option<ProviderId> {
        self.provider_id
    }
}

impl fmt::Display for ProviderErrorContext {
    /// Formats the error context for internal error messages.
    ///
    /// 将错误上下文格式化为内部错误消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.provider_id {
            Some(provider_id) => write!(f, "provider {provider_id}"),
            None => f.write_str("an unknown provider"),
        }
    }
}
