// apps/desktop/src-tauri/src/core/bot/models/provider/common/element/id.rs
use serde::{Deserialize, Serialize};
use std::fmt;

/// Provider identifier shared by commands, storage, and events.
///
/// 命令、存储和事件共用的供应商标识。
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub(in crate::core::bot) enum ProviderId {
    /// Local Ollama provider identifier.
    ///
    /// 本地 Ollama 供应商标识。
    #[serde(rename = "ollama")]
    Ollama,
    /// Hosted DeepSeek provider identifier.
    ///
    /// 托管的 DeepSeek 供应商标识。
    #[serde(rename = "deepseek")]
    DeepSeek,
}

impl ProviderId {
    /// Parses a persisted identifier into a supported provider identifier.
    ///
    /// 将持久化标识解析为受支持的供应商标识。
    pub(in crate::core::bot) fn parse(value: &str) -> Option<Self> {
        match value {
            "ollama" => Some(Self::Ollama),
            "deepseek" => Some(Self::DeepSeek),
            _ => None,
        }
    }

    /// Returns the stable provider identifier string.
    ///
    /// 返回稳定的供应商标识字符串。
    pub(in crate::core::bot) fn as_str(self) -> &'static str {
        match self {
            Self::Ollama => "ollama",
            Self::DeepSeek => "deepseek",
        }
    }

    /// Returns environment variable names for this provider in priority order.
    ///
    /// 按优先级返回当前供应商的环境变量名称。
    pub(in crate::core::bot) fn env_key_names(self) -> &'static [&'static str] {
        match self {
            Self::DeepSeek => &["DEEPSEEK_API_KEY"],
            _ => &[],
        }
    }
}

impl fmt::Display for ProviderId {
    /// Formats the provider identifier as its stable string value.
    ///
    /// 将供应商标识格式化为稳定字符串值。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}
