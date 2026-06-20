// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/health.rs
use super::super::super::super::super::{HealthCheckResult, ProviderError, ProviderId};
use super::get_driver;

/// Unified health check entry point for the connection layer.
///
/// connection 层统一健康检查入口，根据 provider ID 路由到对应 driver 实现。
pub(super) async fn health_check(
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResult {
    let Some(driver) = get_driver(provider_id) else {
        return HealthCheckResult::fail(ProviderError::UnsupportedProvider {
            raw_provider_id: provider_id.to_string(),
        });
    };
    driver.health_check(url, key).await
}
