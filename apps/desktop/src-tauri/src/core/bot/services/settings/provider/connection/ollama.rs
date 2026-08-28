// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/ollama.rs
use serde_json::Value;
use std::time::Duration;

use super::super::super::super::super::{
    HealthCheckResult, ProviderError, ProviderExecutionContext, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
};
use super::get_http_client;

/// Checks Ollama by requesting `{url}/api/tags` and adding bearer auth only when `key` is present.
///
/// 通过标签接口检查 Ollama，并在密钥非空时附带认证。
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
    let mut request = get_http_client()
        .get(&endpoint)
        .timeout(Duration::from_secs(OLLAMA_HEALTH_CHECK_TIMEOUT_SECS));
    if !key.is_empty() {
        request = request.bearer_auth(key);
    }

    let resp = match request.send().await {
        Ok(resp) => resp,
        Err(source) => {
            return HealthCheckResult::fail(ProviderError::health_check_network(ctx, source))
        }
    };

    if !resp.status().is_success() {
        return HealthCheckResult::fail(ProviderError::health_check_http(ctx));
    }

    let json: Value = match resp.json().await {
        Ok(v) => v,
        Err(source) => {
            return HealthCheckResult::fail(ProviderError::health_check_response_format(
                ctx, source,
            ));
        }
    };

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
        return HealthCheckResult::ok(vec![]);
    }

    HealthCheckResult::ok(models)
}
