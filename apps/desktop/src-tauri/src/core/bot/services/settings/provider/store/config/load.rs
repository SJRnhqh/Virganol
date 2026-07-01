// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/load.rs
use std::collections::HashMap;
use tauri::AppHandle;

use super::super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::super::{
    ProviderCheckSnapshot, ProviderError, ProviderExecutionContext, ProviderId, ProviderRecord,
    SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::load_settings;

/// Loads all saved provider records.
///
/// 读取所有已保存的供应商配置。
pub(super) fn load_all_providers(
    app: &AppHandle,
    ctx: &ProviderExecutionContext,
) -> Result<HashMap<String, ProviderRecord>, ProviderError> {
    let value = match {
        let ctx = ctx.for_settings_storage();
        load_settings(app, &ctx, SPIRIT_PROVIDERS_KEY)
    } {
        Ok(Some(v)) => v,
        Ok(None) => return Ok(HashMap::new()),
        Err(e) => return Err(ProviderError::config_store(ctx, e)),
    };

    let providers: HashMap<String, ProviderRecord> = serde_json::from_value(value)
        .map_err(|source| ProviderError::json_deserialize(ctx, source))?;
    Ok(providers)
}

/// Loads the persisted provider check snapshot.
///
/// 读取持久化的供应商检查快照。
pub(in crate::core::bot::services::settings::provider) fn load_provider_check_snapshot(
    app: &AppHandle,
    ctx: &ProviderExecutionContext,
) -> Result<ProviderCheckSnapshot, ProviderError> {
    let providers = load_all_providers(app, ctx)?;
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

/// Loads one saved provider record.
///
/// 读取单个已保存的供应商配置。
pub(in crate::core::bot::services::settings::provider) fn load_provider_record(
    app: &AppHandle,
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let mut providers = load_all_providers(app, ctx)?;
    Ok(providers.remove(provider_id.as_str()))
}
