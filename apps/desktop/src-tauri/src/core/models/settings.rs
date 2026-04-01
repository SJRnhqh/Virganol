// apps/core/models/settings.rs
// 外部方法
use serde::{Deserialize, Serialize};

/// 单个 Provider 的持久化记录
/// 对应 settings.json 中 spirit.providers.{id} 的值
/// 注意：available_models 不存储，每次健康检查实时拉取
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderRecord {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    pub enabled_models: Vec<String>,
}
