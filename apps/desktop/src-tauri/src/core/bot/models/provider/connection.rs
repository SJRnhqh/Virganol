// apps/desktop/src-tauri/src/core/bot/models/provider/connection.rs
// 外部依赖
use serde::{Deserialize, Serialize};

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
