// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/remove.rs
use keyring::{Entry, Error as KeyringError};

use super::super::super::super::super::super::{
    ProviderError, ProviderId, PROVIDER_KEYRING_SERVICE,
};

/// Removes provider API key from system keyring.
///
/// 从系统密钥库删除 provider 的 API Key。
pub(in crate::core::bot::services::settings::provider) fn remove_provider_key(
    provider_id: ProviderId,
) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str())
        .map_err(|e| ProviderError::SecretStoreInit(format!("init keyring entry failed: {}", e)))?;

    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(e) => Err(ProviderError::SecretStoreRemove(format!(
            "remove key failed for {}: {}",
            provider_id.as_str(),
            e
        ))),
    }
}
