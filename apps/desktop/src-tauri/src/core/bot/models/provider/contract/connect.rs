// apps/desktop/src-tauri/src/core/bot/models/provider/contract/connect.rs
use serde::{Deserialize, Serialize};

use super::super::ProviderId;

/// Request payload for connecting and saving a provider.
///
/// 前端发起 `connect_and_save_provider` 的请求契约。
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderRequest {
    pub provider_id: ProviderId,
    pub key: String,
    pub url: Option<String>,
}

/// Response for connect and save operation.
///
/// connect_and_save 操作的响应。
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderResponse {
    pub success: bool,
    pub available_models: Vec<String>,
    pub enabled_models: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl ConnectAndSaveProviderResponse {
    /// Creates a successful response with model data.
    ///
    /// 创建带模型数据的成功响应。
    pub fn ok(available_models: Vec<String>, enabled_models: Vec<String>) -> Self {
        Self {
            success: true,
            available_models,
            enabled_models,
            error: None,
        }
    }

    /// Creates a failed response with error message.
    ///
    /// 创建带错误消息的失败响应。
    pub fn fail(error: Option<String>) -> Self {
        Self {
            success: false,
            available_models: vec![],
            enabled_models: vec![],
            error,
        }
    }
}
