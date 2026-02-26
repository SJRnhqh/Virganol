// apps/desktop/src-tauri/src/core/models/providers/error/base.rs
// 外部依赖
use serde::{Serialize, Serializer};
use thiserror::Error;

// 内部引用
use super::code::ProviderErrorCode;

#[derive(Debug, Error)]
pub enum ProviderError {
    #[error("I/O error: {0}")]
    Io(String),
    #[error("JSON serde error: {0}")]
    Serde(#[from] serde_json::Error),
    #[error("Unsupported provider: {0}")]
    UnsupportedProvider(String),
    #[error("Lifecycle event emit failed: {0}")]
    LifecycleEventEmit(String),
    #[error("Lifecycle task join failed: {0}")]
    LifecycleTaskJoin(String),
    #[error("Lifecycle partial failure: {0}")]
    LifecyclePartialFailure(String),
}

impl ProviderError {
    pub fn code(&self) -> ProviderErrorCode {
        match self {
            Self::Io(_) => ProviderErrorCode::Io,
            Self::Serde(_) => ProviderErrorCode::Serde,
            Self::UnsupportedProvider(_) => ProviderErrorCode::UnsupportedProvider,
            Self::LifecycleEventEmit(_) => ProviderErrorCode::LifecycleEventEmit,
            Self::LifecycleTaskJoin(_) => ProviderErrorCode::LifecycleTaskJoin,
            Self::LifecyclePartialFailure(_) => ProviderErrorCode::LifecyclePartialFailure,
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
