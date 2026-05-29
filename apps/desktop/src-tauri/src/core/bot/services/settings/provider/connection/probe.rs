// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/probe.rs
use super::super::super::super::super::{HealthCheckResult, ProviderId};
use super::super::resolve_provider_key;
use super::health_check;

/// Probes a single provider's connection with automatic credential fallback (env → keyring).
///
/// 探测单个 Provider 的连接状态，自动回退凭据（环境变量 → keyring）。
pub(crate) async fn probe_provider_connection(
    provider_id: ProviderId,
    normalized_url: &str,
    normalized_key: &str,
) -> HealthCheckResult {
    let fallback_key = normalized_key
        .is_empty()
        .then(|| resolve_provider_key(provider_id));

    health_check(
        provider_id,
        normalized_url,
        fallback_key
            .as_ref()
            .and_then(|resolution| resolution.key())
            .map(|key| key.as_str())
            .unwrap_or(normalized_key),
    )
    .await
}
