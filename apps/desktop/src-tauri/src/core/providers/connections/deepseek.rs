use log::{debug, error, info};

use crate::core::models::settings::HealthCheckResponse;

/// DeepSeek 健康检查：GET {url}/v1/models + Bearer token → 解析模型列表
pub async fn check(url: &str, key: &str) -> HealthCheckResponse {
    if key.trim().is_empty() {
        return HealthCheckResponse::fail("Missing API key");
    }

    let base = url.trim().trim_end_matches('/');
    let endpoint = format!("{}/v1/models", base);
    info!("[HealthCheck][DeepSeek] → {}", endpoint);

    let resp = match reqwest::Client::new()
        .get(&endpoint)
        .bearer_auth(key.trim())
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            error!("[HealthCheck][DeepSeek] request failed: {}", e);
            return HealthCheckResponse::fail(format!("Connection failed: {}", e));
        }
    };

    if !resp.status().is_success() {
        let msg = format!("HTTP {}", resp.status());
        error!("[HealthCheck][DeepSeek] {}", msg);
        return HealthCheckResponse::fail(msg);
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            error!("[HealthCheck][DeepSeek] JSON parse error: {}", e);
            return HealthCheckResponse::fail(format!("Invalid response: {}", e));
        }
    };

    debug!("[HealthCheck][DeepSeek] response: {}", json);

    // OpenAI-compatible: { "data": [{ "id": "model-name" }] }
    let models: Vec<String> = json
        .get("data")
        .and_then(|d| d.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|item| item.get("id").and_then(|id| id.as_str()))
                .map(|s| s.to_string())
                .collect()
        })
        .unwrap_or_default();

    if models.is_empty() {
        return HealthCheckResponse::fail("No models available");
    }

    info!("[HealthCheck][DeepSeek] ✅ {} models found", models.len());
    HealthCheckResponse::ok(models)
}
