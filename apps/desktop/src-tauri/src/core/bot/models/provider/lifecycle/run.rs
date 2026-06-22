// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/run.rs
use super::super::ProviderError;

/// Result produced by one provider check runner execution.
///
/// 一轮 Provider 检查 runner 执行后产生的结果。
pub(in crate::core::bot) struct ProviderCheckRunResult {
    /// Number of provider health checks that failed in this runner execution.
    ///
    /// 本轮 runner 执行中健康检查失败的 Provider 数量。
    failed_count: usize,
    /// First join-level error captured from concurrent provider check tasks.
    ///
    /// 并发 Provider 检查任务中捕获到的首个 join 层错误。
    join_error: Option<ProviderError>,
    /// Suppressed provider errors collected during result reconciliation or status emission.
    ///
    /// 结果协调或状态事件推送期间收集的被抑制 Provider 错误。
    suppressed_errors: Vec<ProviderError>,
}

impl ProviderCheckRunResult {
    /// Creates a provider check run result.
    ///
    /// 创建 Provider 检查 runner 结果。
    pub(in crate::core::bot) fn new(
        failed_count: usize,
        join_error: Option<ProviderError>,
        suppressed_errors: Vec<ProviderError>,
    ) -> Self {
        Self {
            failed_count,
            join_error,
            suppressed_errors,
        }
    }

    /// Consumes the result into lifecycle completion data.
    ///
    /// 消费 runner 结果并返回生命周期完成处理所需数据。
    pub(in crate::core::bot) fn into_parts(
        self,
    ) -> (usize, Option<ProviderError>, Vec<ProviderError>) {
        (self.failed_count, self.join_error, self.suppressed_errors)
    }
}
