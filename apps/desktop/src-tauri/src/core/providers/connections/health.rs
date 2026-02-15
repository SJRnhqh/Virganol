use crate::core::models::settings::HealthCheckResponse;

use super::{deepseek, ollama};

/// connections 层统一健康检查入口
pub async fn health_check(provider_id: &str, url: &str, key: &str) -> HealthCheckResponse {
    match provider_id {
        "ollama" => ollama::check(url).await,
        "deepseek" => deepseek::check(url, key).await,
        other => HealthCheckResponse::fail(format!("Unknown provider: {}", other)),
    }
}
