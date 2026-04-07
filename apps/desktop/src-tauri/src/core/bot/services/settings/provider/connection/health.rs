// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/health.rs
// 内部引用
use super::get_driver;
use crate::core::bot::models::{HealthCheckResponse, ProviderId};

/// Unified health check entry point for the connection layer.
///
/// connection 层统一健康检查入口，根据 provider ID 路由到对应 driver 实现。
pub(crate) async fn health_check(
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    let Some(driver) = get_driver(provider_id) else {
        return HealthCheckResponse::fail(format!("Driver not registered: {}", provider_id));
    };
    driver.health_check(url, key).await
}
