// apps/desktop/src-tauri/src/core/models/provider/error/code.rs
// 外部依赖
use serde::{Deserialize, Serialize};
use std::fmt;

/// Provider 错误码枚举，与 ProviderError variant 一一对应。
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProviderErrorCode {
    #[serde(rename = "io_error")]
    Io,
    #[serde(rename = "serde_error")]
    Serde,
    #[serde(rename = "unsupported_provider")]
    UnsupportedProvider,
    #[serde(rename = "lifecycle_event_emit_failed")]
    LifecycleEventEmit,
    #[serde(rename = "lifecycle_task_join_failed")]
    LifecycleTaskJoin,
    #[serde(rename = "lifecycle_partial_failure")]
    LifecyclePartialFailure,
}

impl ProviderErrorCode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Io => "io_error",
            Self::Serde => "serde_error",
            Self::UnsupportedProvider => "unsupported_provider",
            Self::LifecycleEventEmit => "lifecycle_event_emit_failed",
            Self::LifecycleTaskJoin => "lifecycle_task_join_failed",
            Self::LifecyclePartialFailure => "lifecycle_partial_failure",
        }
    }
}

impl fmt::Display for ProviderErrorCode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}
