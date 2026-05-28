// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/resolved.rs
use super::super::super::super::super::models::{
    HealthCheckResult, ProviderId, ProviderSecretMeta,
};
use super::super::resolve_provider_key;
use super::health_check;

/// Runs a health check with the resolved provider key and source metadata.
///
/// 使用已解析的 Provider key 执行健康检查，并返回 key 来源元信息。
pub(crate) async fn health_check_with_resolved_key(
    provider_id: ProviderId,
    url: &str,
) -> (HealthCheckResult, ProviderSecretMeta) {
    let key_resolution = resolve_provider_key(provider_id);

    let response = {
        let key = key_resolution.key().map(|k| k.as_str()).unwrap_or("");
        health_check(provider_id, url, key).await
    };
    (response, key_resolution.into_meta())
}
