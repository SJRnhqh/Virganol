// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/resolver.rs
// 内部引用
use crate::core::models::providers::id::ProviderId;
use crate::core::models::security::{ProviderKeySource, ProviderSecretMeta};
use crate::core::models::settings::HealthCheckResponse;
use crate::core::providers::connections::health;
use crate::core::settings::secrets;

/// 读取可用密钥并执行健康检查（env 优先，其次 keyring）
pub(super) async fn health_check_with_resolved_key(
    provider_id: ProviderId,
    url: &str,
) -> HealthCheckResponse {
    let api_key = secrets::load_provider_key_from_env(provider_id)
        .or_else(|| secrets::load_provider_key(provider_id));
    let key = api_key.as_ref().map(|key| key.as_str()).unwrap_or("");
    health::health_check(provider_id, url, key).await
}

/// 解析密钥来源元信息（去敏）
pub(super) fn resolve_provider_secret_meta(provider_id: ProviderId) -> ProviderSecretMeta {
    if secrets::load_provider_key_from_env(provider_id).is_some() {
        return ProviderSecretMeta::with_source(ProviderKeySource::Env);
    }
    if secrets::load_provider_key(provider_id).is_some() {
        return ProviderSecretMeta::with_source(ProviderKeySource::Keyring);
    }
    ProviderSecretMeta::none()
}
