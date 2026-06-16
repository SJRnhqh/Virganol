// apps/desktop/src-tauri/src/core/bot/models/provider/contract/lifecycle/payload.rs
use serde::Serialize;

use super::super::super::lifecycle::ProviderCheckTrigger;
use super::super::super::{
    HealthCheckResult, ProviderAppError, ProviderId, ProviderIssue, ProviderKeyMeta, ProviderRecord,
};
use super::ProviderRuntimeStatus;

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
    /// Boundary-safe runtime status for this provider.
    ///
    /// 当前 Provider 面向边界契约的运行时状态。
    status: ProviderRuntimeStatus,
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
            status: ProviderRuntimeStatus::from_parts(config, key_meta, health),
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
    /// Structured boundary error for this lifecycle failure.
    ///
    /// 本轮生命周期失败的结构化边界错误。
    error: ProviderAppError,
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
        error: ProviderAppError,
        issues: Option<&'a [ProviderIssue]>,
    ) -> Self {
        Self {
            run_id,
            error,
            issues,
        }
    }
}
