// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/probe.rs
use super::super::super::super::super::{HealthCheckResponse, ProviderId};
use super::super::{load_provider_env, load_provider_key};
use super::health::health_check;

/// Probes a single provider's connection with automatic credential fallback (env → keyring).
///
/// 探测单个 Provider 的连接状态，自动回退凭据（环境变量 → keyring）。
pub(crate) async fn probe_provider_connection(
    provider_id: ProviderId,
    normalized_url: &str,
    normalized_key: &str,
) -> HealthCheckResponse {
    let fallback_key = normalized_key
        .is_empty()
        .then_some(())
        .and_then(|_| load_provider_env(provider_id).or_else(|| load_provider_key(provider_id)));

    health_check(
        provider_id,
        normalized_url,
        fallback_key
            .as_ref()
            .map(|k| k.as_str())
            .unwrap_or(normalized_key),
    )
    .await
}
