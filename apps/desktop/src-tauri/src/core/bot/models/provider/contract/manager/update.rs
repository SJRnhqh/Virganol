// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/update.rs
use serde::Deserialize;

use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request data for updating enabled models.
///
/// 更新已启用模型列表的请求数据。
#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub(crate) struct UpdateEnabledModelsRequestData {
    #[serde(default)]
    pub(crate) enabled_models: Vec<String>,
}

/// Request for updating enabled models.
///
/// 更新已启用模型列表的请求。
pub(crate) type UpdateEnabledModelsRequest = ProviderCommandRequest<UpdateEnabledModelsRequestData>;

/// Response for updating enabled models.
///
/// 更新已启用模型列表的响应。
pub(crate) type UpdateEnabledModelsResponse = ProviderCommandResponse;
