// apps/desktop/src-tauri/src/core/bot/models/provider/secret/resolution.rs
use super::{ProviderKey, ProviderKeyMeta, ProviderKeySource};

/// Result of resolving a provider API key and its source metadata.
///
/// Provider API key 及其来源元信息的解析结果。
pub(in crate::core::bot) enum ProviderResolvedKey {
    /// Provider API key resolved from a concrete source.
    ///
    /// 从明确来源解析到的 Provider API key。
    Available {
        /// Resolved provider API key.
        ///
        /// 已解析到的 Provider API key。
        key: ProviderKey,
        /// Source used to resolve the provider API key.
        ///
        /// Provider API key 的解析来源。
        source: ProviderKeySource,
    },
    /// No usable provider API key is available.
    ///
    /// 未解析到可用的 Provider API key。
    Unavailable,
}

impl ProviderResolvedKey {
    /// Creates an available resolved key from a concrete source.
    ///
    /// 创建带有明确来源的可用解析 key。
    pub(in crate::core::bot) fn available(key: ProviderKey, source: ProviderKeySource) -> Self {
        Self::Available { key, source }
    }

    /// Creates an unavailable resolved key when no key is available.
    ///
    /// 创建未解析到可用 key 的不可用解析状态。
    pub(in crate::core::bot) fn unavailable() -> Self {
        Self::Unavailable
    }

    /// Returns the resolved key, if available.
    ///
    /// 返回已解析到的 key；不存在可用 key 时返回 None。
    pub(in crate::core::bot) fn key(&self) -> Option<&ProviderKey> {
        match self {
            Self::Available { key, .. } => Some(key),
            Self::Unavailable => None,
        }
    }

    /// Consumes the resolved key and returns the source metadata.
    ///
    /// 消费解析 key 并返回来源元信息。
    pub(in crate::core::bot) fn into_meta(self) -> ProviderKeyMeta {
        match self {
            Self::Available { source, .. } => ProviderKeyMeta::with_source(source),
            Self::Unavailable => ProviderKeyMeta::none(),
        }
    }
}
