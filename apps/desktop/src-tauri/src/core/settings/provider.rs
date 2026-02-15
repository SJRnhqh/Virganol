// apps/desktop/src-tauri/src/core/settings/provider.rs

use log::{error, info};
use tauri::{AppHandle, Emitter};
use tauri_plugin_store::StoreExt;

use super::secrets;
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord, ProviderStatusPayload};
use crate::core::providers::connections::health;

const STORE_FILE: &str = "settings.json";
const STORE_KEY_SPIRIT_PROVIDERS: &str = "spirit.providers";

/// 读取所有已保存的 providers
/// 返回 HashMap<provider_id_string, ProviderRecord>
pub fn load_all_providers(app: &AppHandle) -> std::collections::HashMap<String, ProviderRecord> {
    let store = match app.store(STORE_FILE) {
        Ok(s) => s,
        Err(_) => return std::collections::HashMap::new(),
    };

    match store.get(STORE_KEY_SPIRIT_PROVIDERS) {
        Some(value) => serde_json::from_value(value.clone()).unwrap_or_default(),
        None => std::collections::HashMap::new(),
    }
}

/// 协调 enabled_models：只保留 available_models 中仍然存在的模型
/// 如果有模型被淘汰，自动写回配置文件并返回更新后的 ProviderRecord
/// 如果无变化，直接返回原 record 的克隆
fn reconcile_enabled_models(
    app: &AppHandle,
    provider_id: &str,
    record: &ProviderRecord,
    available_models: &[String],
) -> ProviderRecord {
    let available_set: std::collections::HashSet<&str> =
        available_models.iter().map(|s| s.as_str()).collect();

    // 交集：只保留仍然可用的 enabled 模型
    let new_enabled: Vec<String> = record
        .enabled_models
        .iter()
        .filter(|m| available_set.contains(m.as_str()))
        .cloned()
        .collect();

    if new_enabled.len() != record.enabled_models.len() {
        // 有模型被淘汰了，构造新 record 并写回配置
        let mut updated = record.clone();
        updated.enabled_models = new_enabled;

        save_provider(app, provider_id, &updated);
        info!(
            "[Provider] {} enabled_models reconciled: {} → {}",
            provider_id,
            record.enabled_models.len(),
            updated.enabled_models.len()
        );
        updated
    } else {
        // 无变化，原样返回
        record.clone()
    }
}

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
pub fn save_provider(app: &AppHandle, provider_id: &str, record: &ProviderRecord) {
    let mut providers = load_all_providers(app);
    providers.insert(provider_id.to_string(), record.clone());

    if let Ok(store) = app.store(STORE_FILE) {
        store.set(
            STORE_KEY_SPIRIT_PROVIDERS,
            serde_json::to_value(&providers).unwrap_or_default(),
        );
    }
}

/// Provider 默认 URL（当前端未提供 url 时使用）
fn default_url(provider_id: &str) -> Option<&'static str> {
    match provider_id {
        "deepseek" => Some("https://api.deepseek.com"),
        _ => None,
    }
}

/// 启动检查场景：从 keyring 读取密钥并执行健康检查
async fn health_check_with_stored_key(provider_id: &str, url: &str) -> HealthCheckResponse {
    let api_key = secrets::load_provider_key(provider_id);
    let key = api_key.as_ref().map(|key| key.as_str()).unwrap_or("");
    health::health_check(provider_id, url, key).await
}

/// App 启动时自动执行：加载所有已持久化的 Provider，逐个健康检查，逐个推送给前端
pub async fn startup_check_providers(app: AppHandle) {
    let providers = load_all_providers(&app);

    if providers.is_empty() {
        info!("[Tauri] No persisted providers found");
        return;
    }

    info!("[Tauri] Checking {} provider(s)...", providers.len());

    for (id, record) in &providers {
        let url = record.url.as_deref().unwrap_or("");
        let result = health_check_with_stored_key(id, url).await;

        // 健康检查成功时，协调 enabled_models
        let final_record = if result.success {
            reconcile_enabled_models(&app, id, record, &result.available_models)
        } else {
            record.clone()
        };

        let payload = ProviderStatusPayload {
            provider_id: id.clone(),
            config: final_record,
            health: result,
        };

        if let Err(e) = app.emit("provider-status", &payload) {
            error!("[Tauri] Failed to emit status for {}: {}", id, e);
        } else {
            info!("[Tauri] {} → online: {}", id, payload.health.success);
        }
    }

    info!("[Tauri] Provider check complete");
}

/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub async fn connect_and_save(
    app: &AppHandle,
    provider_id: &str,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    // URL 兜底：前端未传时使用默认值
    let actual_url = if url.trim().is_empty() {
        match default_url(provider_id) {
            Some(default) => default.to_string(),
            None => return HealthCheckResponse::fail("Missing URL"),
        }
    } else {
        url.trim().trim_end_matches('/').to_string()
    };

    let result = health::health_check(provider_id, &actual_url, key).await;

    if result.success {
        // 健康检查通过，持久化写入配置
        let record = ProviderRecord {
            url: actual_url,
            enabled_models: result.available_models.clone(),
        };
        save_provider(app, provider_id, &record);
        info!("[Tauri] {} saved to store", provider_id);
    }

    result
}

/// 重置 provider 的持久化配置
pub fn reset_provider_config(app: &AppHandle, provider_id: &str) -> bool {
    let mut providers = load_all_providers(app);
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

/// 更新某个 provider 的 enabled_models
/// 返回 true 表示更新成功，false 表示该 provider 不存在
pub fn update_models(app: &AppHandle, provider_id: &str, enabled_models: Vec<String>) -> bool {
    let mut providers = load_all_providers(app);

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
