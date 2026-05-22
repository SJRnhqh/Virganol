// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/load.rs
use std::collections::HashMap;
use tauri::AppHandle;

use super::super::super::super::super::{
    ProviderError, ProviderId, ProviderRecord, SkippedProviderDetail, SupportedProvidersSnapshot,
    SPIRIT_PROVIDERS_KEY,
};
use super::super::super::load_settings;

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

    let providers: HashMap<String, ProviderRecord> = serde_json::from_value(value)?;
    Ok(providers)
}

/// 读取并过滤为"后端当前支持"的 provider 列表（startup_check 专用）
pub(crate) fn load_supported_providers(
    app: &AppHandle,
) -> Result<SupportedProvidersSnapshot, ProviderError> {
    // 上抛严格加载所有配置的错误
    let providers = load_all_providers(app)?;
    let total = providers.len();
    let mut supported = Vec::new();
    let mut skipped = Vec::new();

    for (raw_id, record) in providers {
        match ProviderId::try_from(raw_id.as_str()) {
            Ok(provider_id) => supported.push((provider_id, record)),
            Err(error) => skipped.push(SkippedProviderDetail::new(
                raw_id,
                error.code(),
                error.message(),
            )),
        }
    }

    Ok(SupportedProvidersSnapshot {
        total,
        supported,
        skipped,
    })
}

/// Loads one provider configuration as an owned read-only snapshot.
///
/// 读取单个 provider 的配置，返回拥有所有权的只读快照。
pub(crate) fn load_provider_record(
    app: &AppHandle,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let providers = load_all_providers(app)?;
    // TODO(post-0.0.1): avoid this clone if a provider cache or per-provider store is introduced.
    Ok(providers.get(provider_id.as_str()).cloned())
}
