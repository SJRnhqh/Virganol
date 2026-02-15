use log::{debug, error, info};

use crate::core::models::settings::HealthCheckResponse;

/// Ollama 健康检查：GET {url}/api/tags → 解析模型列表
pub async fn check(url: &str) -> HealthCheckResponse {
    let base = url.trim().trim_end_matches('/');
    let endpoint = format!("{}/api/tags", base);
    info!("[HealthCheck][Ollama] → {}", endpoint);

    let resp = match reqwest::Client::new()
        .get(&endpoint)
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            error!("[HealthCheck][Ollama] request failed: {}", e);
            return HealthCheckResponse::fail(format!("Connection failed: {}", e));
        }
    };

    if !resp.status().is_success() {
        let msg = format!("HTTP {}", resp.status());
        error!("[HealthCheck][Ollama] {}", msg);
        return HealthCheckResponse::fail(msg);
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            error!("[HealthCheck][Ollama] JSON parse error: {}", e);
            return HealthCheckResponse::fail(format!("Invalid response: {}", e));
        }
    };

    debug!("[HealthCheck][Ollama] response: {}", json);

    let models: Vec<String> = json
        .get("models")
        .and_then(|m| m.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|item| item.get("name").and_then(|n| n.as_str()))
                .map(|s| s.to_string())
                .collect()
        })
        .unwrap_or_default();

    if models.is_empty() {
        return HealthCheckResponse::fail("No models available");
    }

    info!("[HealthCheck][Ollama] ✅ {} models found", models.len());
    HealthCheckResponse::ok(models)
}
