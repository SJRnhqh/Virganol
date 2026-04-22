// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/update.rs
use serde::Deserialize;

use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Data payload for updating enabled models.
///
/// 更新已启用模型列表的数据载荷。
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct UpdateEnabledModelsData {
    pub(crate) enabled_models: Vec<String>,
}

/// Request for updating enabled models.
///
/// 更新已启用模型列表的请求。
pub(crate) type UpdateEnabledModelsRequest = ProviderCommandRequest<UpdateEnabledModelsData>;

/// Response for updating enabled models.
///
/// 更新已启用模型列表的响应。
pub(crate) type UpdateEnabledModelsResponse = ProviderCommandResponse;
