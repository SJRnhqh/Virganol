// apps/desktop/src-tauri/src/core/bot/services/settings/provider/key/save.rs
// 外部依赖
use keyring::Entry;

// 内部引用
use crate::core::bot::constants::PROVIDER_KEYRING_SERVICE;
use crate::core::bot::models::{ProviderError, ProviderId};

/// 将 provider 的 API Key 写入系统密钥库。
///
/// - `provider_id` 使用 ProviderId 枚举，避免无效字符串传入
/// - `key` 调用方需保证非空且已 trim
pub(crate) fn save_provider_key(provider_id: ProviderId, key: &str) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str())
        .map_err(|e| ProviderError::Keyring(format!("init keyring entry failed: {}", e)))?;
    entry.set_password(key).map_err(|e| {
        ProviderError::Keyring(format!(
            "save key failed for {}: {}",
            provider_id.as_str(),
            e
        ))
    })
}
