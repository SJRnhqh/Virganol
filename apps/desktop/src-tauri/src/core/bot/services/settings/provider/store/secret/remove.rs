// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/remove.rs
use keyring::{Entry, Error as KeyringError};

use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, PROVIDER_KEYRING_SERVICE,
};

/// Removes the stored API key for a provider from the system keyring.
///
/// 从系统密钥库删除指定供应商的 API 密钥。
pub(in crate::core::bot::services::settings::provider) fn remove_provider_key(
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str())
        .map_err(|source| ProviderError::secret_store_init(ctx, source))?;

    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(source) => Err(ProviderError::secret_store_remove(ctx, source)),
    }
}
