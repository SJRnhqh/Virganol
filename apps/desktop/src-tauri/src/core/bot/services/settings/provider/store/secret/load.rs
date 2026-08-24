// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/load.rs
use keyring::{Entry, Error::NoEntry};
use std::env::var;
use zeroize::Zeroize;

use super::super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, ProviderKey, PROVIDER_KEYRING_SERVICE,
};

/// Loads a provider API key from the system keyring.
///
/// 从系统密钥库读取供应商 API 密钥。
pub(super) fn load_provider_key(
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Option<ProviderKey> {
    let entry = match Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str()) {
        Ok(entry) => entry,
        Err(source) => {
            ProviderError::secret_store_init(ctx, source).downgrade();
            return None;
        }
    };

    let raw_key = match entry.get_password() {
        Ok(raw_key) => raw_key,
        Err(NoEntry) => return None,
        Err(source) => {
            ProviderError::secret_store_read(ctx, source).downgrade();
            return None;
        }
    };

    normalize_and_wrap_key(raw_key)
}

/// Loads a provider API key from environment variables.
///
/// 从环境变量读取供应商 API 密钥。
pub(super) fn load_provider_env(provider_id: ProviderId) -> Option<ProviderKey> {
    provider_id
        .env_key_names()
        .iter()
        .find_map(|env_name| normalize_and_wrap_key(var(env_name).ok()?))
}

/// Normalizes a raw API key and clears discarded buffer content.
///
/// 归一化原始 API 密钥，并清理被丢弃的缓冲区。
fn normalize_and_wrap_key(mut raw_key: String) -> Option<ProviderKey> {
    let trimmed = raw_key.trim();

    if trimmed.is_empty() {
        raw_key.zeroize();
        return None;
    }

    if trimmed.len() == raw_key.len() {
        return Some(ProviderKey::new(raw_key));
    }

    let key = trimmed.to_string();
    raw_key.zeroize();
    Some(ProviderKey::new(key))
}
