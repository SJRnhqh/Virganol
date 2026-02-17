// apps/desktop/src-tauri/src/commands/settings.rs
// 外部依赖
use tauri::AppHandle;

// 内部引用
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::{ConnectAndSaveProviderRequest, HealthCheckResponse};
use crate::core::settings::bot::providers::service::{
    connect_and_save, reset_provider_config, startup_check_providers,
    update_provider_enabled_models,
};

/// 前端 ready 后调用：触发后端检查所有已持久化的 Provider 并推送状态到前端
#[tauri::command]
pub async fn trigger_providers_startup_check(app: AppHandle) {
    startup_check_providers(app).await;
}

/// 前端点击"连接"时调用：健康检查 + 成功则持久化
#[tauri::command]
pub async fn connect_and_save_provider(
    app: AppHandle,
    payload: ConnectAndSaveProviderRequest,
) -> HealthCheckResponse {
    let url = payload.url.as_deref().unwrap_or("");
    let raw_id = payload.provider_id.trim();

    let provider_id = match ProviderId::try_from(raw_id) {
        Ok(id) => id,
        Err(_) => return HealthCheckResponse::fail(format!("Unknown provider: {}", raw_id)),
    };

    connect_and_save(&app, provider_id, url, &payload.key).await
}

/// 前端点击删除时调用：移除一个 Provider 配置
#[tauri::command]
pub async fn reset_provider(app: AppHandle, provider_id: String) -> bool {
    reset_provider_config(&app, &provider_id)
}

/// 前端勾选模型后调用：更新 enabled_models
#[tauri::command]
pub async fn update_enabled_models(
    app: AppHandle,
    provider_id: String,
    enabled_models: Vec<String>,
) -> bool {
    update_provider_enabled_models(&app, &provider_id, enabled_models)
}
