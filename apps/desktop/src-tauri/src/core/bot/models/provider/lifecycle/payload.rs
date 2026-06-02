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
pub(in crate::core::bot) struct ProviderCheckStartedPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    run_id: &'a str,
    /// Trigger source for this provider check lifecycle.
    ///
    /// 本轮 Provider 检查生命周期的触发来源。
    trigger: &'a ProviderCheckTrigger,
}

impl<'a> ProviderCheckStartedPayload<'a> {
    /// Creates a lifecycle started event payload.
    ///
    /// 创建生命周期 started 事件载荷。
    pub(in crate::core::bot) fn new(run_id: &'a str, trigger: &'a ProviderCheckTrigger) -> Self {
        Self { run_id, trigger }
    }
}

/// Event payload emitted for one provider check status during a lifecycle run.
///
/// 一轮 Provider 检查中，逐个推送给前端的状态事件载荷。
#[derive(Serialize)]
pub(in crate::core::bot) struct ProviderCheckStatusPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    run_id: &'a str,
    /// Provider that owns this status update.
    ///
    /// 当前状态所属的 Provider。
    provider: ProviderId,
    /// Persisted provider config snapshot used for this status update.
    ///
    /// 当前 Provider 的已持久化配置快照。
    config: ProviderRecord,
    /// Health check result for this provider.
    ///
    /// 当前 Provider 的健康检查结果。
    health: HealthCheckResult,
    /// Sanitized provider key metadata resolved for this check.
    ///
    /// 当前 Provider 的去敏密钥元信息。
    key_meta: ProviderKeyMeta,
}

impl<'a> ProviderCheckStatusPayload<'a> {
    /// Creates a single-provider lifecycle status event payload.
    ///
    /// 创建单个 Provider 生命周期状态事件载荷。
    pub(in crate::core::bot) fn new(
        run_id: &'a str,
        provider: ProviderId,
        config: ProviderRecord,
        health: HealthCheckResult,
        key_meta: ProviderKeyMeta,
    ) -> Self {
        Self {
            run_id,
            provider,
            config,
            health,
            key_meta,
        }
    }
}

/// Event payload emitted when one provider check lifecycle completes.
///
/// 一轮 Provider 检查正常结束时推送给前端的事件载荷。
#[derive(Serialize)]
pub(in crate::core::bot) struct ProviderCheckCompletedPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    run_id: &'a str,
    /// Number of provider health checks that failed in this lifecycle run.
    ///
    /// 本轮生命周期中健康检查失败的 Provider 数量。
    failed: usize,
}

impl<'a> ProviderCheckCompletedPayload<'a> {
    /// Creates a lifecycle completed event payload.
    ///
    /// 创建生命周期 completed 事件载荷。
    pub(in crate::core::bot) fn new(run_id: &'a str, failed: usize) -> Self {
        Self { run_id, failed }
    }
}

/// Event payload emitted when one provider check lifecycle fails.
///
/// 一轮 Provider 检查异常终止时推送给前端的事件载荷。
#[derive(Serialize)]
pub(in crate::core::bot) struct ProviderCheckFailedPayload<'a> {
    /// Borrowed run identifier used to correlate events in one lifecycle run.
    ///
    /// 借用的本轮检查唯一标识，用于关联同一生命周期内的事件。
    run_id: &'a str,
    /// Structured error code for this lifecycle failure.
    ///
    /// 本轮生命周期失败的结构化错误码。
    code: ProviderErrorCode,
    /// Error message used for frontend display or logging.
    ///
    /// 面向前端展示或日志记录的错误信息。
    message: String,
    /// Provider-level issues returned when failures can be attributed to providers.
    ///
    /// Provider 级问题列表；仅在存在可定位到具体 Provider 的问题时返回。
    #[serde(skip_serializing_if = "Option::is_none")]
    issues: Option<&'a [ProviderIssue]>,
}

impl<'a> ProviderCheckFailedPayload<'a> {
    /// Creates a lifecycle failed event payload.
    ///
    /// 创建生命周期 failed 事件载荷。
    pub(in crate::core::bot) fn new(
        run_id: &'a str,
        code: ProviderErrorCode,
        message: String,
        issues: Option<&'a [ProviderIssue]>,
    ) -> Self {
        Self {
            run_id,
            code,
            message,
            issues,
        }
    }
}
