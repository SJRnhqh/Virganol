// apps/desktop/src-tauri/src/core/settings/provider.rs

use log::{error, info};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use super::secrets;
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};
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

/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub async fn connect_and_save(
    app: &AppHandle,
    provider_id: &str,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    let normalized_key = key.trim();
    let fallback_key = if normalized_key.is_empty() {
        secrets::load_provider_key_from_env(provider_id)
            .or_else(|| secrets::load_provider_key(provider_id))
    } else {
        None
    };
    let key_for_check = fallback_key
        .as_ref()
        .map(|resolved| resolved.as_str())
        .unwrap_or(normalized_key);
    let result = health::health_check(provider_id, url, key_for_check).await;

    if result.success {
        if !normalized_key.is_empty() {
            if let Err(error_msg) = secrets::save_provider_key(provider_id, key_for_check) {
                error!("[Tauri] {} key persist failed: {}", provider_id, error_msg);
                return HealthCheckResponse::fail("Failed to persist provider key");
            }
        } else {
            info!(
                "[Tauri] {} skip key persist: using env or existing key",
                provider_id
            );
        }

        let mut providers = load_all_providers(app);
        let previous_record = providers.remove(provider_id);
        let next_enabled_models = match previous_record {
            Some(record) => {
                let available_set: std::collections::HashSet<&str> =
                    result.available_models.iter().map(|s| s.as_str()).collect();
                record
                    .enabled_models
                    .into_iter()
                    .filter(|model| available_set.contains(model.as_str()))
                    .collect()
            }
            None => result.available_models.clone(),
        };

        // 健康检查通过，持久化写入配置
        let trimmed_url = url.trim();
        let record = ProviderRecord {
            url: if trimmed_url.is_empty() {
                None
            } else {
                Some(trimmed_url.to_string())
            },
            enabled_models: next_enabled_models,
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
    let key_removed = match secrets::remove_provider_key(provider_id) {
        Ok(()) => true,
        Err(error_msg) => {
            error!("[Tauri] {} key remove failed: {}", provider_id, error_msg);
            false
        }
    };

    if existed {
        if let Ok(store) = app.store(STORE_FILE) {
            store.set(
                STORE_KEY_SPIRIT_PROVIDERS,
                serde_json::to_value(&providers).unwrap_or_default(),
            );
        }
    }

    existed && key_removed
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
            info!("[Tauri] {} enabled_models updated", provider_id);
            true
        }
        None => {
            error!("[Tauri] {} not found, cannot update models", provider_id);
            false
        }
    }
}
