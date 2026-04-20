// apps/desktop/src-tauri/src/core/bot/services/settings/provider/key/remove.rs
// 外部依赖
use keyring::{Entry, Error as KeyringError};

// 内部引用
use super::super::super::super::super::{ProviderError, ProviderId, PROVIDER_KEYRING_SERVICE};

/// 从系统密钥库删除 provider 的 API Key。
///
/// - `provider_id` 使用 ProviderId 枚举，避免无效字符串传入
/// - 条目不存在（`NoEntry`）视为成功（幂等）
pub(crate) fn remove_provider_key(provider_id: ProviderId) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str())
        .map_err(|e| ProviderError::Keyring(format!("init keyring entry failed: {}", e)))?;

    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(e) => Err(ProviderError::Keyring(format!(
            "remove key failed for {}: {}",
            provider_id.as_str(),
            e
        ))),
    }
}
