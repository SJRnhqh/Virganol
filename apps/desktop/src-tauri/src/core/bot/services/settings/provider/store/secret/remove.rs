// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/remove.rs
use keyring::{Entry, Error as KeyringError};

use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, PROVIDER_KEYRING_SERVICE,
};

/// Removes provider API key from system keyring.
///
/// 从系统密钥库删除 provider 的 API Key。
pub(in crate::core::bot::services::settings::provider) fn remove_provider_key(
    _ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str()).map_err(|source| {
        ProviderError::SecretStoreInit {
            provider_id,
            source,
        }
    })?;

    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(source) => Err(ProviderError::SecretStoreRemove {
            provider_id,
            source,
        }),
    }
}
