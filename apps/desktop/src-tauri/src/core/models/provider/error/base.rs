// apps/desktop/src-tauri/src/core/models/provider/error/base.rs
// 外部依赖
use serde::{Serialize, Serializer};
use std::fmt;

// 内部引用
use super::code::ProviderErrorCode;

#[derive(Debug)]
pub enum ProviderError {
    Io(String),
    Serde(serde_json::Error),
    UnsupportedProvider(String),
    LifecycleEventEmit(String),
    LifecycleConcurrentCheck(String),
}

impl fmt::Display for ProviderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Serde(err) => write!(f, "{err}"),
            Self::Io(msg)
            | Self::UnsupportedProvider(msg)
            | Self::LifecycleEventEmit(msg)
            | Self::LifecycleConcurrentCheck(msg) => f.write_str(msg),
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
    pub fn code(&self) -> ProviderErrorCode {
        match self {
            Self::Io(_) => ProviderErrorCode::Io,
            Self::Serde(_) => ProviderErrorCode::Serde,
            Self::UnsupportedProvider(_) => ProviderErrorCode::UnsupportedProvider,
            Self::LifecycleEventEmit(_) => ProviderErrorCode::LifecycleEventEmit,
            Self::LifecycleConcurrentCheck(_) => ProviderErrorCode::LifecycleConcurrentCheck,
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
