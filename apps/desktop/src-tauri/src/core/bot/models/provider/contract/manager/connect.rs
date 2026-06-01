// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/connect.rs
use serde::{Deserialize, Serialize};

use super::super::super::ProviderId;
use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request data for connecting a provider.
///
/// 连接 Provider 的请求数据。
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(in crate::core::bot) struct ConnectAndSaveProviderRequestData {
    /// Raw Provider API key from the command payload.
    ///
    /// 命令载荷中的原始 Provider API key。
    #[serde(default)]
    key: String,
    /// Raw optional Provider base URL from the command payload.
    ///
    /// 命令载荷中的原始可选 Provider 基础 URL。
    #[serde(default)]
    url: Option<String>,
}

impl ConnectAndSaveProviderRequestData {
    /// Returns the API key normalized for connection probing and saving.
    ///
    /// 返回用于连接探测与保存的归一化 API key。
    pub(in crate::core::bot) fn normalized_api_key(&self) -> &str {
        self.key.trim()
    }

    /// Returns the base URL normalized for connection probing and saving.
    ///
    /// 返回用于连接探测与保存的归一化基础 URL。
    pub(in crate::core::bot) fn normalized_base_url(&self) -> &str {
        self.url.as_deref().unwrap_or("").trim()
    }
}

/// Response data for connect operation.
///
/// 连接操作的响应数据。
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ConnectAndSaveProviderResponseData {
    /// Models discovered by the provider health check.
    ///
    /// Provider 健康检查发现的模型列表。
    available_models: Vec<String>,
    /// Models enabled after preserving compatible previous selections.
    ///
    /// 保留兼容历史选择后处于启用状态的模型列表。
    enabled_models: Vec<String>,
}

/// Request for connecting and saving a provider.
///
/// 连接并保存 Provider 的请求。
#[derive(Deserialize)]
#[serde(transparent)]
pub(crate) struct ConnectAndSaveProviderRequest(
    ProviderCommandRequest<ConnectAndSaveProviderRequestData>,
);

impl ConnectAndSaveProviderRequest {
    /// Consumes the request into its target provider and connection data.
    ///
    /// 消费请求并返回目标 provider 与连接数据。
    pub(in crate::core::bot) fn into_parts(
        self,
    ) -> (ProviderId, Option<ConnectAndSaveProviderRequestData>) {
        self.0.into_parts()
    }
}

/// Response for connecting and saving a provider.
///
/// 连接并保存 Provider 的响应。
pub(crate) type ConnectAndSaveProviderResponse =
    ProviderCommandResponse<ConnectAndSaveProviderResponseData>;

impl ConnectAndSaveProviderResponse {
    /// Creates a successful response with model data.
    ///
    /// 创建带模型数据的成功响应。
    pub(in crate::core::bot) fn ok(
        available_models: Vec<String>,
        enabled_models: Vec<String>,
    ) -> Self {
        Self::success_with(ConnectAndSaveProviderResponseData {
            available_models,
            enabled_models,
        })
    }
}
