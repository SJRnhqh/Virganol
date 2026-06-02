// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/update.rs
use tauri::AppHandle;

use super::super::super::super::super::super::{
    ProviderError, ProviderId, ProviderState, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::save_settings;
use super::load_all_providers;

/// Updates enabled models for a provider.
///
/// 更新某个 provider 的 enabled_models。
pub(crate) fn update_models(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> Result<(), ProviderError> {
    let _guard = provider_state.lock_store();
    let mut providers = load_all_providers(app)?;

    let Some(record) = providers.get_mut(provider_id.as_str()) else {
        return Err(ProviderError::UnsupportedProvider(format!(
            "{} not found in store",
            provider_id
        )));
    };

    record.replace_enabled_models(enabled_models);

    let value = serde_json::to_value(&providers)?;
    save_settings(app, SPIRIT_PROVIDERS_KEY, value)
}
