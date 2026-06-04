// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/run.rs
use super::super::{ProviderError, ProviderIssue};

/// Result produced by one provider check runner execution.
///
/// 一轮 Provider 检查 runner 执行后产生的结果。
pub(in crate::core::bot) struct ProviderCheckRunResult {
    /// Number of provider health checks that failed in this runner execution.
    ///
    /// 本轮 runner 执行中健康检查失败的 Provider 数量。
    failed_count: usize,
    /// Provider-level issues collected during result reconciliation or status emission.
    ///
    /// 结果协调或状态事件推送期间收集的 Provider 级问题。
    provider_issues: Vec<ProviderIssue>,
    /// First join-level error captured from concurrent provider check tasks.
    ///
    /// 并发 Provider 检查任务中捕获到的首个 join 层错误。
    join_error: Option<ProviderError>,
}

impl ProviderCheckRunResult {
    /// Creates a provider check run result.
    ///
    /// 创建 Provider 检查 runner 结果。
    pub(in crate::core::bot) fn new(
        failed_count: usize,
        provider_issues: Vec<ProviderIssue>,
        join_error: Option<ProviderError>,
    ) -> Self {
        Self {
            failed_count,
            provider_issues,
            join_error,
        }
    }

    /// Consumes the result into lifecycle completion data.
    ///
    /// 消费 runner 结果并返回生命周期完成处理所需数据。
    pub(in crate::core::bot) fn into_parts(
        self,
    ) -> (usize, Vec<ProviderIssue>, Option<ProviderError>) {
        (self.failed_count, self.provider_issues, self.join_error)
    }
}
