// apps/desktop/src-tauri/src/core/settings/bot/providers/service.rs
// 外部依赖
use log::{error, info, warn};
use tauri::{AppHandle, Emitter};
use tokio::task::JoinSet;

// 内部引用
use super::store::{load_all_providers, remove_provider, save_provider, update_models};
use crate::core::models::provider::ProviderId;
use crate::core::models::security::{ProviderKeySource, ProviderSecretMeta};
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord, ProviderStatusPayload};
use crate::core::providers::connections::health;
use crate::core::settings::secrets;

// === 默认流程：持久化配置校验与结果推送 === //
const STARTUP_CHECK_CONCURRENCY_LIMIT: usize = 4;

/// 启动检查场景：优先从环境变量读取密钥，缺失时回退到 keyring
async fn health_check_with_resolved_key(provider_id: ProviderId, url: &str) -> HealthCheckResponse {
    let api_key = secrets::load_provider_key_from_env(provider_id)
        .or_else(|| secrets::load_provider_key(provider_id));
    let key = api_key.as_ref().map(|key| key.as_str()).unwrap_or("");
    health::health_check(provider_id, url, key).await
}

/// 计算 enabled_models 与 available_models 的交集
fn compute_enabled_models(enabled_models: &[String], available_models: &[String]) -> Vec<String> {
    let available_set: std::collections::HashSet<&str> = available_models
        .iter()
        .map(|model| model.as_str())
        .collect();

    enabled_models
        .iter()
        .filter(|model| available_set.contains(model.as_str()))
        .cloned()
        .collect()
}

/// 协调 enabled_models：只保留 available_models 中仍然存在的模型
/// 如果有模型被淘汰，自动写回配置文件并返回更新后的 ProviderRecord
/// 如果无变化，直接返回原 record 的克隆
fn reconcile_enabled_models(
    app: &AppHandle,
    provider_id: ProviderId,
    record: &ProviderRecord,
    available_models: &[String],
) -> ProviderRecord {
    // 交集：只保留仍然可用的 enabled 模型
    let new_enabled = compute_enabled_models(&record.enabled_models, available_models);

    if new_enabled.len() != record.enabled_models.len() {
        // 有模型被淘汰了，构造新 record 并写回配置
        let mut updated = record.clone();
        updated.enabled_models = new_enabled;

        match save_provider(app, provider_id, &updated) {
            Ok(()) => {
                info!(
                    "[Tauri] 🔄 {} enabled_models reconciled: {} → {}",
                    provider_id,
                    record.enabled_models.len(),
                    updated.enabled_models.len()
                );
                updated
            }
            Err(error_msg) => {
                error!(
                    "[Tauri] ❌ {} enabled_models reconcile persist failed: {}",
                    provider_id, error_msg
                );
                record.clone()
            }
        }
    } else {
        // 无变化，原样返回
        record.clone()
    }
}

/// 解析 Provider 的密钥来源元数据
fn resolve_provider_secret_meta(provider_id: ProviderId) -> ProviderSecretMeta {
    if secrets::load_provider_key_from_env(provider_id).is_some() {
        return ProviderSecretMeta::with_source(ProviderKeySource::Env);
    }

    if secrets::load_provider_key(provider_id).is_some() {
        return ProviderSecretMeta::with_source(ProviderKeySource::Keyring);
    }

    ProviderSecretMeta::none()
}

/// 处理单个 Provider 的启动检查结果：协调配置并推送到前端
fn handle_startup_check_result(
    app: &AppHandle,
    provider_id: ProviderId,
    id: String,
    record: ProviderRecord,
    result: HealthCheckResponse,
) {
    // 健康检查成功时，协调 enabled_models
    let final_record = if result.success {
        reconcile_enabled_models(app, provider_id, &record, &result.available_models)
    } else {
        record
    };

    let online = result.success;

    let payload = ProviderStatusPayload {
        provider_id: id.clone(),
        config: final_record,
        health: result,
        secret_meta: resolve_provider_secret_meta(provider_id),
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

    let total = providers.len();
    let mut pending: std::collections::VecDeque<(ProviderId, String, ProviderRecord)> = providers
        .into_iter()
        // raw_id是原始字符串，provider_id是解析后的ID
        .filter_map(
            |(raw_id, record)| match ProviderId::try_from(raw_id.as_str()) {
                Ok(provider_id) => Some((provider_id, raw_id, record)),
                Err(_) => {
                    warn!("[Tauri] ⚠️ Skip unsupported provider in store: {}", raw_id);
                    None
                }
            },
        )
        .collect();

    if pending.is_empty() {
        info!("[Tauri] 📭 No supported providers found in persisted configs");
        return;
    }

    info!(
        "[Tauri] 🔍 Checking {} provider(s) (loaded {}, skipped {})...",
        pending.len(),
        total,
        total - pending.len()
    );

    let mut in_flight = JoinSet::new();

    // 并发调度循环：队列未清空或仍有在途任务时持续推进
    while !pending.is_empty() || !in_flight.is_empty() {
        // 1) 尽可能把任务补满到并发上限
        while in_flight.len() < STARTUP_CHECK_CONCURRENCY_LIMIT {
            let Some((provider_id, raw_id, record)) = pending.pop_front() else {
                break;
            };

            in_flight.spawn(async move {
                let url = record.url.as_deref().unwrap_or("").to_string();
                let result = health_check_with_resolved_key(provider_id, &url).await;
                (provider_id, raw_id, record, result)
            });
        }

        // 2) 消费一个已完成任务（完成即处理，增量推送）
        match in_flight.join_next().await {
            Some(Ok((provider_id, id, record, result))) => {
                handle_startup_check_result(&app, provider_id, id, record, result);
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
/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub async fn connect_and_save(
    app: &AppHandle,
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    let provider_name = provider_id.as_str();

    // 1) 先归一化前端传入的 key（去掉首尾空白）
    let normalized_key = key.trim();
    // 若本次输入了新 key，先记录旧 key 快照，用于后续异常回滚
    let previous_persisted_key = if normalized_key.is_empty() {
        None
    } else {
        secrets::load_provider_key(provider_id)
    };

    // 2) 若本次未输入 key，则尝试回退：env -> keyring
    // 前端输入 > env > keyring
    let fallback_key = if normalized_key.is_empty() {
        secrets::load_provider_key_from_env(provider_id)
            .or_else(|| secrets::load_provider_key(provider_id))
    } else {
        None
    };
    // 3) 最终用于健康检查的 key：优先 fallback，其次当前输入（可能为空）
    let key_for_check = fallback_key
        .as_ref()
        .map(|resolved| resolved.as_str())
        .unwrap_or(normalized_key);
    // 4) 用解析后的 key 执行健康检查
    let result = health::health_check(provider_id, url, key_for_check).await;

    if result.success {
        if !normalized_key.is_empty() {
            if let Err(error_msg) = secrets::save_provider_key(provider_id, key_for_check) {
                error!(
                    "[Tauri] ❌ {} key persist failed: {}",
                    provider_id, error_msg
                );
                return HealthCheckResponse::fail("Failed to persist provider key");
            }
        } else {
            info!(
                "[Tauri] ⏭️ {} skip key persist: using env or existing key",
                provider_id
            );
        }

        // 复用历史启用状态，并与本次可用模型做交集对齐
        let mut providers = load_all_providers(app);
        let previous_record = providers.remove(provider_name);
        let next_enabled_models = match previous_record {
            Some(record) => {
                compute_enabled_models(&record.enabled_models, &result.available_models)
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
        if let Err(error_msg) = save_provider(app, provider_id, &record) {
            error!(
                "[Tauri] ❌ {} provider config persist failed: {}",
                provider_id, error_msg
            );

            // 仅当本次显式输入了 key 时，才需要回滚 keyring 变更
            if !normalized_key.is_empty() {
                let rollback_result = if let Some(previous_key) = previous_persisted_key.as_ref() {
                    // 回滚 keyring 旧密钥
                    secrets::save_provider_key(provider_id, previous_key.as_str())
                } else {
                    // 删除新添加密钥
                    secrets::remove_provider_key(provider_id)
                };

                if let Err(rollback_error) = rollback_result {
                    error!(
                        "[Tauri] ❌ {} key rollback failed after config persist error: {}",
                        provider_id, rollback_error
                    );
                } else {
                    info!("[Tauri] ↩️ {} key rollback completed", provider_id);
                }
            }

            return HealthCheckResponse::fail("Failed to persist provider config");
        }

        info!("[Tauri] 💾 {} saved to store", provider_id);
    }

    result
}

/// 重置 provider 的持久化配置
pub fn reset_provider_config(app: &AppHandle, provider_id: &str) -> bool {
    let provider = match ProviderId::try_from(provider_id) {
        Ok(provider) => provider,
        Err(_) => {
            error!(
                "[Tauri] ❌ {} invalid provider_id, cannot reset config",
                provider_id
            );
            return false;
        }
    };
    let provider_name = provider.as_str();

    // 1) 先快照旧配置，供异常时回滚
    let previous_record = load_all_providers(app).get(provider_name).cloned();

    // 2) 先删除普通配置（settings.json 中的 spirit.providers.{id}）
    let config_removed = match remove_provider(app, provider) {
        Ok(removed) => removed,
        Err(error_msg) => {
            error!(
                "[Tauri] ❌ {} config remove persist failed: {}",
                provider_name, error_msg
            );
            return false;
        }
    };

    if !config_removed {
        error!(
            "[Tauri] ❌ {} not found, cannot reset config",
            provider_name
        );
    }

    // 3) 再删除系统密钥库中的 key（幂等：不存在也应算成功）
    let key_removed = match secrets::remove_provider_key(provider) {
        Ok(()) => true,
        Err(error_msg) => {
            error!(
                "[Tauri] ❌ {} key remove failed: {}",
                provider_name, error_msg
            );
            false
        }
    };

    // 4) key 删除失败时，回滚已删除的配置
    if config_removed && !key_removed {
        if let Some(record) = previous_record.as_ref() {
            if let Err(error_msg) = save_provider(app, provider, record) {
                error!(
                    "[Tauri] ❌ {} config rollback failed after key remove error: {}",
                    provider_name, error_msg
                );
            } else {
                info!("[Tauri] ↩️ {} config rollback completed", provider_name);
            }
        }
    }

    // 5) 两者都成功才返回 true
    config_removed && key_removed
}

/// 更新某个 provider 的 enabled_models（service 层：负责业务日志）
pub fn update_provider_enabled_models(
    app: &AppHandle,
    provider_id: &str,
    enabled_models: Vec<String>,
) -> bool {
    let provider = match ProviderId::try_from(provider_id) {
        Ok(provider) => provider,
        Err(_) => {
            error!(
                "[Tauri] ❌ {} invalid provider_id, cannot update models",
                provider_id
            );
            return false;
        }
    };

    // 调用 store 层执行实际写入，并在这里统一记录业务结果与持久化错误
    let ok = match update_models(app, provider, enabled_models) {
        Ok(updated) => updated,
        Err(error_msg) => {
            error!(
                "[Tauri] ❌ {} enabled_models persist failed: {}",
                provider_id, error_msg
            );
            return false;
        }
    };

    if ok {
        info!("[Tauri] ✅ {} enabled_models updated", provider_id);
    } else {
        error!("[Tauri] ❌ {} not found, cannot update models", provider_id);
    }

    ok
}
