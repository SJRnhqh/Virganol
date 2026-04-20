// apps/desktop/src-tauri/src/core/bot/models/provider/contract/update.rs
// 外部依赖
use serde::{Deserialize, Serialize};

// 内部引用
use super::super::ProviderId;

/** 对应前端 UpdateEnabledModelsPayload */
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct UpdateEnabledModelsRequest {
    pub provider_id: ProviderId,
    pub enabled_models: Vec<String>,
}

/** 对应前端 UpdateEnabledModelsResponse */
#[derive(Debug, Serialize)]
pub(crate) struct UpdateEnabledModelsResponse {
    pub success: bool,
    pub error: Option<String>,
}
