// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/run.rs
use super::super::{ProviderError, ProviderIssue};

/// Result produced by one provider check runner execution.
///
/// 一轮 Provider 检查 runner 执行后产生的结果。
pub(crate) struct ProviderCheckRunResult {
    /// Number of provider health checks that failed in this runner execution.
    ///
    /// 本轮 runner 执行中健康检查失败的 Provider 数量。
    pub(crate) failed_count: usize,
    /// Provider-level issues collected during result reconciliation or status emission.
    ///
    /// 结果协调或状态事件推送期间收集的 Provider 级问题。
    pub(crate) provider_issues: Vec<ProviderIssue>,
    /// First join-level error captured from concurrent provider check tasks.
    ///
    /// 并发 Provider 检查任务中捕获到的首个 join 层错误。
    pub(crate) join_error: Option<ProviderError>,
}
