// apps/desktop/src-tauri/src/core/bot/models/provider/common/element/id.rs
use serde::{Deserialize, Serialize};
use std::fmt;

use super::super::super::ProviderError;

/// Supported provider identifier shared across commands, storage, and events.
///
/// commands、持久化和事件共用的受支持 provider 标识。
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub(in crate::core::bot) enum ProviderId {
    /// Local Ollama provider.
    ///
    /// 本地 Ollama provider。
    #[serde(rename = "ollama")]
    Ollama,
    /// DeepSeek hosted provider.
    ///
    /// DeepSeek 托管 provider。
    #[serde(rename = "deepseek")]
    DeepSeek,
}

impl ProviderId {
    /// Returns the stable provider id string.
    ///
    /// 返回稳定的 provider id 字符串。
    pub(in crate::core::bot) fn as_str(self) -> &'static str {
        match self {
            Self::Ollama => "ollama",
            Self::DeepSeek => "deepseek",
        }
    }

    /// Returns candidate environment variable names for this provider, in priority order.
    ///
    /// 返回当前 provider 的环境变量候选键，按优先级排序。
    pub(in crate::core::bot) fn env_key_names(self) -> &'static [&'static str] {
        match self {
            Self::DeepSeek => &["DEEPSEEK_API_KEY"],
            _ => &[],
        }
    }
}

impl TryFrom<&str> for ProviderId {
    type Error = ProviderError;

    /// Parses a persisted provider id into a backend-supported provider id.
    ///
    /// 将持久化的 provider id 解析为后端当前支持的 provider id。
    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value {
            "ollama" => Ok(Self::Ollama),
            "deepseek" => Ok(Self::DeepSeek),
            other => Err(ProviderError::UnsupportedProvider {
                raw_provider_id: other.to_string(),
            }),
        }
    }
}

impl fmt::Display for ProviderId {
    /// Formats the provider id as its stable string value.
    ///
    /// 将 provider id 格式化为稳定字符串值。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}
