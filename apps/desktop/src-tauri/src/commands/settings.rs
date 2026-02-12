// apps/desktop/src-tauri/src/commands/settings.rs

use std::collections::HashMap;
use tauri::AppHandle;

use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};
use crate::core::settings::provider;

/// 前端启动时调用：加载所有已保存的 Provider 配置
#[tauri::command]
pub async fn load_providers(app: AppHandle) -> HashMap<String, ProviderRecord> {
    provider::load_all(&app)
}

/// 前端点击删除时调用：移除一个 Provider 配置
#[tauri::command]
pub async fn remove_provider(app: AppHandle, provider_id: String) -> bool {
    provider::remove(&app, &provider_id)
}

/// 健康检查：探测指定 provider 是否可用，返回可用模型列表
#[tauri::command]
pub async fn check_provider(provider_id: String, url: String, key: String) -> HealthCheckResponse {
    provider::health_check(&provider_id, &url, &key).await
}

/// 前端点击"连接"时调用：健康检查 + 成功则持久化
#[tauri::command]
pub async fn connect_and_save_provider(
    app: AppHandle,
    provider_id: String,
    url: String,
    key: String,
) -> HealthCheckResponse {
    provider::connect_and_save(&app, &provider_id, &url, &key).await
}

/// 前端勾选模型后调用：更新 enabled_models
#[tauri::command]
pub async fn update_enabled_models(
    app: AppHandle,
    provider_id: String,
    enabled_models: Vec<String>,
) -> bool {
    provider::update_models(&app, &provider_id, enabled_models)
}