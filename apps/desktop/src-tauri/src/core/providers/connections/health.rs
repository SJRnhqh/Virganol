use crate::core::models::provider::ProviderId;
use crate::core::models::settings::HealthCheckResponse;
use crate::core::providers::registry;

/// connections 层统一健康检查入口
pub async fn health_check(provider_id: ProviderId, url: &str, key: &str) -> HealthCheckResponse {
    let Some(driver) = registry::get_driver(provider_id) else {
        return HealthCheckResponse::fail(format!("Driver not registered: {}", provider_id));
    };
    driver.health_check(url, key).await
}
