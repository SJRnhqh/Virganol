// apps/desktop/src-tauri/src/core/settings/bot/providers/service.rs
// 外部依赖
use log::{error, info};
use tauri::{AppHandle, Emitter};

// 内部引用
use super::store::{load_all_providers, save_provider};
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord, ProviderStatusPayload};
use crate::core::providers::connections::health;
use crate::core::settings::secrets;

// === 默认流程：持久化配置校验与结果推送 === //

/// 启动检查场景：优先从环境变量读取密钥，缺失时回退到 keyring
async fn health_check_with_stored_key(provider_id: &str, url: &str) -> HealthCheckResponse {
    let api_key = secrets::load_provider_key_from_env(provider_id)
        .or_else(|| secrets::load_provider_key(provider_id));
    let key = api_key.as_ref().map(|key| key.as_str()).unwrap_or("");
    health::health_check(provider_id, url, key).await
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
            "[Tauri] {} enabled_models reconciled: {} → {}",
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

// === 交互流程：响应前端LLM供应商与模型CRUD === //
