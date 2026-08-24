// apps/desktop/src-tauri/src/core/bot/models/provider/common/element/subject.rs
use std::fmt::{Display, Formatter, Result};

use super::ProviderId;

/// Subject used for provider context and error attribution.
///
/// 用于供应商上下文和错误归因的主体。
#[derive(Debug, Clone)]
pub(in crate::core::bot) enum ProviderSubject {
    /// A concrete provider identified by a stable provider identifier.
    ///
    /// 由稳定供应商标识表示的具体供应商。
    Provider(
        /// Stable provider identifier.
        ///
        /// 稳定供应商标识。
        ProviderId,
    ),
    /// The persisted configured provider collection.
    ///
    /// 持久化配置中的已配置供应商集合。
    ConfiguredProviders,
    /// An unvalidated raw identifier loaded from storage.
    ///
    /// 从存储中读取的未校验原始标识。
    Candidate(
        /// Raw provider identifier loaded from storage.
        ///
        /// 从存储中读取的原始供应商标识。
        String,
    ),
}

impl ProviderSubject {
    /// Returns the concrete provider identifier when available.
    ///
    /// 有具体供应商时返回其标识。
    pub(in crate::core::bot::models::provider) fn provider_id(&self) -> Option<ProviderId> {
        match self {
            Self::Provider(provider_id) => Some(*provider_id),
            Self::ConfiguredProviders | Self::Candidate(_) => None,
        }
    }

    /// Creates a subject for the configured provider collection.
    ///
    /// 创建表示已配置供应商集合的主体。
    pub(in crate::core::bot) fn configured_providers() -> Self {
        Self::ConfiguredProviders
    }
}

impl From<ProviderId> for ProviderSubject {
    /// Creates a provider subject from a concrete provider identifier.
    ///
    /// 根据具体供应商标识创建供应商主体。
    fn from(provider_id: ProviderId) -> Self {
        Self::Provider(provider_id)
    }
}

impl Display for ProviderSubject {
    /// Formats the subject for diagnostic messages.
    ///
    /// 将主体格式化为诊断消息。
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        match self {
            Self::Provider(provider_id) => write!(f, "provider {provider_id}"),
            Self::ConfiguredProviders => f.write_str("the configured providers"),
            Self::Candidate(raw) => write!(f, "candidate {raw}"),
        }
    }
}
