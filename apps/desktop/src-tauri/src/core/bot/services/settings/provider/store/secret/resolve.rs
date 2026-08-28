// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/resolve.rs
use super::super::super::super::super::super::super::AppLogger;
use super::super::super::super::super::super::{
    ProviderExecutionContext, ProviderId,
    ProviderKeySource::{Env, Keyring},
    ProviderResolvedKey,
};
use super::{load_provider_env, load_provider_key};

/// Resolves a provider API key from environment variables or keyring.
///
/// 按环境变量优先、系统密钥库兜底的顺序解析供应商 API 密钥。
pub(in crate::core::bot::services::settings::provider) fn resolve_provider_key(
    logger: &AppLogger,
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
) -> ProviderResolvedKey {
    if let Some(key) = load_provider_env(provider_id) {
        return ProviderResolvedKey::available(key, Env);
    }

    if let Some(key) = load_provider_key(logger, ctx, provider_id) {
        return ProviderResolvedKey::available(key, Keyring);
    }

    ProviderResolvedKey::unavailable()
}
