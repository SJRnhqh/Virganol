// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/load.rs
use std::collections::HashMap;
use tauri::AppHandle;

use super::super::super::super::super::super::{
    ProviderCheckSnapshot, ProviderError, ProviderId, ProviderRecord, SkippedProviderDetail,
    SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::load_settings;

/// Loads all saved providers from settings.
///
/// 从配置中读取所有已保存的 providers。
pub(super) fn load_all_providers(
    app: &AppHandle,
) -> Result<HashMap<String, ProviderRecord>, ProviderError> {
    let maybe_value = load_settings(app, SPIRIT_PROVIDERS_KEY)?;
    let Some(value) = maybe_value else {
        return Ok(HashMap::new());
    };

    let providers: HashMap<String, ProviderRecord> =
        serde_json::from_value(value).map_err(ProviderError::JsonDeserialize)?;
    Ok(providers)
}

/// Loads the provider check snapshot from persisted settings.
///
/// 从持久化配置中加载 Provider 检查快照。
pub(in crate::core::bot::services::settings::provider) fn load_provider_check_snapshot(
    app: &AppHandle,
) -> Result<ProviderCheckSnapshot, ProviderError> {
    let providers = load_all_providers(app)?;
    let total = providers.len();
    let mut supported = Vec::new();
    let mut skipped = Vec::new();

    for (raw_id, record) in providers {
        match ProviderId::try_from(raw_id.as_str()) {
            Ok(provider_id) => supported.push((provider_id, record)),
            Err(error) => skipped.push(SkippedProviderDetail::new(
                raw_id,
                error.kind(),
                error.message(),
            )),
        }
    }

    Ok(ProviderCheckSnapshot::new(total, supported, skipped))
}

/// Loads one provider configuration as an owned read-only snapshot.
///
/// 读取单个 provider 的配置，返回拥有所有权的只读快照。
pub(in crate::core::bot::services::settings::provider) fn load_provider_record(
    app: &AppHandle,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let providers = load_all_providers(app)?;
    // TODO(post-0.0.1): avoid this clone if a provider cache or per-provider store is introduced.
    Ok(providers.get(provider_id.as_str()).cloned())
}
