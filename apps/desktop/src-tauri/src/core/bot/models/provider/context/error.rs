// apps/desktop/src-tauri/src/core/bot/models/provider/context/error.rs
use std::fmt;

use super::super::ProviderId;
use super::ProviderStage;

/// Provider error attribution context snapshot.
///
/// Provider 错误归因上下文快照。
#[derive(Debug)]
pub(in crate::core::bot) struct ProviderErrorContext {
    /// Provider targeted by the failing execution, when attributable.
    ///
    /// 当失败执行可归属到单个 Provider 时携带对应 Provider ID。
    provider_id: Option<ProviderId>,
    /// Provider-domain execution stage where the failure was observed.
    ///
    /// 观察到失败时所在的 Provider 领域执行阶段。
    stage: ProviderStage,
}

impl ProviderErrorContext {
    /// Returns the provider attribution carried by this error context.
    ///
    /// 返回当前错误上下文携带的 Provider 归因。
    pub(in crate::core::bot) fn provider_id(&self) -> Option<ProviderId> {
        self.provider_id
    }

    /// Adds provider attribution to this error context.
    ///
    /// 为当前错误上下文补充 Provider 归因。
    pub(super) fn with_provider(self, provider_id: ProviderId) -> Self {
        Self {
            provider_id: Some(provider_id),
            stage: self.stage,
        }
    }

    /// Creates error context from provider attribution and execution stage.
    ///
    /// 基于 Provider 归因与执行阶段创建错误上下文。
    pub(super) fn from_parts(provider_id: Option<ProviderId>, stage: ProviderStage) -> Self {
        Self { provider_id, stage }
    }
}

impl fmt::Display for ProviderErrorContext {
    /// Formats the error context for internal error messages.
    ///
    /// 将错误上下文格式化为内部错误消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.provider_id {
            Some(provider_id) => write!(f, "provider {provider_id} at {}", self.stage.as_phrase()),
            None => write!(f, "the provider subsystem at {}", self.stage.as_phrase()),
        }
    }
}
