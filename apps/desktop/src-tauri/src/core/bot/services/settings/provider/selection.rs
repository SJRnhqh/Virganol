// apps/desktop/src-tauri/src/core/bot/services/settings/provider/selection.rs
// 外部依赖
use std::collections::HashSet;

/// Computes the intersection of enabled models and available models.
///
/// This function preserves user preferences by retaining only the models that are both
/// enabled by the user and currently available from the provider. Models that are no
/// longer available are filtered out, while newly available models are not automatically
/// enabled.
///
/// 计算已启用模型与可用模型的交集。
///
/// 保留用户偏好：仅保留用户已启用且当前可用的模型。已下线的模型会被过滤，
/// 新增的可用模型不会自动启用。
///
/// # Arguments
///
/// * `enabled_models` - User's previously enabled model list
/// * `available_models` - Currently available models from provider health check
///
/// # Returns
///
/// A vector of model names that are both enabled and available.
///
/// # Performance
///
/// Uses HashSet for O(1) lookup, achieving O(n + m) time complexity where n is the
/// number of available models and m is the number of enabled models.
///
/// # Example
///
/// ```ignore
/// let enabled = vec!["gpt-4".to_string(), "gpt-3.5".to_string()];
/// let available = vec!["gpt-4".to_string(), "gpt-4-turbo".to_string()];
/// let result = compute_enabled_models(&enabled, &available);
/// // result: ["gpt-4"] - gpt-3.5 filtered out, gpt-4-turbo not auto-enabled
/// ```
pub(crate) fn compute_enabled_models(
    enabled_models: &[String],
    available_models: &[String],
) -> Vec<String> {
    let available_set: HashSet<&str> = available_models.iter().map(String::as_str).collect();

    enabled_models
        .iter()
        .filter(|model| available_set.contains(model.as_str()))
        .cloned()
        .collect()
}
