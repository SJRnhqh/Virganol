// apps/desktop/src-tauri/src/core/bot/helpers/provider/reorder.rs

/// Reorders enabled models to match the order of available models.
///
/// This function ensures stable frontend rendering by reordering the enabled models
/// list to match the order defined in the available models list. This prevents UI
/// flickering or inconsistent ordering when the same data is rendered multiple times.
///
/// 按照可用模型的顺序重新排列已启用模型。
///
/// 保证前端渲染顺序的稳定性：enabled_models 的顺序总是与 available_models 一致，
/// 避免相同数据多次渲染时出现顺序不一致或 UI 闪烁。
///
/// # Arguments
///
/// * `enabled_models` - List of models that are currently enabled
/// * `available_models` - Reference list defining the canonical order
///
/// # Returns
///
/// A vector of enabled model names reordered to match available_models order.
///
/// # Performance
///
/// Time complexity: O(n * m) where n is the number of available models and m is
/// the number of enabled models. For typical model lists (< 100 items), this is
/// negligible.
///
/// # Example
///
/// ```ignore
/// let available = vec!["gpt-4".to_string(), "gpt-3.5".to_string(), "gpt-4-turbo".to_string()];
/// let enabled = vec!["gpt-4-turbo".to_string(), "gpt-4".to_string()];
/// let result = reorder_enabled_models(&enabled, &available);
/// // result: ["gpt-4", "gpt-4-turbo"] - reordered to match available
/// ```
pub(crate) fn reorder_enabled_models(
    enabled_models: &[String],
    available_models: &[String],
) -> Vec<String> {
    available_models
        .iter()
        .filter(|model| enabled_models.contains(model))
        .cloned()
        .collect()
}
