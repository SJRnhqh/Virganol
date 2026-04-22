// apps/desktop/src-tauri/src/core/bot/models/provider/contract/update.rs
use serde::Deserialize;

use super::super::ProviderId;
use super::ProviderCommandResponse;

/// Request payload for updating enabled models.
///
/// 更新已启用模型列表的请求载荷。
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct UpdateEnabledModelsRequest {
    pub provider_id: ProviderId,
    pub enabled_models: Vec<String>,
}

/// Response for updating enabled models.
///
/// 更新已启用模型列表的响应。
pub(crate) type UpdateEnabledModelsResponse = ProviderCommandResponse;
