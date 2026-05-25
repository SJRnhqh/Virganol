// apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager/update.rs
use serde::Deserialize;

use super::super::{ProviderCommandRequest, ProviderCommandResponse};

/// Request data for updating enabled models.
///
/// 更新已启用模型列表的请求数据。
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct UpdateEnabledModelsRequestData {
    /// Model identifiers to persist as enabled for the target provider.
    ///
    /// 要为目标 Provider 持久化为启用状态的模型标识列表。
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
