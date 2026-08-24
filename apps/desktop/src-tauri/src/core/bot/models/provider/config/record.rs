// apps/desktop/src-tauri/src/core/bot/models/provider/config/record.rs
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

/// Persisted provider configuration record.
///
/// 持久化的供应商配置记录。
#[derive(Clone, Serialize, Deserialize)]
pub(in crate::core::bot) struct ProviderRecord {
    /// Optional provider base URL.
    ///
    /// 可选的供应商基础地址。
    #[serde(skip_serializing_if = "Option::is_none")]
    url: Option<String>,
    /// Enabled model identifiers for this provider.
    ///
    /// 当前供应商已启用的模型标识列表。
    enabled_models: Vec<String>,
}

impl ProviderRecord {
    /// Returns the optional provider base URL.
    ///
    /// 返回可选的供应商基础地址。
    pub(in crate::core::bot) fn url(&self) -> Option<&str> {
        self.url.as_deref()
    }

    /// Returns enabled model identifiers.
    ///
    /// 返回已启用模型标识列表。
    pub(in crate::core::bot) fn enabled_models(&self) -> &[String] {
        &self.enabled_models
    }

    /// Replaces the enabled model identifiers.
    ///
    /// 替换已启用模型标识列表。
    pub(in crate::core::bot) fn replace_enabled_models(&mut self, enabled_models: Vec<String>) {
        self.enabled_models = enabled_models;
    }

    /// Returns a pruned record when unavailable models are enabled.
    ///
    /// 已启用不可用模型时，返回修剪后的配置记录。
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

    /// Creates a record from a successful connection.
    ///
    /// 根据成功连接创建配置记录，并保留仍可用的历史启用模型。
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

    /// Returns enabled models that remain available.
    ///
    /// 返回当前仍可用的已启用模型。
    fn reconciled_enabled_models(&self, available_models: &[String]) -> Vec<String> {
        let enabled_set: HashSet<&str> = self.enabled_models.iter().map(String::as_str).collect();

        available_models
            .iter()
            .filter(|model| enabled_set.contains(model.as_str()))
            .cloned()
            .collect()
    }

    /// Creates a record, treating an empty URL as absent.
    ///
    /// 创建配置记录，并将空地址视为缺失。
    fn new(url: &str, enabled_models: Vec<String>) -> Self {
        Self {
            url: (!url.is_empty()).then(|| url.to_string()),
            enabled_models,
        }
    }
}
