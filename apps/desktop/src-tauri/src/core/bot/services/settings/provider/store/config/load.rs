// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/load.rs
use serde_json::from_value;
use std::collections::HashMap;
use tauri::AppHandle;

use super::super::super::super::super::super::super::{AppLogger, Downgrade};
use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, ProviderRecord,
    ProviderSubject::Candidate, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::load_settings;

/// Loads persisted providers that support health checks.
///
/// 读取支持健康检查的持久化供应商。
pub(in crate::core::bot::services::settings::provider) fn load_checkable_providers(
    app: &AppHandle,
    logger: &AppLogger,
    ctx: &ProviderExecutionContext,
) -> Result<Vec<(ProviderId, ProviderRecord)>, ProviderError> {
    let providers = load_all_providers(app, ctx)?;
    let mut supported = Vec::new();

    for (raw_id, record) in providers {
        let ctx = ctx.for_subject(Candidate(raw_id.clone()));
        match ProviderId::parse(raw_id.as_str()) {
            Some(provider_id) => supported.push((provider_id, record)),
            None => ProviderError::unsupported_provider(&ctx).downgrade(logger),
        }
    }

    Ok(supported)
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

    let providers: HashMap<String, ProviderRecord> =
        from_value(value).map_err(|source| ProviderError::json_deserialize(ctx, source))?;
    Ok(providers)
}
