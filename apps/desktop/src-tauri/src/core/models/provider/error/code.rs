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

#[cfg(test)]
mod tests {
    use super::*;

    // as_str、Display、serde 序列化三者输出一致，守护前后端错误码契约
    #[test]
    fn as_str_display_and_serde_consistent() {
        let cases = [
            (ProviderErrorCode::Io, "io_error"),
            (ProviderErrorCode::Serde, "serde_error"),
            (ProviderErrorCode::UnsupportedProvider, "unsupported_provider"),
            (ProviderErrorCode::LifecycleEventEmit, "lifecycle_event_emit_failed"),
            (ProviderErrorCode::LifecycleTaskJoin, "lifecycle_task_join_failed"),
            (ProviderErrorCode::LifecyclePartialFailure, "lifecycle_partial_failure"),
        ];
        for (code, expected) in cases {
            assert_eq!(code.as_str(), expected);
            assert_eq!(code.to_string(), expected);
            assert_eq!(serde_json::to_string(&code).unwrap(), format!("\"{}\"", expected));
        }
    }
}
