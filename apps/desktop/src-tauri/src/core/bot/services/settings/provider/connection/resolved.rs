// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/resolved.rs
use super::super::super::super::super::{
    HealthCheckResult, ProviderExecutionContext, ProviderId, ProviderKeyMeta,
};
use super::super::resolve_provider_key;
use super::health_check;

/// Runs a health check with the resolved provider key and source metadata.
///
/// 使用已解析的 Provider key 执行健康检查，并返回 key 来源元信息。
pub(in crate::core::bot::services::settings::provider) async fn health_check_with_resolved_key(
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
    url: &str,
) -> (HealthCheckResult, ProviderKeyMeta) {
    let key_resolution = {
        let ctx = ctx.for_secret_store();
        resolve_provider_key(&ctx, provider_id)
    };

    let response = {
        let key = key_resolution.key().map(|k| k.as_str()).unwrap_or("");
        health_check(provider_id, url, key).await
    };
    (response, key_resolution.into_meta())
}
