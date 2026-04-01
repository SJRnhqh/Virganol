// apps/desktop/src-tauri/src/commands/bot/provider.rs
// 外部依赖
use tauri::AppHandle;

// 内部引用
use crate::core::bot::models::{ConnectAndSaveProviderRequest, HealthCheckResponse, ProviderId};
use crate::core::bot::services::settings::provider::crud::connect_and_save;
use crate::core::models::provider::check::ProviderCheckTrigger;
use crate::core::settings::bot::providers::lifecycle::flow::check_providers_lifecycle;
use crate::core::settings::bot::providers::service::{
    reset_provider_config, update_provider_enabled_models,
};

/// Triggers the provider lifecycle check on application startup.
///
/// 应用启动时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_startup_check(app: AppHandle) {
    check_providers_lifecycle(app, ProviderCheckTrigger::Startup).await;
}

/// Triggers the provider lifecycle check on manual refresh.
///
/// 手动刷新时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_manual_refresh(app: AppHandle) {
    check_providers_lifecycle(app, ProviderCheckTrigger::ManualRefresh).await;
}

/// 前端点击"连接"时调用：健康检查 + 成功则持久化
#[tauri::command]
pub(crate) async fn connect_and_save_provider(
    app: AppHandle,
    payload: ConnectAndSaveProviderRequest,
) -> HealthCheckResponse {
    let url = payload.url.as_deref().unwrap_or("");
    connect_and_save(&app, payload.provider_id, url, &payload.key).await
}

/// 前端点击删除时调用：移除一个 Provider 配置
#[tauri::command]
pub(crate) async fn reset_provider(app: AppHandle, provider_id: ProviderId) -> bool {
    reset_provider_config(&app, provider_id)
}

/// 前端勾选模型后调用：更新 enabled_models
#[tauri::command]
pub(crate) async fn update_enabled_models(
    app: AppHandle,
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> bool {
    update_provider_enabled_models(&app, provider_id, enabled_models)
}
