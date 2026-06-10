// apps/desktop/src-tauri/src/core/bot/models/provider/error/kind.rs
use serde::{Deserialize, Serialize};
use std::fmt;

/// Provider internal error kind, currently aligned with ProviderError variants.
///
/// Provider 栈内错误分类，当前与 ProviderError variant 一一对应。
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProviderErrorKind {
    #[serde(rename = "io_error")]
    Io,
    #[serde(rename = "serde_error")]
    Serde,
    #[serde(rename = "unsupported_provider")]
    UnsupportedProvider,
    #[serde(rename = "lifecycle_event_emit_failed")]
    LifecycleEventEmit,
    #[serde(rename = "lifecycle_concurrent_check_failed")]
    LifecycleConcurrentCheck,
    #[serde(rename = "keyring_error")]
    Keyring,
}

impl ProviderErrorKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Io => "io_error",
            Self::Serde => "serde_error",
            Self::UnsupportedProvider => "unsupported_provider",
            Self::LifecycleEventEmit => "lifecycle_event_emit_failed",
            Self::LifecycleConcurrentCheck => "lifecycle_concurrent_check_failed",
            Self::Keyring => "keyring_error",
        }
    }
}

impl fmt::Display for ProviderErrorKind {
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
            (ProviderErrorKind::Io, "io_error"),
            (ProviderErrorKind::Serde, "serde_error"),
            (
                ProviderErrorKind::UnsupportedProvider,
                "unsupported_provider",
            ),
            (
                ProviderErrorKind::LifecycleEventEmit,
                "lifecycle_event_emit_failed",
            ),
            (
                ProviderErrorKind::LifecycleConcurrentCheck,
                "lifecycle_concurrent_check_failed",
            ),
        ];
        for (code, expected) in cases {
            assert_eq!(code.as_str(), expected);
            assert_eq!(code.to_string(), expected);
            assert_eq!(
                serde_json::to_string(&code).unwrap(),
                format!("\"{}\"", expected)
            );
        }
    }
}
