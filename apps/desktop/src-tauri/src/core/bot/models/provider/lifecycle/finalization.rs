// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/finalization.rs
use super::super::{ProviderError, ProviderRecord};

/// Single-provider result produced after health check post-processing.
///
/// 单个 Provider 健康检查后处理后的结果。
pub(crate) struct ProviderCheckFinalization {
    /// Provider record used for status event emission.
    ///
    /// 用于状态事件推送的 Provider 配置。
    pub(crate) status_record: ProviderRecord,
    /// Whether the provider health check succeeded.
    ///
    /// 当前 Provider 健康检查是否成功。
    pub(crate) online: bool,
    /// Structural error raised while reconciling local provider state.
    ///
    /// 协调本地 Provider 状态时产生的结构性错误。
    pub(crate) reconcile_error: Option<ProviderError>,
}

impl ProviderCheckFinalization {
    /// Creates a finalization result for an online provider.
    ///
    /// 创建在线 Provider 的后处理结果。
    pub(crate) fn online(
        status_record: ProviderRecord,
        reconcile_error: Option<ProviderError>,
    ) -> Self {
        Self {
            status_record,
            online: true,
            reconcile_error,
        }
    }

    /// Creates a finalization result for an offline provider.
    ///
    /// 创建离线 Provider 的后处理结果。
    pub(crate) fn offline(status_record: ProviderRecord) -> Self {
        Self {
            status_record,
            online: false,
            reconcile_error: None,
        }
    }
}
