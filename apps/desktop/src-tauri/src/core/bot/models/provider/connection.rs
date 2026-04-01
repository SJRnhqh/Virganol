// apps/desktop/src-tauri/src/core/bot/models/provider/connection.rs
// 外部依赖
use serde::{Deserialize, Serialize};

// 内部引用
use crate::core::models::provider::ProviderId;

/// 前端发起 connect_and_save_provider 的请求契约
///
/// - `provider_id`: 必填
/// - `key`: 必填（允许空字符串）
/// - `url`: 可选（None / 空字符串都按“未传”处理）
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectAndSaveProviderRequest {
    pub provider_id: ProviderId,
    pub key: String,
    pub url: Option<String>,
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
