use crate::core::models::provider::ProviderId;
use crate::core::models::settings::HealthCheckResponse;

use super::{deepseek, ollama};

/// connections 层统一健康检查入口
pub async fn health_check(provider_id: ProviderId, url: &str, key: &str) -> HealthCheckResponse {
    match provider_id {
        ProviderId::Ollama => ollama::ollama_check(url, key).await,
        ProviderId::Deepseek => deepseek::deepseek_check(key).await,
    }
}
