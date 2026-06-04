// apps/desktop/src-tauri/src/core/bot/models/provider/secret/meta.rs
use serde::Serialize;

/// Source from which a provider API key was resolved.
///
/// Provider API key 的解析来源。
#[derive(Clone, Copy, Serialize)]
#[serde(rename_all = "snake_case")]
pub(in crate::core::bot) enum ProviderKeySource {
    /// No usable provider API key was resolved.
    ///
    /// 未解析到可用的 Provider API key。
    None,
    /// Provider API key was resolved from an environment variable.
    ///
    /// Provider API key 来自环境变量。
    Env,
    /// Provider API key was resolved from the system keyring.
    ///
    /// Provider API key 来自系统密钥库。
    Keyring,
}

/// Metadata describing whether a provider API key is available and where it was resolved from.
///
/// Provider API key 是否可用及其解析来源的脱敏元信息。
#[derive(Serialize)]
pub(in crate::core::bot) struct ProviderKeyMeta {
    /// Whether a usable provider API key is available.
    ///
    /// 是否存在可用的 Provider API key。
    has_key: bool,
    /// Source used to resolve the provider API key.
    ///
    /// Provider API key 的解析来源。
    key_source: ProviderKeySource,
}

impl ProviderKeyMeta {
    /// Creates metadata for a provider with no available key.
    ///
    /// 创建未解析到可用 key 时的脱敏元信息。
    pub(super) fn none() -> Self {
        Self {
            has_key: false,
            key_source: ProviderKeySource::None,
        }
    }

    /// Creates metadata from a key source and derives whether a key is available.
    ///
    /// 根据 key 来源创建脱敏元信息，并自动推导是否存在可用 key。
    pub(super) fn with_source(key_source: ProviderKeySource) -> Self {
        Self {
            has_key: !matches!(key_source, ProviderKeySource::None),
            key_source,
        }
    }
}
