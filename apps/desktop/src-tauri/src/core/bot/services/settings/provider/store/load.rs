// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/load.rs
// 外部依赖
use std::collections::HashMap;
use tauri::AppHandle;

// 内部引用
use super::super::super::load_settings;
use crate::core::bot::constants::SPIRIT_PROVIDERS_KEY;
use crate::core::bot::models::{
    ProviderError, ProviderId, ProviderRecord, SkippedProviderDetail, SupportedProvidersSnapshot,
};

/// 读取所有已保存 providers：
/// - Ok(HashMap)：读取并完成反序列化
/// - Ok(empty)：配置不存在（尚未写入）
/// - Err(ProviderError::Io)：settings store 打开/读取失败
/// - Err(ProviderError::Serde)：providers JSON 反序列化失败
pub(super) fn load_all_providers(
    app: &AppHandle,
) -> Result<HashMap<String, ProviderRecord>, ProviderError> {
    // 如果加载配置出错则上抛对应错误
    let maybe_value = load_settings(app, SPIRIT_PROVIDERS_KEY)?;
    let Some(value) = maybe_value else {
        return Ok(HashMap::new());
    };

    // 如果反序列化出错则上抛对应错误
    let providers: HashMap<String, ProviderRecord> = serde_json::from_value(value)?;
    Ok(providers)
}

/// 读取并过滤为"后端当前支持"的 provider 列表（startup_check 专用）
pub(crate) fn load_supported_providers(
    app: &AppHandle,
) -> Result<SupportedProvidersSnapshot, ProviderError> {
    // 上抛严格加载所有配置的错误
    let providers = load_all_providers(app)?;
    let total = providers.len();
    let mut supported = Vec::new();
    let mut skipped = Vec::new();

    for (raw_id, record) in providers {
        match ProviderId::try_from(raw_id.as_str()) {
            Ok(provider_id) => supported.push((provider_id, record)),
            Err(error) => skipped.push(SkippedProviderDetail::new(
                raw_id,
                error.code(),
                error.message(),
            )),
        }
    }

    Ok(SupportedProvidersSnapshot {
        total,
        supported,
        skipped,
    })
}

/// 读取单个 provider 的配置快照（只读，严格错误处理）
/// - Ok(Some(record))：存在该 provider 配置
/// - Ok(None)：不存在该 provider 配置
/// - Err(ProviderError::Io)：settings store 打开/读取失败
/// - Err(ProviderError::Serde)：providers JSON 反序列化失败
///
/// TODO: 当前使用 clone (~150 bytes)，如果未来 ProviderRecord 字段增多（如添加
/// model_configs、usage_history 等）或调用频率变高（如自动重连），可考虑引入
/// ProvidersCache 结构返回引用，避免重复反序列化和内存分配。
pub(crate) fn load_provider_record(
    app: &AppHandle,
    provider_id: ProviderId,
) -> Result<Option<ProviderRecord>, ProviderError> {
    let providers = load_all_providers(app)?;
    // TODO: 性能优化点 - 当 ProviderRecord 变大或调用频率变高时，考虑返回引用
    Ok(providers.get(provider_id.as_str()).cloned())
}
