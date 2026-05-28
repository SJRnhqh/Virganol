// apps/desktop/src-tauri/src/core/bot/models/provider/security.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum ProviderKeySource {
    None,
    Env,
    Keyring,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProviderSecretMeta {
    pub has_key: bool,
    pub key_source: ProviderKeySource,
}

impl ProviderSecretMeta {
    /// 构造“无密钥”状态的脱敏元信息
    pub fn none() -> Self {
        Self {
            has_key: false,
            key_source: ProviderKeySource::None,
        }
    }

    /// 根据密钥来源构造脱敏元信息，并自动推导 has_key
    pub fn with_source(key_source: ProviderKeySource) -> Self {
        Self {
            has_key: !matches!(key_source, ProviderKeySource::None),
            key_source,
        }
    }
}
