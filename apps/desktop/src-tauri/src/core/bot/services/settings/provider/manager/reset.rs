// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/reset.rs
use log::{error, info};
use tauri::AppHandle;

use super::super::super::super::super::{
    ProviderState, ResetProviderRequest, ResetProviderResponse,
};
use super::super::{remove_provider, remove_provider_key, save_provider};

/// Resets provider configuration.
///
/// 重置 provider 的持久化配置。
pub(crate) fn reset_provider_config(
    app: &AppHandle,
    provider_state: &ProviderState,
    request: ResetProviderRequest,
) -> ResetProviderResponse {
    let ResetProviderRequest { provider_id, .. } = request;

    let previous = match remove_provider(app, provider_state, provider_id) {
        Ok(removed) => removed,
        Err(e) => return ResetProviderResponse::failure(e.message()),
    };

    if previous.is_none() {
        if let Err(e) = remove_provider_key(provider_id) {
            return ResetProviderResponse::failure(e.message());
        }
        return ResetProviderResponse::success();
    }

    let (key_removed, key_error) = match remove_provider_key(provider_id) {
        Ok(()) => (true, None),
        Err(e) => (false, Some(e.message())),
    };

    if previous.is_some() && !key_removed {
        let mut final_error = key_error;

        if let Some(record) = previous.as_ref() {
            if let Err(e) = save_provider(app, provider_id, record) {
                error!(
                    "[Tauri] ❌ {} config rollback failed after key remove error: {}",
                    provider_id,
                    e.message()
                );
                final_error = Some(format!(
                    "Reset failed with inconsistent state: key removal failed and config rollback also failed ({})",
                    e.message()
                ));
            } else {
                info!("[Tauri] ↩️ {} config rollback completed", provider_id);
            }
        }

        return ResetProviderResponse::failure(final_error.unwrap_or_default());
    }

    ResetProviderResponse::success()
}
