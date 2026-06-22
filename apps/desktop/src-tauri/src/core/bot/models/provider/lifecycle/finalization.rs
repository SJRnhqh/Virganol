// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/finalization.rs
use super::super::{ProviderError, ProviderRecord};

/// Single-provider result produced after health check post-processing.
///
/// 单个 Provider 健康检查后处理后的结果。
pub(in crate::core::bot) enum ProviderCheckFinalization {
    /// Online provider finalization with optional reconciliation error.
    ///
    /// 在线 Provider 的后处理结果，可携带协调错误。
    Online {
        /// Provider record used for status event emission.
        ///
        /// 用于状态事件推送的 Provider 配置。
        status_record: ProviderRecord,
        /// Structural error raised while reconciling local provider state.
        ///
        /// 协调本地 Provider 状态时产生的结构性错误。
        reconciliation_error: Option<ProviderError>,
    },
    /// Offline provider finalization.
    ///
    /// 离线 Provider 的后处理结果。
    Offline {
        /// Provider record used for status event emission.
        ///
        /// 用于状态事件推送的 Provider 配置。
        status_record: ProviderRecord,
    },
}

impl ProviderCheckFinalization {
    /// Creates a finalization result for an online provider.
    ///
    /// 创建在线 Provider 的后处理结果。
    pub(in crate::core::bot) fn online(
        status_record: ProviderRecord,
        reconciliation_error: Option<ProviderError>,
    ) -> Self {
        Self::Online {
            status_record,
            reconciliation_error,
        }
    }

    /// Creates a finalization result for an offline provider.
    ///
    /// 创建离线 Provider 的后处理结果。
    pub(in crate::core::bot) fn offline(status_record: ProviderRecord) -> Self {
        Self::Offline { status_record }
    }

    /// Consumes the finalization into status emission data.
    ///
    /// 消费后处理结果并返回状态推送所需数据。
    pub(in crate::core::bot) fn into_parts(self) -> (ProviderRecord, bool, Option<ProviderError>) {
        match self {
            Self::Online {
                status_record,
                reconciliation_error,
            } => (status_record, true, reconciliation_error),
            Self::Offline { status_record } => (status_record, false, None),
        }
    }
}
