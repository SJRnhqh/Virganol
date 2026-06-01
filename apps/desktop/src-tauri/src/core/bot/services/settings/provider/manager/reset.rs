// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/reset.rs
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{ResetProviderRequest, ResetProviderResponse};
use super::super::{remove_provider, remove_provider_key, save_provider};

/// Resets provider configuration.
///
/// 重置 provider 的持久化配置。
pub(crate) fn reset_provider_config(
    app: &AppHandle,
    state: &AppState,
    request: ResetProviderRequest,
) -> ResetProviderResponse {
    let provider_id = request.into_provider_id();
    let provider_state = state.provider();

    let previous = match remove_provider(app, provider_state, provider_id) {
        Ok(removed) => removed,
        Err(e) => return ResetProviderResponse::failure(e.message()),
    };

    if let Err(e) = remove_provider_key(provider_id) {
        if let Some(record) = previous {
            if let Err(re) = save_provider(app, provider_state, provider_id, record) {
                return ResetProviderResponse::failure(format!(
                    "{}, {}",
                    e.message(),
                    re.message()
                ));
            }
        }
        return ResetProviderResponse::failure(e.message());
    }

    ResetProviderResponse::success()
}
