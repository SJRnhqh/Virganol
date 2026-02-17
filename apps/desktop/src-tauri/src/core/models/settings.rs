// apps/core/models/security.rs
// 外部方法
use serde::{Deserialize, Serialize};

// 内部引用
use crate::core::models::security::ProviderSecretMeta;

/// 前端发起 connect_and_save_provider 的请求契约
///
/// - `provider_id`: 必填
/// - `key`: 必填（允许空字符串）
/// - `url`: 可选（None / 空字符串都按“未传”处理）
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectAndSaveProviderRequest {
    pub provider_id: String,
    pub url: Option<String>,
    pub key: String,
}

/// 单个 Provider 的持久化记录
/// 对应 settings.json 中 spirit.providers.{id} 的值
/// 注意：available_models 不存储，每次健康检查实时拉取
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderRecord {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
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
    pub secret_meta: ProviderSecretMeta,
}
