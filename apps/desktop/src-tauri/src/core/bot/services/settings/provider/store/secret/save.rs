// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/save.rs
use keyring::Entry;

use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, PROVIDER_KEYRING_SERVICE,
};

/// Saves provider API key to the system keyring.
///
/// 将 provider 的 API Key 写入系统密钥库。
pub(super) fn save_provider_key(
    _ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
    key: &str,
) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str()).map_err(|source| {
        ProviderError::SecretStoreInit {
            provider_id,
            source,
        }
    })?;
    entry
        .set_password(key)
        .map_err(|source| ProviderError::SecretStoreWrite {
            provider_id,
            source,
        })
}
