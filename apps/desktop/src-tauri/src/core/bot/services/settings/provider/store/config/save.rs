// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/save.rs
use tauri::AppHandle;

use super::super::super::super::super::super::{
    ProviderError, ProviderId, ProviderRecord, ProviderState, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::save_settings;
use super::load_all_providers;

/// Saves a single provider configuration (upsert: overwrite if exists, insert if not).
///
/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）。
pub(crate) fn save_provider(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
    record: ProviderRecord,
) -> Result<(), ProviderError> {
    let _guard = provider_state.store_lock.lock();
    let mut providers = load_all_providers(app)?;
    providers.insert(provider_id.to_string(), record);

    let value = serde_json::to_value(&providers)?;
    save_settings(app, SPIRIT_PROVIDERS_KEY, value)
}
