// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/save.rs
use keyring::Entry;

use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, PROVIDER_KEYRING_SERVICE,
};

/// Saves a provider API key to the system keyring.
///
/// 将供应商 API 密钥写入系统密钥库。
pub(super) fn save_provider_key(
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
    key: &str,
) -> Result<(), ProviderError> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str())
        .map_err(|source| ProviderError::secret_store_init(ctx, source))?;
    entry
        .set_password(key)
        .map_err(|source| ProviderError::secret_store_write(ctx, source))
}
