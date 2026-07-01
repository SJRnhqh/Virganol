// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/ollama.rs
use log::{debug, error, info};

use super::super::super::super::super::{
    HealthCheckResult, ProviderError, ProviderExecutionContext, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
};
use super::get_http_client;

/// Checks Ollama by requesting `{url}/api/tags` and adding bearer auth only when `key` is present.
///
/// 通过请求 `{url}/api/tags` 检查 Ollama，并在密钥非空时附带认证。
pub(super) async fn ollama_check(
    ctx: &ProviderExecutionContext,
    url: &str,
    key: &str,
) -> HealthCheckResult {
    if url.is_empty() {
        return HealthCheckResult::fail(ProviderError::health_check_missing_config(ctx));
    }

    let base = url.trim_end_matches('/');
    let endpoint = format!("{}/api/tags", base);
    info!("[Tauri][Ollama] → {}", endpoint);

    let mut request = get_http_client()
        .get(&endpoint)
        .timeout(std::time::Duration::from_secs(
            OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
        ));
    if !key.is_empty() {
        request = request.bearer_auth(key);
    }

    let resp = match request.send().await {
        Ok(resp) => resp,
        Err(source) => {
            error!("[Tauri][Ollama] request failed: {}", source);
            return HealthCheckResult::fail(ProviderError::health_check_network(ctx, source));
        }
    };

    if !resp.status().is_success() {
        let status = resp.status();
        error!("[Tauri][Ollama] HTTP {}", status);
        return HealthCheckResult::fail(ProviderError::health_check_http(ctx));
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(source) => {
            error!("[Tauri][Ollama] JSON parse error: {}", source);
            return HealthCheckResult::fail(ProviderError::health_check_response_format(
                ctx, source,
            ));
        }
    };

    debug!("[Tauri][Ollama] response: {}", json);

    let models: Vec<String> = json
        .get("models")
        .and_then(|models| models.as_array())
        .map(|items| {
            items
                .iter()
                .filter_map(|item| item.get("name").and_then(|name| name.as_str()))
                .map(|model| model.to_string())
                .collect()
        })
        .unwrap_or_default();

    if models.is_empty() {
        info!("[Tauri][Ollama] ⚠️ no models returned");
        return HealthCheckResult::ok(vec![]);
    }

    info!("[Tauri][Ollama] ✅ {} models found", models.len());
    HealthCheckResult::ok(models)
}
