// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/reset.rs
use serde::{Deserialize, Serialize};

use super::super::super::ProviderId;
use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request for resetting a provider.
///
/// 重置供应商的请求。
#[derive(Deserialize)]
#[serde(transparent)]
pub(crate) struct ResetProviderRequest(
    /// Generic command request envelope.
    ///
    /// 通用命令请求包裹。
    ProviderCommandRequest,
);

impl ResetProviderRequest {
    /// Consumes the request into its target provider.
    ///
    /// 消费请求并返回目标供应商。
    pub(in crate::core::bot) fn into_provider_id(self) -> ProviderId {
        let (provider_id, _) = self.0.into_parts();
        provider_id
    }
}

/// Response for resetting a provider.
///
/// 重置供应商的响应。
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct ResetProviderResponse(
    /// Generic command response envelope.
    ///
    /// 通用命令响应包裹。
    ProviderCommandResponse,
);

impl ResetProviderResponse {
    /// Creates a successful response.
    ///
    /// 创建成功响应。
    pub(in crate::core::bot) fn success() -> Self {
        Self(ProviderCommandResponse::success())
    }
}
