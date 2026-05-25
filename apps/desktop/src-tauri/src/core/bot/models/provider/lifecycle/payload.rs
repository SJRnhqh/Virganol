// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/payload.rs
use serde::{Deserialize, Serialize};

use super::ProviderCheckTrigger;
use crate::core::bot::models::provider::{
    HealthCheckResult, ProviderErrorCode, ProviderId, ProviderIssue, ProviderRecord,
    ProviderSecretMeta,
};

#[derive(Serialize)]
/// 一轮 Provider 检查开始时推送给前端的事件载荷。
pub(crate) struct ProviderCheckStartedPayload<'a> {
    /// 本轮检查唯一标识，用于关联 started/status/completed 事件。
    pub(crate) run_id: String,
    /// 本轮检查的触发来源。
    pub(crate) trigger: &'a ProviderCheckTrigger,
}

#[derive(Serialize)]
/// 一轮 Provider 检查中，逐个推送给前端的状态事件载荷。
pub(crate) struct ProviderStatusPayload {
    /// 本轮检查唯一标识，用于关联 started/status/completed 事件。
    pub(crate) run_id: String,
    /// 当前状态所属的 Provider。
    pub(crate) provider: ProviderId,
    /// 当前 Provider 的已持久化配置快照。
    pub(crate) config: ProviderRecord,
    /// 当前 Provider 的健康检查结果。
    pub(crate) health: HealthCheckResult,
    /// 当前 Provider 的去敏密钥元信息。
    pub(crate) secret_meta: ProviderSecretMeta,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
/// 一轮 Provider 检查正常结束时推送给前端的事件载荷。
pub(crate) struct ProviderCheckCompletedPayload {
    /// 本轮检查唯一标识，用于关联 started/status/completed 事件。
    pub(crate) run_id: String,
    /// 本轮健康检查失败数量。
    pub(crate) failed: usize,
}

#[derive(Serialize)]
/// 一轮 Provider 检查异常终止时推送给前端的事件载荷。
pub(crate) struct ProviderCheckFailedPayload<'a> {
    /// 本轮检查唯一标识，用于关联 started/status/failed 事件。
    pub(crate) run_id: String,
    /// 结构化错误码。
    pub(crate) code: ProviderErrorCode,
    /// 面向前端展示或日志记录的错误信息。
    pub(crate) message: String,
    /// Provider 级问题列表；仅在存在可定位到具体 Provider 的问题时返回。
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub(crate) issues: Option<&'a [ProviderIssue]>,
}
