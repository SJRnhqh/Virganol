// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/payload.rs
use serde::Serialize;

use super::super::{
    HealthCheckResult, ProviderErrorCode, ProviderId, ProviderIssue, ProviderKeyMeta,
    ProviderRecord,
};
use super::ProviderCheckTrigger;

/// Event payload emitted when one provider check lifecycle starts.
///
/// 一轮 Provider 检查开始时推送给前端的事件载荷。
#[derive(Serialize)]
pub(crate) struct ProviderCheckStartedPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    pub(crate) run_id: &'a str,
    /// Trigger source for this provider check lifecycle.
    ///
    /// 本轮 Provider 检查生命周期的触发来源。
    pub(crate) trigger: &'a ProviderCheckTrigger,
}

/// Event payload emitted for one provider check status during a lifecycle run.
///
/// 一轮 Provider 检查中，逐个推送给前端的状态事件载荷。
#[derive(Serialize)]
pub(crate) struct ProviderCheckStatusPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    pub(crate) run_id: &'a str,
    /// Provider that owns this status update.
    ///
    /// 当前状态所属的 Provider。
    pub(crate) provider: ProviderId,
    /// Persisted provider config snapshot used for this status update.
    ///
    /// 当前 Provider 的已持久化配置快照。
    pub(crate) config: ProviderRecord,
    /// Health check result for this provider.
    ///
    /// 当前 Provider 的健康检查结果。
    pub(crate) health: HealthCheckResult,
    /// Sanitized provider key metadata resolved for this check.
    ///
    /// 当前 Provider 的去敏密钥元信息。
    pub(crate) key_meta: ProviderKeyMeta,
}

/// Event payload emitted when one provider check lifecycle completes.
///
/// 一轮 Provider 检查正常结束时推送给前端的事件载荷。
#[derive(Serialize)]
pub(crate) struct ProviderCheckCompletedPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    pub(crate) run_id: &'a str,
    /// Number of provider health checks that failed in this lifecycle run.
    ///
    /// 本轮生命周期中健康检查失败的 Provider 数量。
    pub(crate) failed: usize,
}

/// Event payload emitted when one provider check lifecycle fails.
///
/// 一轮 Provider 检查异常终止时推送给前端的事件载荷。
#[derive(Serialize)]
pub(crate) struct ProviderCheckFailedPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    pub(crate) run_id: &'a str,
    /// Structured error code for this lifecycle failure.
    ///
    /// 本轮生命周期失败的结构化错误码。
    pub(crate) code: ProviderErrorCode,
    /// Error message used for frontend display or logging.
    ///
    /// 面向前端展示或日志记录的错误信息。
    pub(crate) message: String,
    /// Provider-level issues returned when failures can be attributed to providers.
    ///
    /// Provider 级问题列表；仅在存在可定位到具体 Provider 的问题时返回。
    #[serde(skip_serializing_if = "Option::is_none")]
    pub(crate) issues: Option<&'a [ProviderIssue]>,
}
