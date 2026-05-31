// apps/desktop/src-tauri/src/core/bot/models/provider/config/record.rs
use serde::{Deserialize, Serialize};

use super::super::super::super::compute_enabled_models;

/// Provider configuration record persisted in settings.json.
///
/// Provider 持久化配置记录（settings.json 中 spirit.providers.{id}）。
#[derive(Clone, Serialize, Deserialize)]
pub(crate) struct ProviderRecord {
    /// Optional provider base URL.
    ///
    /// 可选的 Provider 基础 URL。
    #[serde(skip_serializing_if = "Option::is_none")]
    pub(crate) url: Option<String>,
    /// Enabled model identifiers persisted for this provider.
    ///
    /// 此 Provider 持久化的已启用模型标识列表。
    pub(crate) enabled_models: Vec<String>,
}

impl ProviderRecord {
    /// Creates a provider record with a normalized optional URL.
    ///
    /// 创建 URL 已规范化为可选值的 Provider 配置记录。
    pub(crate) fn new(url: &str, enabled_models: Vec<String>) -> Self {
        Self {
            url: (!url.is_empty()).then(|| url.to_string()),
            enabled_models,
        }
    }

    /// Creates a provider record if enabled models are pruned by available models.
    ///
    /// 当当前可用模型会修剪 enabled_models 时，创建新的 Provider 配置记录。
    pub(crate) fn reconcile_enabled_models_if_pruned(
        &self,
        available_models: &[String],
    ) -> Option<Self> {
        let enabled_models = compute_enabled_models(&self.enabled_models, available_models);

        (enabled_models.len() != self.enabled_models.len()).then(|| Self {
            url: self.url.clone(),
            enabled_models,
        })
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
