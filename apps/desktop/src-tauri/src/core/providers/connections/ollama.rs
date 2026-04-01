// apps/desktop/scr-tauri/src/core/providers/connections/ollama.rs
// 外部依赖
use log::{debug, error, info};

// 内部引用
use crate::core::bot::models::provider::HealthCheckResponse;

/// Ollama 健康检查：GET {url}/api/tags → 解析模型列表
/// `key` 为可选，非空时附带 Bearer 认证头，空字符串时直接忽略
pub(crate) async fn ollama_check(url: &str, key: &str) -> HealthCheckResponse {
    if url.trim().is_empty() {
        return HealthCheckResponse::fail("Missing URL");
    }

    let base = url.trim().trim_end_matches('/');
    let endpoint = format!("{}/api/tags", base);
    info!("[Tauri][Ollama] → {}", endpoint);

    // 每次调用新建 Client；provider 数量少时影响有限，规模扩展后可提升为 OnceLock<Client> 复用连接池。
    let mut request = reqwest::Client::new()
        .get(&endpoint)
        .timeout(std::time::Duration::from_secs(5));
    if !key.trim().is_empty() {
        request = request.bearer_auth(key.trim());
    }

    let resp = match request.send().await {
        Ok(r) => r,
        Err(e) => {
            error!("[Tauri][Ollama] request failed: {}", e);
            return HealthCheckResponse::fail(format!("Connection failed: {}", e));
        }
    };

    if !resp.status().is_success() {
        let msg = format!("HTTP {}", resp.status());
        error!("[Tauri][Ollama] {}", msg);
        return HealthCheckResponse::fail(msg);
    }

    let json: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            error!("[Tauri][Ollama] JSON parse error: {}", e);
            return HealthCheckResponse::fail(format!("Invalid response: {}", e));
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
        return HealthCheckResponse::fail("No models available");
    }

    info!("[Tauri][Ollama] ✅ {} models found", models.len());
    HealthCheckResponse::ok(models)
}
