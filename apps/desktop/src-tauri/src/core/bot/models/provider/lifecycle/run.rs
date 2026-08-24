// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/run.rs
use super::super::ProviderError;

/// Result produced by one provider check runner execution.
///
/// 一轮供应商检查执行后产生的结果。
pub(in crate::core::bot) struct ProviderCheckRunResult {
    /// Number of provider health checks that failed in this runner execution.
    ///
    /// 本轮执行中健康检查失败的供应商数量。
    failed_count: usize,
    /// First join-level error captured from concurrent provider check tasks.
    ///
    /// 并发供应商检查任务中捕获到的首个任务汇合层错误。
    join_error: Option<ProviderError>,
    /// Suppressed provider errors collected during result reconciliation or status emission.
    ///
    /// 结果协调或状态事件推送期间收集的被抑制供应商错误。
    suppressed_errors: Vec<ProviderError>,
}

impl ProviderCheckRunResult {
    /// Consumes the result into lifecycle completion data.
    ///
    /// 消费执行结果并返回生命周期完成处理所需数据。
    pub(in crate::core::bot) fn into_parts(
        self,
    ) -> (usize, Option<ProviderError>, Vec<ProviderError>) {
        (self.failed_count, self.join_error, self.suppressed_errors)
    }

    /// Creates a provider check run result.
    ///
    /// 创建供应商检查执行结果。
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
}
