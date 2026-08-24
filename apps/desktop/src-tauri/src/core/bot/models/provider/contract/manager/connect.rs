// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/connect.rs
use serde::{Deserialize, Serialize};

use super::super::super::ProviderId;
use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request data for connecting a provider.
///
/// 连接供应商的请求数据。
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(in crate::core::bot) struct ConnectAndSaveProviderRequestData {
    /// Raw Provider API key from the command payload.
    ///
    /// 命令载荷中的原始供应商 API 密钥。
    #[serde(default)]
    key: String,
    /// Raw optional Provider base URL from the command payload.
    ///
    /// 命令载荷中的原始可选供应商基础地址。
    #[serde(default)]
    url: Option<String>,
}

impl ConnectAndSaveProviderRequestData {
    /// Returns the API key normalized for connection probing and saving.
    ///
    /// 返回用于连接探测与保存的归一化 API 密钥。
    pub(in crate::core::bot) fn normalized_api_key(&self) -> &str {
        self.key.trim()
    }

    /// Returns the base URL normalized for connection probing and saving.
    ///
    /// 返回用于连接探测与保存的归一化基础地址。
    pub(in crate::core::bot) fn normalized_base_url(&self) -> &str {
        self.url.as_deref().unwrap_or("").trim()
    }
}

/// Request for connecting and saving a provider.
///
/// 连接并保存供应商的请求。
#[derive(Deserialize)]
#[serde(transparent)]
pub(crate) struct ConnectAndSaveProviderRequest(
    /// Generic command request envelope.
    ///
    /// 通用命令请求包裹。
    ProviderCommandRequest<ConnectAndSaveProviderRequestData>,
);

impl ConnectAndSaveProviderRequest {
    /// Consumes the request into its target provider and connection data.
    ///
    /// 消费请求并返回目标供应商与连接数据。
    pub(in crate::core::bot) fn into_parts(
        self,
    ) -> (ProviderId, Option<ConnectAndSaveProviderRequestData>) {
        self.0.into_parts()
    }
}

/// Response data for connect operation.
///
/// 连接操作的响应数据。
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ConnectAndSaveProviderResponseData {
    /// Models discovered by the provider health check.
    ///
    /// 供应商健康检查发现的模型列表。
    available_models: Vec<String>,
    /// Models enabled after preserving compatible previous selections.
    ///
    /// 保留兼容历史选择后处于启用状态的模型列表。
    enabled_models: Vec<String>,
}

/// Response for connecting and saving a provider.
///
/// 连接并保存供应商的响应。
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct ConnectAndSaveProviderResponse(
    /// Generic command response envelope.
    ///
    /// 通用命令响应包裹。
    ProviderCommandResponse<ConnectAndSaveProviderResponseData>,
);

impl ConnectAndSaveProviderResponse {
    /// Creates a successful response with model data.
    ///
    /// 创建带模型数据的成功响应。
    pub(in crate::core::bot) fn success(
        available_models: Vec<String>,
        enabled_models: Vec<String>,
    ) -> Self {
        Self(ProviderCommandResponse::success_with(
            ConnectAndSaveProviderResponseData {
                available_models,
                enabled_models,
            },
        ))
    }
}
