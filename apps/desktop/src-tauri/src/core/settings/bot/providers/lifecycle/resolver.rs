// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/resolver.rs
// 内部引用
use crate::core::bot::models::HealthCheckResponse;
use crate::core::models::provider::ProviderId;
use crate::core::models::security::{ProviderKeySource, ProviderSecretMeta};
use crate::core::providers::connections::health;
use crate::core::settings::secrets;

/// 一次性解析密钥并执行健康检查，同时返回密钥来源元信息（env 优先，其次 keyring）
/// 避免 keyring 系统调用被重复触发两次
pub(super) async fn health_check_with_secret_meta(
    provider_id: ProviderId,
    url: &str,
) -> (HealthCheckResponse, ProviderSecretMeta) {
    let (api_key, secret_meta) = if let Some(k) = secrets::load_provider_key_from_env(provider_id) {
        (
            Some(k),
            ProviderSecretMeta::with_source(ProviderKeySource::Env),
        )
    } else if let Some(k) = secrets::load_provider_key(provider_id) {
        (
            Some(k),
            ProviderSecretMeta::with_source(ProviderKeySource::Keyring),
        )
    } else {
        (None, ProviderSecretMeta::none())
    };

    // 无密钥时传空字符串；ollama 等无需 key 的 provider 由 health_check 内部自行忽略。
    let key = api_key.as_ref().map(|k| k.as_str()).unwrap_or("");
    let response = health::health_check(provider_id, url, key).await;
    (response, secret_meta)
}
