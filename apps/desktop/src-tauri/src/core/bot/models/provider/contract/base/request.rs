// apps/desktop/src-tauri/src/core/bot/models/provider/contract/base/request.rs
use serde::Deserialize;

use super::super::super::ProviderId;

/// Internal generic request envelope for Provider commands.
///
/// Provider 命令的内部通用请求包裹。
#[derive(Deserialize)]
#[serde(rename_all = "camelCase", bound(deserialize = "T: Deserialize<'de>"))]
pub(in crate::core::bot::models::provider::contract) struct ProviderCommandRequest<T = ()> {
    /// Target provider ID.
    ///
    /// 目标 Provider ID。
    provider_id: ProviderId,

    /// Operation-specific payload.
    ///
    /// 特定操作的载荷数据。
    #[serde(default)]
    data: Option<T>,
}

impl<T> ProviderCommandRequest<T> {
    /// Consumes the request envelope into its provider id and payload.
    ///
    /// 消费请求包裹并返回 provider id 与载荷。
    pub(in crate::core::bot::models::provider::contract) fn into_parts(
        self,
    ) -> (ProviderId, Option<T>) {
        (self.provider_id, self.data)
    }
}
