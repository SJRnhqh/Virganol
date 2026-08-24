// apps/desktop/src-tauri/src/core/bot/models/provider/secret/resolution.rs
use super::{ProviderKey, ProviderKeyMeta, ProviderKeySource};

/// Result of resolving a provider API key and its source metadata.
///
/// 供应商 API 密钥及其来源元信息的解析结果。
pub(in crate::core::bot) enum ProviderResolvedKey {
    /// Provider API key resolved from a concrete source.
    ///
    /// 从明确来源解析到的供应商 API 密钥。
    Available {
        /// Resolved provider API key.
        ///
        /// 已解析到的供应商 API 密钥。
        key: ProviderKey,
        /// Source used to resolve the provider API key.
        ///
        /// 供应商 API 密钥的解析来源。
        source: ProviderKeySource,
    },
    /// No usable provider API key is available.
    ///
    /// 未解析到可用的供应商 API 密钥。
    Unavailable,
}

impl ProviderResolvedKey {
    /// Creates an available resolved key from a concrete source.
    ///
    /// 创建带有明确来源的可用解析密钥。
    pub(in crate::core::bot) fn available(key: ProviderKey, source: ProviderKeySource) -> Self {
        Self::Available { key, source }
    }

    /// Creates an unavailable resolved key when no key is available.
    ///
    /// 创建未解析到可用密钥的不可用解析状态。
    pub(in crate::core::bot) fn unavailable() -> Self {
        Self::Unavailable
    }

    /// Returns the resolved key, if available.
    ///
    /// 返回已解析到的密钥；不存在可用密钥时返回空值。
    pub(in crate::core::bot) fn key(&self) -> Option<&ProviderKey> {
        match self {
            Self::Available { key, .. } => Some(key),
            Self::Unavailable => None,
        }
    }

    /// Consumes the resolved key and returns the source metadata.
    ///
    /// 消费解析密钥并返回来源元信息。
    pub(in crate::core::bot) fn into_meta(self) -> ProviderKeyMeta {
        match self {
            Self::Available { source, .. } => ProviderKeyMeta::with_source(source),
            Self::Unavailable => ProviderKeyMeta::none(),
        }
    }
}
