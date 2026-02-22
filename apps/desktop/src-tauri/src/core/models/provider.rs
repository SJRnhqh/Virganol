// apps/desktop/src-tauri/src/core/models/provider.rs
// 外部依赖
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProviderId {
    Ollama,
    Deepseek,
}

impl ProviderId {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Ollama => "ollama",
            Self::Deepseek => "deepseek",
        }
    }

    /// provider 对应的环境变量候选键（按优先级顺序）。
    pub fn env_key_names(self) -> &'static [&'static str] {
        match self {
            Self::Deepseek => &["DEEPSEEK_API_KEY"],
            _ => &[],
        }
    }
}

impl TryFrom<&str> for ProviderId {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value {
            "ollama" => Ok(Self::Ollama),
            "deepseek" => Ok(Self::Deepseek),
            other => Err(format!("unknown provider id: {}", other)),
        }
    }
}

impl fmt::Display for ProviderId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}
