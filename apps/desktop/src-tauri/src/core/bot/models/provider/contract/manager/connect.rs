// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/connect.rs
use serde::{Deserialize, Serialize};

use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request data for connecting a provider.
///
/// 连接 Provider 的请求数据。
#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderRequestData {
    /// Provider API key supplied by the user.
    ///
    /// 用户提供的 Provider API key。
    #[serde(default)]
    pub(crate) key: String,
    /// Optional provider base URL supplied by the user.
    ///
    /// 用户提供的可选 Provider 基础 URL。
    #[serde(default)]
    pub(crate) url: Option<String>,
}

/// Response data for connect operation.
///
/// 连接操作的响应数据。
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderResponseData {
    /// Models discovered by the provider health check.
    ///
    /// Provider 健康检查发现的模型列表。
    pub(crate) available_models: Vec<String>,
    /// Models enabled after preserving compatible previous selections.
    ///
    /// 保留兼容历史选择后处于启用状态的模型列表。
    pub(crate) enabled_models: Vec<String>,
}

/// Request for connecting and saving a provider.
///
/// 连接并保存 Provider 的请求。
pub(crate) type ConnectAndSaveProviderRequest =
    ProviderCommandRequest<ConnectAndSaveProviderRequestData>;

/// Response for connecting and saving a provider.
///
/// 连接并保存 Provider 的响应。
pub(crate) type ConnectAndSaveProviderResponse =
    ProviderCommandResponse<ConnectAndSaveProviderResponseData>;

impl ConnectAndSaveProviderResponse {
    /// Creates a successful response with model data.
    ///
    /// 创建带模型数据的成功响应。
    pub(crate) fn ok(available_models: Vec<String>, enabled_models: Vec<String>) -> Self {
        Self::success_with(ConnectAndSaveProviderResponseData {
            available_models,
            enabled_models,
        })
    }
}
