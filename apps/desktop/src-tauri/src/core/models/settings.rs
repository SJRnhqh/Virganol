use serde::{Deserialize, Serialize};

/// 单个 Provider 的持久化记录
/// 对应 settings.json 中 spirit.providers.{id} 的值
/// 注意：available_models 不存储，每次健康检查实时拉取
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderRecord {
    pub url: String,
    pub key: String,
    pub enabled_models: Vec<String>,
}

/// 健康检查的返回结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthCheckResponse {
    pub success: bool,
    pub available_models: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl HealthCheckResponse {
    pub fn ok(models: Vec<String>) -> Self {
        Self {
            success: true,
            available_models: models,
            error: None,
        }
    }

    pub fn fail(msg: impl Into<String>) -> Self {
        Self {
            success: false,
            available_models: vec![],
            error: Some(msg.into()),
        }
    }
}

/// 推送给前端的 Provider 状态
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderStatusPayload {
    pub provider_id: String,
    pub config: ProviderRecord,
    pub health: HealthCheckResponse,
}