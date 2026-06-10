// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use serde::{Serialize, Serializer};
use std::fmt;

use super::{ProviderAppError, ProviderErrorKind};

#[derive(Debug)]
pub(in crate::core::bot) enum ProviderError {
    Io(String),
    Serde(serde_json::Error),
    UnsupportedProvider(String),
    LifecycleEventEmit(String),
    LifecycleConcurrentCheck(String),
    Keyring(String),
}

impl fmt::Display for ProviderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Serde(err) => write!(f, "{err}"),
            Self::Io(msg)
            | Self::UnsupportedProvider(msg)
            | Self::LifecycleEventEmit(msg)
            | Self::LifecycleConcurrentCheck(msg)
            | Self::Keyring(msg) => f.write_str(msg),
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
            Self::Io(_) => ProviderErrorKind::Io,
            Self::Serde(_) => ProviderErrorKind::Serde,
            Self::UnsupportedProvider(_) => ProviderErrorKind::UnsupportedProvider,
            Self::LifecycleEventEmit(_) => ProviderErrorKind::LifecycleEventEmit,
            Self::LifecycleConcurrentCheck(_) => ProviderErrorKind::LifecycleConcurrentCheck,
            Self::Keyring(_) => ProviderErrorKind::Keyring,
        }
    }

    pub fn message(&self) -> String {
        self.to_string()
    }

    /// Converts the internal provider error into a provider app boundary error.
    ///
    /// 将内部 Provider 错误转换为 Provider 应用边界错误。
    pub(in crate::core::bot) fn into_app_error(self) -> ProviderAppError {
        // TODO: Map ProviderError variants into stable ProviderErrorCode values.
        todo!("map ProviderError into ProviderAppError")
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
