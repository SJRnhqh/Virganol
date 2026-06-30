// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/remove.rs
use tauri::AppHandle;

use super::super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, ProviderRecord, ProviderState,
    SPIRIT_PROVIDERS_KEY,
};
use super::super::super::super::save_settings;
use super::load_all_providers;

/// Removes a provider configuration and returns the deleted record for rollback.
///
/// 删除 provider 配置，返回被删除的记录用于回滚。
pub(in crate::core::bot::services::settings::provider) fn remove_provider(
    app: &AppHandle,
    provider_state: &ProviderState,
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let _guard = provider_state.lock_store();
    let mut providers = load_all_providers(app, ctx, Some(provider_id))?;
    let previous = providers.remove(provider_id.as_str());

    if previous.is_none() {
        ProviderError::config_not_found(ctx.error_context()).downgrade();
        return Ok(None);
    }

    let value = serde_json::to_value(&providers)
        .map_err(|source| ProviderError::json_serialize(ctx.error_context(), source))?;
    if let Err(e) = {
        let ctx = ctx.for_settings_storage();
        save_settings(app, &ctx, SPIRIT_PROVIDERS_KEY, value, provider_id)
    } {
        return Err(ProviderError::config_store(ctx.error_context(), e));
    }
    Ok(previous)
}
