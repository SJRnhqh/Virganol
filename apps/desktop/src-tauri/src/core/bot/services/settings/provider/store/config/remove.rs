// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/remove.rs
use serde_json::to_value;
use tauri::AppHandle;

use super::super::super::super::super::super::super::{AppLogger, Downgrade};
use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, ProviderRecord, ProviderState,
    SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::save_settings;
use super::load_all_providers;

/// Removes persisted configuration for a provider and returns the deleted record.
///
/// 删除指定供应商的持久化配置，并返回已删除记录。
pub(in crate::core::bot::services::settings::provider) fn remove_provider(
    app: &AppHandle,
    logger: &AppLogger,
    provider_state: &ProviderState,
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let _guard = provider_state.lock_store();
    let mut providers = load_all_providers(app, ctx)?;
    let previous = match providers.remove(provider_id.as_str()) {
        Some(record) => record,
        None => {
            ProviderError::config_not_found(ctx).downgrade(logger);
            return Ok(None);
        }
    };

    let value =
        to_value(&providers).map_err(|source| ProviderError::json_serialize(ctx, source))?;
    if let Err(e) = {
        let ctx = ctx.for_settings_storage();
        save_settings(app, &ctx, SPIRIT_PROVIDERS_KEY, value)
    } {
        return Err(ProviderError::config_store(ctx, e));
    }
    Ok(Some(previous))
}
