use crate::core::bot::models::provider::connection::HealthCheckResponse;
use crate::core::bot::models::provider::ProviderId;
use crate::core::providers::registry;

/// connections 层统一健康检查入口
pub(crate) async fn health_check(
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    let Some(driver) = registry::get_driver(provider_id) else {
        return HealthCheckResponse::fail(format!("Driver not registered: {}", provider_id));
    };
    driver.health_check(url, key).await
}
