// apps/desktop/src-tauri/src/core/bot/models/provider/contract/base/request.rs
use serde::Deserialize;

use super::super::super::ProviderId;

/// Generic request structure for Provider commands.
///
/// Provider 命令的通用请求结构。
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderCommandRequest<T> {
    /// Target provider ID.
    ///
    /// 目标 Provider ID。
    pub(crate) provider_id: ProviderId,

    /// Operation-specific payload.
    ///
    /// 特定操作的载荷数据。
    pub(crate) data: T,
}
