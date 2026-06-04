// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/finalization.rs
use super::super::{ProviderError, ProviderRecord};

/// Single-provider result produced after health check post-processing.
///
/// 单个 Provider 健康检查后处理后的结果。
pub(in crate::core::bot) struct ProviderCheckFinalization {
    /// Provider record used for status event emission.
    ///
    /// 用于状态事件推送的 Provider 配置。
    status_record: ProviderRecord,
    /// Whether the provider health check succeeded.
    ///
    /// 当前 Provider 健康检查是否成功。
    online: bool,
    /// Structural error raised while reconciling local provider state.
    ///
    /// 协调本地 Provider 状态时产生的结构性错误。
    reconciliation_error: Option<ProviderError>,
}

impl ProviderCheckFinalization {
    /// Creates a finalization result for an online provider.
    ///
    /// 创建在线 Provider 的后处理结果。
    pub(in crate::core::bot) fn online(
        status_record: ProviderRecord,
        reconciliation_error: Option<ProviderError>,
    ) -> Self {
        Self {
            status_record,
            online: true,
            reconciliation_error,
        }
    }

    /// Creates a finalization result for an offline provider.
    ///
    /// 创建离线 Provider 的后处理结果。
    pub(in crate::core::bot) fn offline(status_record: ProviderRecord) -> Self {
        Self {
            status_record,
            online: false,
            reconciliation_error: None,
        }
    }

    /// Consumes the finalization into status emission data.
    ///
    /// 消费后处理结果并返回状态推送所需数据。
    pub(in crate::core::bot) fn into_parts(self) -> (ProviderRecord, bool, Option<ProviderError>) {
        (self.status_record, self.online, self.reconciliation_error)
    }
}
