// apps/desktop/src-tauri/src/core/settings/provider.rs

use tauri::AppHandle;
use tauri_plugin_store::StoreExt;
use log::{debug, error, info};

use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};

const STORE_FILE: &str = "settings.json";
const STORE_KEY_SPIRIT_PROVIDERS: &str = "spirit.providers";

/// 读取所有已保存的 providers
/// 返回 HashMap<provider_id_string, ProviderRecord>
pub fn load_all(app: &AppHandle) -> std::collections::HashMap<String, ProviderRecord> {
    let store = match app.store(STORE_FILE) {
        Ok(s) => s,
        Err(_) => return std::collections::HashMap::new(),
    };

    match store.get(STORE_KEY_SPIRIT_PROVIDERS) {
        Some(value) => {
            serde_json::from_value(value.clone()).unwrap_or_default()
        }
        None => std::collections::HashMap::new(),
    }
}

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
pub fn save(app: &AppHandle, provider_id: &str, record: &ProviderRecord) {
    let mut providers = load_all(app);
    providers.insert(provider_id.to_string(), record.clone());

    if let Ok(store) = app.store(STORE_FILE) {
        store.set(
            STORE_KEY_SPIRIT_PROVIDERS,
            serde_json::to_value(&providers).unwrap_or_default(),
        );
    }
}

/// 删除单个 provider 的配置
pub fn remove(app: &AppHandle, provider_id: &str) -> bool {
    let mut providers = load_all(app);
    let existed = providers.remove(provider_id).is_some();

    if existed {
        if let Ok(store) = app.store(STORE_FILE) {
            store.set(
                STORE_KEY_SPIRIT_PROVIDERS,
                serde_json::to_value(&providers).unwrap_or_default(),
            );
        }
    }

    existed
}

/// 健康检查：用 url + key 探测 provider 是否可用，返回可用模型列表
pub async fn health_check(provider_id: &str, url: &str, key: &str) -> HealthCheckResponse {
    match provider_id {
        "ollama" => check_ollama(url).await,
        "deepseek" => check_deepseek(url, key).await,
        other => HealthCheckResponse::fail(format!("Unknown provider: {}", other)),
    }
}

/// Ollama 健康检查：GET {url}/api/tags → 解析模型列表
async fn check_ollama(url: &str) -> HealthCheckResponse {
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

/// DeepSeek 健康检查：GET {url}/v1/models + Bearer token → 解析模型列表
async fn check_deepseek(url: &str, key: &str) -> HealthCheckResponse {
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

/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub async fn connect_and_save(
    app: &AppHandle,
    provider_id: &str,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    let result = health_check(provider_id, url, key).await;

    if result.success {
        // 健康检查通过，持久化写入（enabled_models 初始为空，用户稍后勾选）
        let record = ProviderRecord {
            url: url.trim().trim_end_matches('/').to_string(),
            key: key.to_string(),
            enabled_models: vec![],
        };
        save(app, provider_id, &record);
        info!("[Provider] {} saved to store", provider_id);
    }

    result
}

/// 更新某个 provider 的 enabled_models
/// 返回 true 表示更新成功，false 表示该 provider 不存在
pub fn update_models(
    app: &AppHandle,
    provider_id: &str,
    enabled_models: Vec<String>,
) -> bool {
    let mut providers = load_all(app);

    match providers.get_mut(provider_id) {
        Some(record) => {
            record.enabled_models = enabled_models;
            // 重新保存整个 map
            if let Ok(store) = app.store(STORE_FILE) {
                store.set(
                    STORE_KEY_SPIRIT_PROVIDERS,
                    serde_json::to_value(&providers).unwrap_or_default(),
                );
            }
            info!("[Provider] {} enabled_models updated", provider_id);
            true
        }
        None => {
            error!("[Provider] {} not found, cannot update models", provider_id);
            false
        }
    }
}