// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/reset.rs
use serde::{Deserialize, Serialize};

use super::super::super::{ProviderAppError, ProviderId};
use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request for resetting a provider.
///
/// 重置 Provider 的请求。
#[derive(Deserialize)]
#[serde(transparent)]
pub(crate) struct ResetProviderRequest(ProviderCommandRequest);

impl ResetProviderRequest {
    /// Consumes the request into its target provider.
    ///
    /// 消费请求并返回目标 provider。
    pub(in crate::core::bot) fn into_provider_id(self) -> ProviderId {
        let (provider_id, _) = self.0.into_parts();
        provider_id
    }
}

/// Response for resetting a provider.
///
/// 重置 Provider 的响应。
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct ResetProviderResponse(ProviderCommandResponse);

impl ResetProviderResponse {
    /// Creates a successful response.
    ///
    /// 创建成功响应。
    pub(in crate::core::bot) fn success() -> Self {
        Self(ProviderCommandResponse::success())
    }

    /// Creates a failed response with a boundary error.
    ///
    /// 创建带边界错误的失败响应。
    pub(in crate::core::bot) fn failure(error: ProviderAppError) -> Self {
        Self(ProviderCommandResponse::failure(error))
    }
}
