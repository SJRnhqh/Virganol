// apps/desktop/src-tauri/src/core/models/providers/error/base.rs
use serde::{Serialize, Serializer};
use thiserror::Error;

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
    pub fn code(&self) -> &'static str {
        match self {
            Self::Io(_) => "io_error",
            Self::Serde(_) => "serde_error",
            Self::UnsupportedProvider(_) => "unsupported_provider",
            Self::LifecycleEventEmit(_) => "lifecycle_event_emit_failed",
            Self::LifecycleTaskJoin(_) => "lifecycle_task_join_failed",
            Self::LifecyclePartialFailure(_) => "lifecycle_partial_failure",
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
