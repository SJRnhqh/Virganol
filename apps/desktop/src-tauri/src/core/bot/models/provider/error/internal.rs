// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use serde::{Serialize, Serializer};
use std::fmt;

use super::ProviderErrorKind;

#[derive(Debug)]
pub(in crate::core::bot) enum ProviderError {
    /// Requested provider has no persisted configuration record.
    ///
    /// 请求的 provider 没有对应的持久化配置记录。
    ConfigNotFound(String),
    /// Provider configuration failed to serialize into JSON.
    ///
    /// Provider 配置序列化为 JSON 失败。
    JsonSerialize(serde_json::Error),
    /// Provider configuration failed to deserialize from JSON.
    ///
    /// Provider 配置从 JSON 反序列化失败。
    JsonDeserialize(serde_json::Error),
    Serde(serde_json::Error),
    Io(String),
    UnsupportedProvider(String),
    LifecycleEventEmit(String),
    LifecycleConcurrentCheck(String),
    Keyring(String),
}

impl fmt::Display for ProviderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::ConfigNotFound(msg)
            | Self::Io(msg)
            | Self::UnsupportedProvider(msg)
            | Self::LifecycleEventEmit(msg)
            | Self::LifecycleConcurrentCheck(msg)
            | Self::Keyring(msg) => f.write_str(msg),
            Self::JsonSerialize(err) | Self::JsonDeserialize(err) => write!(f, "{err}"),
            Self::Serde(err) => write!(f, "{err}"),
        }
    }
}

// TODO(Phase 5.2): 覆写 `source()`，将 `Serde` variant 包裹的 `serde_json::Error` 暴露给错误链，
// 或引入 `thiserror` 统一派生，提升错误溯源能力。
impl std::error::Error for ProviderError {}

impl From<serde_json::Error> for ProviderError {
    fn from(err: serde_json::Error) -> Self {
        Self::Serde(err)
    }
}

impl ProviderError {
    pub fn kind(&self) -> ProviderErrorKind {
        match self {
            Self::ConfigNotFound(_) => {
                unreachable!("ConfigNotFound is not part of legacy ProviderErrorKind")
            }
            Self::JsonSerialize(_) => ProviderErrorKind::Serde,
            Self::JsonDeserialize(_) => ProviderErrorKind::Serde,
            Self::Serde(_) => ProviderErrorKind::Serde,
            Self::Io(_) => ProviderErrorKind::Io,
            Self::UnsupportedProvider(_) => ProviderErrorKind::UnsupportedProvider,
            Self::LifecycleEventEmit(_) => ProviderErrorKind::LifecycleEventEmit,
            Self::LifecycleConcurrentCheck(_) => ProviderErrorKind::LifecycleConcurrentCheck,
            Self::Keyring(_) => ProviderErrorKind::Keyring,
        }
    }

    pub fn message(&self) -> String {
        self.to_string()
    }
}

impl Serialize for ProviderError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
