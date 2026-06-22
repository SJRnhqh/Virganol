// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/resolve.rs
use super::super::super::super::super::super::models::{ProviderKeySource, ProviderResolvedKey};
use super::super::super::super::super::super::ProviderId;
use super::{load_provider_env, load_provider_key};

/// Resolves the provider API key using environment variables before keyring.
///
/// 按环境变量优先、keyring 兜底的顺序解析 Provider API key。
pub(in crate::core::bot::services::settings::provider) fn resolve_provider_key(
    provider_id: ProviderId,
) -> ProviderResolvedKey {
    if let Some(key) = load_provider_env(provider_id) {
        return ProviderResolvedKey::available(key, ProviderKeySource::Env);
    }

    if let Some(key) = load_provider_key(provider_id) {
        return ProviderResolvedKey::available(key, ProviderKeySource::Keyring);
    }

    ProviderResolvedKey::unavailable()
}
