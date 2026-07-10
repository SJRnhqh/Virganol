// apps/desktop/src-tauri/src/core/bot/models/provider/contract/base/request.rs
use serde::Deserialize;

use super::super::super::ProviderId;

/// Internal generic request envelope for Provider command payloads.
///
/// 供应商命令载荷的内部通用请求包裹。
#[derive(Deserialize)]
#[serde(rename_all = "camelCase", bound(deserialize = "T: Deserialize<'de>"))]
pub(in crate::core::bot::models::provider::contract) struct ProviderCommandRequest<T = ()> {
    /// Target provider for this command request.
    ///
    /// 当前命令请求的目标供应商。
    provider_id: ProviderId,

    /// Optional operation-specific data section.
    ///
    /// 命令请求中的可选操作数据区块。
    #[serde(default)]
    data: Option<T>,
}

impl<T> ProviderCommandRequest<T> {
    /// Consumes the request envelope into its target provider and optional data.
    ///
    /// 消费请求包裹并返回目标供应商与可选操作数据。
    pub(in crate::core::bot::models::provider::contract) fn into_parts(
        self,
    ) -> (ProviderId, Option<T>) {
        (self.provider_id, self.data)
    }
}
