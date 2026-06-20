// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/ollama.rs
use log::{debug, error, info};

use super::super::super::super::super::{
    HealthCheckResult, ProviderError, ProviderId, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
};
use super::get_http_client;

/// Checks Ollama by requesting `{url}/api/tags` and adding bearer auth only when `key` is present.
///
/// 通过请求 `{url}/api/tags` 检查 Ollama，并仅在 `key` 非空时附带 bearer 认证。
pub(super) async fn ollama_check(
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResult {
    if url.is_empty() {
        return HealthCheckResult::fail(ProviderError::HealthCheckMissingConfig { provider_id });
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
        Ok(r) => r,
        Err(e) => {
            error!("[Tauri][Ollama] request failed: {}", e);
            return HealthCheckResult::fail(ProviderError::HealthCheckNetwork {
                provider_id,
                source: e,
            });
        }
    };

    if !resp.status().is_success() {
        let status = resp.status();
        error!("[Tauri][Ollama] HTTP {}", status);
        return HealthCheckResult::fail(ProviderError::HealthCheckHttp { provider_id });
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            error!("[Tauri][Ollama] JSON parse error: {}", e);
            return HealthCheckResult::fail(ProviderError::HealthCheckResponseFormat {
                provider_id,
                source: e,
            });
        }
    };

    debug!("[Tauri][Ollama] response: {}", json);

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
        info!("[Tauri][Ollama] ⚠️ no models returned");
        return HealthCheckResult::ok(vec![]);
    }

    info!("[Tauri][Ollama] ✅ {} models found", models.len());
    HealthCheckResult::ok(models)
}
