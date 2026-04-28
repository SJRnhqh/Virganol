// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/remove.rs
use log::warn;
use tauri::AppHandle;

use super::super::super::super::super::super::{
    ProviderError, ProviderId, ProviderRecord, ProviderState, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::save_settings;
use super::super::load_all_providers;

/// Removes a provider configuration and returns the deleted record for rollback.
///
/// 删除 provider 配置，返回被删除的记录用于回滚。
pub(crate) fn remove_provider(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let _guard = provider_state.store_lock.lock();
    let mut providers = load_all_providers(app)?;
    let previous = providers.remove(provider_id.as_str());

    if previous.is_none() {
        warn!("[Tauri] ⚠️ {} config not found, already clean", provider_id);
        return Ok(None);
    }

    let value = serde_json::to_value(&providers)?;
    save_settings(app, SPIRIT_PROVIDERS_KEY, value)?;
    Ok(previous)
}
