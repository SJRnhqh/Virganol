// apps/desktop/src-tauri/src/core/bot/models/provider/config/record.rs
use std::collections::HashSet;

use serde::{Deserialize, Serialize};

/// Provider configuration record persisted in settings.json.
///
/// Provider 持久化配置记录（settings.json 中 spirit.providers.{id}）。
#[derive(Clone, Serialize, Deserialize)]
pub(in crate::core::bot) struct ProviderRecord {
    /// Optional provider base URL.
    ///
    /// 可选的 Provider 基础 URL。
    #[serde(skip_serializing_if = "Option::is_none")]
    url: Option<String>,
    /// Enabled model identifiers persisted for this provider.
    ///
    /// 此 Provider 持久化的已启用模型标识列表。
    enabled_models: Vec<String>,
}

impl ProviderRecord {
    /// Creates a provider record with a normalized optional URL.
    ///
    /// 创建 URL 已规范化为可选值的 Provider 配置记录。
    fn new(url: &str, enabled_models: Vec<String>) -> Self {
        Self {
            url: (!url.is_empty()).then(|| url.to_string()),
            enabled_models,
        }
    }

    /// Returns the optional provider base URL.
    ///
    /// 返回可选的 Provider 基础 URL。
    pub(in crate::core::bot) fn url(&self) -> Option<&str> {
        self.url.as_deref()
    }

    /// Returns enabled model identifiers.
    ///
    /// 返回已启用模型标识列表。
    pub(in crate::core::bot) fn enabled_models(&self) -> &[String] {
        &self.enabled_models
    }

    /// Replaces enabled model identifiers.
    ///
    /// 替换已启用模型标识列表。
    pub(in crate::core::bot) fn replace_enabled_models(&mut self, enabled_models: Vec<String>) {
        self.enabled_models = enabled_models;
    }

    /// Computes enabled models that are still available.
    ///
    /// 计算当前仍然可用的已启用模型。
    fn reconciled_enabled_models(&self, available_models: &[String]) -> Vec<String> {
        let enabled_set: HashSet<&str> = self.enabled_models.iter().map(String::as_str).collect();

        available_models
            .iter()
            .filter(|model| enabled_set.contains(model.as_str()))
            .cloned()
            .collect()
    }

    /// Creates a provider record if enabled models are pruned by available models.
    ///
    /// 当当前可用模型会修剪 enabled_models 时，创建新的 Provider 配置记录。
    pub(in crate::core::bot) fn reconcile_enabled_models_if_pruned(
        &self,
        available_models: &[String],
    ) -> Option<Self> {
        let enabled_models = self.reconciled_enabled_models(available_models);

        (enabled_models.len() != self.enabled_models.len()).then(|| Self {
            url: self.url.clone(),
            enabled_models,
        })
    }

    /// Creates a provider record from a successful connection result.
    ///
    /// 根据连接成功结果创建 Provider 配置记录，并保留仍可用的历史启用模型。
    pub(in crate::core::bot) fn from_connection(
        url: &str,
        available_models: &[String],
        previous: Option<&Self>,
    ) -> Self {
        let enabled_models = previous
            .map(|record| record.reconciled_enabled_models(available_models))
            .unwrap_or_default();

        Self::new(url, enabled_models)
    }
}
