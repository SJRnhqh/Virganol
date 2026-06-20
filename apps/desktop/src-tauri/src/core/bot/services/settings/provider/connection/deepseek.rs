// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/deepseek.rs
use log::{debug, error, info};

use super::super::super::super::super::{
    HealthCheckResult, ProviderError, ProviderId, DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS,
};
use super::get_http_client;

const DEEPSEEK_BASE_URL: &str = "https://api.deepseek.com";

/// Checks DeepSeek by requesting `{base_url}/v1/models` with bearer authentication.
///
/// 通过 bearer 认证请求 `{base_url}/v1/models` 检查 DeepSeek，并解析模型列表。
pub(super) async fn deepseek_check(provider_id: ProviderId, key: &str) -> HealthCheckResult {
    if key.is_empty() {
        return HealthCheckResult::fail(ProviderError::HealthCheckMissingConfig { provider_id });
    }

    let endpoint = format!("{}/v1/models", DEEPSEEK_BASE_URL);
    info!("[Tauri][DeepSeek] → {}", endpoint);

    let resp = match get_http_client()
        .get(&endpoint)
        .bearer_auth(key)
        .timeout(std::time::Duration::from_secs(
            DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS,
        ))
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            error!("[Tauri][DeepSeek] request failed: {}", e);
            return HealthCheckResult::fail(ProviderError::HealthCheckNetwork(format!(
                "Connection failed: {}",
                e
            )));
        }
    };

    if !resp.status().is_success() {
        let msg = format!("HTTP {}", resp.status());
        error!("[Tauri][DeepSeek] {}", msg);
        return HealthCheckResult::fail(ProviderError::HealthCheckHttp(msg));
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            error!("[Tauri][DeepSeek] JSON parse error: {}", e);
            return HealthCheckResult::fail(ProviderError::HealthCheckResponseFormat(format!(
                "Invalid response: {}",
                e
            )));
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
        info!("[Tauri][DeepSeek] ⚠️ no models returned");
        return HealthCheckResult::ok(vec![]);
    }

    info!("[Tauri][DeepSeek] ✅ {} models found", models.len());
    HealthCheckResult::ok(models)
}
