// apps/desktop/src-tauri/src/core/bot/models/provider/secret/resolution.rs
use super::super::{ProviderKeySource, ProviderSecretMeta};
use super::ProviderKey;

/// Result of resolving a provider API key and its source metadata.
///
/// Provider API key 及其来源元信息的解析结果。
pub(crate) struct ProviderKeyResolution {
    /// Resolved provider API key, if one is available.
    ///
    /// 已解析到的 Provider API key；不存在可用 key 时为 None。
    key: Option<ProviderKey>,
    /// Source metadata for the resolved key.
    ///
    /// 已解析 key 的来源元信息。
    meta: ProviderSecretMeta,
}

impl ProviderKeyResolution {
    /// Creates a resolution for a key found from a concrete source.
    ///
    /// 创建带有明确来源的 key 解析结果。
    pub(crate) fn found(key: ProviderKey, source: ProviderKeySource) -> Self {
        Self {
            key: Some(key),
            meta: ProviderSecretMeta::with_source(source),
        }
    }

    /// Creates an empty resolution when no key is available.
    ///
    /// 创建未解析到可用 key 的空解析结果。
    pub(crate) fn none() -> Self {
        Self {
            key: None,
            meta: ProviderSecretMeta::none(),
        }
    }

    /// Returns the resolved key, if available.
    ///
    /// 返回已解析到的 key；不存在可用 key 时返回 None。
    pub(crate) fn key(&self) -> Option<&ProviderKey> {
        self.key.as_ref()
    }

    /// Consumes the resolution and returns the source metadata.
    ///
    /// 消费解析结果并返回来源元信息。
    pub(crate) fn into_meta(self) -> ProviderSecretMeta {
        self.meta
    }
}
