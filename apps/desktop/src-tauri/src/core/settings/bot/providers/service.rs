// apps/desktop/src-tauri/src/core/settings/bot/providers/service.rs
// 外部依赖
use log::{error, info};
use tauri::{AppHandle, Emitter};
use tokio::task::JoinSet;

// 内部引用
use super::store::{load_all_providers, save_provider};
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord, ProviderStatusPayload};
use crate::core::providers::connections::health;
use crate::core::settings::secrets;

// === 默认流程：持久化配置校验与结果推送 === //
const STARTUP_CHECK_CONCURRENCY_LIMIT: usize = 4;

/// 启动检查场景：优先从环境变量读取密钥，缺失时回退到 keyring
async fn health_check_with_resolved_key(provider_id: &str, url: &str) -> HealthCheckResponse {
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

/// 处理单个 Provider 的启动检查结果：协调配置并推送到前端
fn handle_startup_check_result(
    app: &AppHandle,
    id: String,
    record: ProviderRecord,
    result: HealthCheckResponse,
) {
    // 健康检查成功时，协调 enabled_models
    let final_record = if result.success {
        reconcile_enabled_models(app, &id, &record, &result.available_models)
    } else {
        record
    };

    let online = result.success;

    let payload = ProviderStatusPayload {
        provider_id: id.clone(),
        config: final_record,
        health: result,
    };

    if let Err(e) = app.emit("provider-status", &payload) {
        error!("[Tauri] ❌ Failed to emit status for {}: {}", id, e);
    } else {
        let icon = if online { "✅" } else { "⚠️" };
        info!("[Tauri] {} {} → online: {}", icon, id, online);
    }
}

/// App 启动时自动执行：加载所有已持久化的 Provider，进行有界并发健康检查，并按完成顺序逐个推送给前端
pub async fn startup_check_providers(app: AppHandle) {
    let providers = load_all_providers(&app);

    if providers.is_empty() {
        info!("[Tauri] 📭 No persisted providers found");
        return;
    }

    info!("[Tauri] 🔍 Checking {} provider(s)...", providers.len());

    let mut pending: std::collections::VecDeque<(String, ProviderRecord)> =
        providers.into_iter().collect();
    let mut in_flight = JoinSet::new();

    while !pending.is_empty() || !in_flight.is_empty() {
        while in_flight.len() < STARTUP_CHECK_CONCURRENCY_LIMIT {
            let Some((provider_id, record)) = pending.pop_front() else {
                break;
            };

            in_flight.spawn(async move {
                let url = record.url.as_deref().unwrap_or("").to_string();
                let result = health_check_with_resolved_key(&provider_id, &url).await;
                (provider_id, record, result)
            });
        }

        match in_flight.join_next().await {
            Some(Ok((id, record, result))) => {
                handle_startup_check_result(&app, id, record, result);
            }
            Some(Err(join_error)) => {
                error!("[Tauri] ❌ Startup check task join failed: {}", join_error);
            }
            None => break,
        }
    }

    info!("[Tauri] 🏁 Provider check complete");
}

// === 交互流程：响应前端LLM供应商与模型CRUD === //
