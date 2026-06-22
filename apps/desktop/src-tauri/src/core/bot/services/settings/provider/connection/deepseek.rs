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
        Ok(resp) => resp,
        Err(source) => {
            error!("[Tauri][DeepSeek] request failed: {}", source);
            return HealthCheckResult::fail(ProviderError::HealthCheckNetwork {
                provider_id,
                source,
            });
        }
    };

    if !resp.status().is_success() {
        let status = resp.status();
        error!("[Tauri][DeepSeek] HTTP {}", status);
        return HealthCheckResult::fail(ProviderError::HealthCheckHttp { provider_id });
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(source) => {
            error!("[Tauri][DeepSeek] JSON parse error: {}", source);
            return HealthCheckResult::fail(ProviderError::HealthCheckResponseFormat {
                provider_id,
                source,
            });
        }
    };

    debug!("[Tauri][DeepSeek] response: {}", json);

    // OpenAI-compatible: { "data": [{ "id": "model-name" }] }
    let models: Vec<String> = json
        .get("data")
        .and_then(|data| data.as_array())
        .map(|items| {
            items
                .iter()
                .filter_map(|item| item.get("id").and_then(|id| id.as_str()))
                .map(|model| model.to_string())
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
