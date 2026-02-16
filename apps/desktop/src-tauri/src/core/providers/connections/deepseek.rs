// apps/desktop/src-tauri/src/core/providers/connections/deepseek.rs
// 外部依赖
use log::{debug, error, info};

// 内部引用
use crate::core::models::settings::HealthCheckResponse;

const DEEPSEEK_BASE_URL: &str = "https://api.deepseek.com";

/// DeepSeek 健康检查：GET {base_url}/v1/models + Bearer token → 解析模型列表
pub async fn deepseek_check(key: &str) -> HealthCheckResponse {
    if key.trim().is_empty() {
        return HealthCheckResponse::fail("Missing API key (input or DEEPSEEK_API_KEY)");
    }

    let base = DEEPSEEK_BASE_URL.trim_end_matches('/');
    let endpoint = format!("{}/v1/models", base);
    info!("[Tauri][DeepSeek] → {}", endpoint);

    let resp = match reqwest::Client::new()
        .get(&endpoint)
        .bearer_auth(key.trim())
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            error!("[Tauri][DeepSeek] request failed: {}", e);
            return HealthCheckResponse::fail(format!("Connection failed: {}", e));
        }
    };

    if !resp.status().is_success() {
        let msg = format!("HTTP {}", resp.status());
        error!("[Tauri][DeepSeek] {}", msg);
        return HealthCheckResponse::fail(msg);
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            error!("[Tauri][DeepSeek] JSON parse error: {}", e);
            return HealthCheckResponse::fail(format!("Invalid response: {}", e));
        }
    };

    debug!("[Tauri][DeepSeek] response: {}", json);

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

    info!("[Tauri][DeepSeek] ✅ {} models found", models.len());
    HealthCheckResponse::ok(models)
}
