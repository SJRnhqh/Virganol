// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/load.rs
use keyring::{Entry, Error as KeyringError};
use zeroize::Zeroize;

use super::super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::super::{
    ProviderError, ProviderId, ProviderKey, PROVIDER_KEYRING_SERVICE,
};

/// Loads provider API key from the system keyring (permissive: errors downgraded to warn).
///
/// 从系统密钥库读取 provider 的 API Key（宽容模式：错误降级为 warn）。
pub(super) fn load_provider_key(provider_id: ProviderId) -> Option<ProviderKey> {
    let entry = match Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str()) {
        Ok(e) => e,
        Err(e) => {
            ProviderError::SecretStoreInit(format!("init keyring entry failed: {}", e)).downgrade();
            return None;
        }
    };

    let value = match entry.get_password() {
        Ok(v) => v,
        Err(KeyringError::NoEntry) => return None,
        Err(e) => {
            ProviderError::SecretStoreRead(format!(
                "load key failed for {}: {}",
                provider_id.as_str(),
                e
            ))
            .downgrade();
            return None;
        }
    };

    normalize_and_wrap_key(value)
}

/// Loads provider API key from environment variables (dev/CI fallback).
///
/// 从环境变量读取 provider 的 API Key（开发/CI 兜底）。
pub(super) fn load_provider_env(provider_id: ProviderId) -> Option<ProviderKey> {
    provider_id
        .env_key_names()
        .iter()
        .find_map(|env_name| normalize_and_wrap_key(std::env::var(env_name).ok()?))
}

/// Normalizes a raw key value: trims whitespace, zeroizes the source on copy or empty.
///
/// 规范化原始密钥：trim 空白；需复制或为空时清零原始缓冲区，无空白时零拷贝复用。
fn normalize_and_wrap_key(mut value: String) -> Option<ProviderKey> {
    let trimmed = value.trim();

    if trimmed.is_empty() {
        value.zeroize();
        return None;
    }

    if trimmed.len() == value.len() {
        return Some(ProviderKey::new(value));
    }

    let key = trimmed.to_string();
    value.zeroize();
    Some(ProviderKey::new(key))
}
