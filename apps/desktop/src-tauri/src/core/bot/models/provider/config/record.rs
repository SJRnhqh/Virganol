// apps/desktop/src-tauri/src/core/bot/models/provider/config/record.rs
use serde::{Deserialize, Serialize};

use super::super::super::super::compute_enabled_models;

/// Provider configuration record persisted in settings.json.
///
/// Provider 持久化配置记录（settings.json 中 spirit.providers.{id}）。
#[derive(Debug, Clone, Serialize, Deserialize)]
pub(crate) struct ProviderRecord {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub(crate) url: Option<String>,
    pub(crate) enabled_models: Vec<String>,
}

impl ProviderRecord {
    /// Creates a new provider record with normalized URL.
    ///
    /// 创建 Provider 配置记录，自动处理空 URL。
    pub(crate) fn new(url: &str, enabled_models: Vec<String>) -> Self {
        Self {
            url: (!url.is_empty()).then(|| url.to_string()),
            enabled_models,
        }
    }

    /// Creates a provider record from a successful connection result.
    ///
    /// 根据连接成功结果创建 Provider 配置记录，并保留仍可用的历史启用模型。
    pub(crate) fn from_connection(
        url: &str,
        available_models: &[String],
        previous: Option<&Self>,
    ) -> Self {
        let enabled_models = previous
            .map(|record| compute_enabled_models(&record.enabled_models, available_models))
            .unwrap_or_default();

        Self::new(url, enabled_models)
    }
}
