// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/load.rs
use std::collections::HashMap;
use tauri::AppHandle;

use super::super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::super::{
    ProviderCheckSnapshot, ProviderError, ProviderExecutionContext, ProviderId,
    ProviderLifecycleContext, ProviderRecord, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::load_settings;

/// Loads all saved providers from settings.
///
/// 从配置中读取所有已保存的 providers。
pub(super) fn load_all_providers(
    app: &AppHandle,
    provider_id: Option<ProviderId>,
) -> Result<HashMap<String, ProviderRecord>, ProviderError> {
    let maybe_value = load_settings(app, SPIRIT_PROVIDERS_KEY, provider_id)?;
    let Some(value) = maybe_value else {
        return Ok(HashMap::new());
    };

    let providers: HashMap<String, ProviderRecord> =
        serde_json::from_value(value).map_err(|source| ProviderError::JsonDeserialize {
            provider_id,
            source,
        })?;
    Ok(providers)
}

/// Loads the provider check snapshot from persisted settings.
///
/// 从持久化配置中加载 Provider 检查快照。
pub(in crate::core::bot::services::settings::provider) fn load_provider_check_snapshot(
    app: &AppHandle,
    _ctx: &ProviderLifecycleContext,
) -> Result<ProviderCheckSnapshot, ProviderError> {
    let providers = load_all_providers(app, None)?;
    let total = providers.len();
    let mut supported = Vec::new();
    let mut skipped = Vec::new();

    for (raw_id, record) in providers {
        match ProviderId::try_from(raw_id.as_str()) {
            Ok(provider_id) => supported.push((provider_id, record)),
            Err(e) => {
                e.downgrade();
                skipped.push(raw_id);
            }
        }
    }

    Ok(ProviderCheckSnapshot::new(total, supported, skipped))
}

/// Loads one provider configuration as an owned read-only snapshot.
///
/// 读取单个 provider 的配置，返回拥有所有权的只读快照。
pub(in crate::core::bot::services::settings::provider) fn load_provider_record(
    app: &AppHandle,
    _ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let mut providers = load_all_providers(app, Some(provider_id))?;
    Ok(providers.remove(provider_id.as_str()))
}
