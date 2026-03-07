// apps/desktop/src-tauri/src/core/settings/bot/providers/utils.rs
// 外部依赖
use std::collections::HashSet;

// 内部引用
/// 计算 enabled_models 与 available_models 的交集
pub fn compute_enabled_models(
    enabled_models: &[String],
    available_models: &[String],
) -> Vec<String> {
    let available_set: HashSet<&str> = available_models
        .iter()
        .map(|model| model.as_str())
        .collect();

    enabled_models
        .iter()
        .filter(|model| available_set.contains(model.as_str()))
        .cloned()
        .collect()
}
