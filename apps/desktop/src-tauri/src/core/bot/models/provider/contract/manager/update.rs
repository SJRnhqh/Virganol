// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/update.rs
use serde::{Deserialize, Serialize};

use super::super::super::ProviderId;
use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request data for updating enabled models.
///
/// 更新已启用模型列表的请求数据。
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(in crate::core::bot) struct UpdateEnabledModelsRequestData {
    /// Model identifiers to persist as enabled for the target provider.
    ///
    /// 要为目标供应商持久化为启用状态的模型标识列表。
    #[serde(default)]
    enabled_models: Vec<String>,
}

impl UpdateEnabledModelsRequestData {
    /// Consumes the request data and returns enabled model identifiers.
    ///
    /// 消费请求数据并返回已启用模型标识列表。
    pub(in crate::core::bot) fn into_enabled_models(self) -> Vec<String> {
        self.enabled_models
    }
}

/// Request for updating enabled models.
///
/// 更新已启用模型列表的请求。
#[derive(Deserialize)]
#[serde(transparent)]
pub(crate) struct UpdateEnabledModelsRequest(
    /// Generic command request envelope.
    ///
    /// 通用命令请求包裹。
    ProviderCommandRequest<UpdateEnabledModelsRequestData>,
);

impl UpdateEnabledModelsRequest {
    /// Consumes the request into its target provider and enabled-model data.
    ///
    /// 消费请求并返回目标供应商与已启用模型数据。
    pub(in crate::core::bot) fn into_parts(
        self,
    ) -> (ProviderId, Option<UpdateEnabledModelsRequestData>) {
        self.0.into_parts()
    }
}

/// Response for updating enabled models.
///
/// 更新已启用模型列表的响应。
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct UpdateEnabledModelsResponse(
    /// Generic command response envelope.
    ///
    /// 通用命令响应包裹。
    ProviderCommandResponse,
);

impl UpdateEnabledModelsResponse {
    /// Creates a successful response.
    ///
    /// 创建成功响应。
    pub(in crate::core::bot) fn success() -> Self {
        Self(ProviderCommandResponse::success())
    }
}
