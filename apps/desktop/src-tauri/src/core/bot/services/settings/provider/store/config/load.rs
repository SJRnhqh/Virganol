// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/config/load.rs
use tauri::AppHandle;

use super::super::super::super::super::super::{ProviderError, ProviderId, ProviderRecord};
use super::super::load_all_providers;

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
