// apps/desktop/src-tauri/src/core/bot/helpers/provider/intersection.rs
use std::collections::HashSet;

/// Computes the intersection of enabled models and available models, preserving user preferences.
///
/// 计算已启用模型与可用模型的交集，保留用户偏好。
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
