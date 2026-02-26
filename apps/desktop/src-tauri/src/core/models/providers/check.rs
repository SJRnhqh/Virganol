// apps/desktop/src-tauri/src/core/models/providers/check.rs
// 外部依赖
use serde::{Deserialize, Serialize};

// 内部引用
use crate::core::models::providers::id::ProviderId;
use crate::core::models::providers::error::{ProviderErrorCode, ProviderIssue};
use crate::core::models::security::ProviderSecretMeta;
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
/// Provider 检查任务的触发来源。
pub enum ProviderCheckTrigger {
    /// 应用启动后的自动检查。
    Startup,
    /// 用户手动发起的全量刷新检查。
    ManualRefresh,
}

impl ProviderCheckTrigger {
    /// 生命周期 run_id 中使用的触发来源标签。
    pub fn as_tag(self) -> &'static str {
        match self {
            Self::Startup => "startup",
            Self::ManualRefresh => "manual_refresh",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
/// 一轮 Provider 检查开始时推送给前端的事件载荷。
pub struct ProviderCheckStartedPayload {
    /// 本轮检查唯一标识，用于关联 started/status/completed 事件。
    pub run_id: String,
    /// 本轮检查的触发来源。
    pub trigger: ProviderCheckTrigger,
    /// 本轮实际要检查的“已支持” Provider 数量。
    pub total: usize,
    /// 持久化配置中读取到的 Provider 总数（包含不支持项）。
    pub loaded_total: usize,
    /// 持久化配置中被跳过的不支持 Provider 数量。
    pub skipped_total: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
/// 一轮 Provider 检查中，逐个推送给前端的状态事件载荷。
pub struct ProviderStatusPayload {
    /// 本轮检查唯一标识，用于关联 started/status/completed 事件。
    pub run_id: String,
    /// 当前状态所属的 Provider。
    pub provider: ProviderId,
    /// 当前 Provider 的已持久化配置快照。
    pub config: ProviderRecord,
    /// 当前 Provider 的健康检查结果。
    pub health: HealthCheckResponse,
    /// 当前 Provider 的去敏密钥元信息。
    pub secret_meta: ProviderSecretMeta,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
/// 一轮 Provider 检查正常结束时推送给前端的事件载荷。
pub struct ProviderCheckCompletedPayload {
    /// 本轮检查唯一标识，用于关联 started/status/completed 事件。
    pub run_id: String,
    /// 本轮检查的触发来源。
    pub trigger: ProviderCheckTrigger,
    /// 本轮已处理的 Provider 数量。
    pub processed: usize,
    /// 本轮健康检查成功数量。
    pub succeeded: usize,
    /// 本轮健康检查失败数量。
    pub failed: usize,
    /// 本轮检查耗时（毫秒）。
    pub duration_ms: u64,
}

/// 一轮 Provider 检查的聚合统计信息。
#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProviderCheckStats {
    /// 本轮已处理的 Provider 数量。
    pub processed: usize,
    /// 本轮健康检查成功数量。
    pub succeeded: usize,
    /// 本轮健康检查失败数量。
    pub failed: usize,
}

impl ProviderCheckStats {
    /// 按单次检查结果累计统计。
    pub fn record(&mut self, success: bool) {
        self.processed += 1;
        if success {
            self.succeeded += 1;
        } else {
            self.failed += 1;
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
/// 一轮 Provider 检查异常终止时推送给前端的事件载荷。
pub struct ProviderCheckFailedPayload {
    /// 本轮检查唯一标识，用于关联 started/status/failed 事件。
    pub run_id: String,
    /// 本轮检查的触发来源。
    pub trigger: ProviderCheckTrigger,
    /// 结构化错误码。
    pub code: ProviderErrorCode,
    /// 面向前端展示或日志记录的错误信息。
    pub message: String,
    /// Provider 级问题列表；仅在存在可定位到具体 Provider 的问题时返回。
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub issues: Option<Vec<ProviderIssue>>,
}
