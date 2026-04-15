// apps/desktop/src-tauri/src/core/bot/models/provider/contract/connect.rs
// 外部依赖
use serde::{Deserialize, Serialize};

// 内部引用
use super::super::ProviderId;

/// Request payload for connecting and saving a provider.
///
/// 前端发起 `connect_and_save_provider` 的请求契约。
///
/// - `provider_id`: Required / 必填
/// - `key`: Required (empty string allowed) / 必填（允许空字符串）
/// - `url`: Optional (None/empty string treated as "not provided") / 可选（None/空字符串都按"未传"处理）
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderRequest {
    pub provider_id: ProviderId,
    pub key: String,
    pub url: Option<String>,
}

/// Response for connect and save operation.
///
/// connect_and_save 操作的返回契约，包含健康检查结果和持久化后的启用模型列表。
///
/// - `success`: 操作是否成功
/// - `available_models`: 健康检查返回的可用模型列表
/// - `enabled_models`: 持久化后的启用模型列表（前端据此渲染面板）
/// - `error`: 失败时的错误信息
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderResponse {
    pub success: bool,
    pub available_models: Vec<String>,
    pub enabled_models: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

// impl ConnectAndSaveProviderResponse {
//     /// 构造成功响应
//     pub fn ok(available_models: Vec<String>, enabled_models: Vec<String>) -> Self {
//         Self {
//             success: true,
//             available_models,
//             enabled_models,
//             error: None,
//         }
//     }
//
//     /// 构造失败响应
//     pub fn fail(msg: impl Into<String>) -> Self {
//         Self {
//             success: false,
//             available_models: vec![],
//             enabled_models: vec![],
//             error: Some(msg.into()),
//         }
//     }
// }
