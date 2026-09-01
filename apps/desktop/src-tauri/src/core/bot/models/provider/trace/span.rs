// apps/desktop/src-tauri/src/core/bot/models/provider/trace/span.rs
use tracing::{info_span, Span};

use super::super::super::super::PROVIDER_REALITY;
use super::super::{ProviderAttribution, ProviderCheckTrigger};

/// Structured tracing span factory for Provider business executions.
///
/// 供应商业务执行的结构化追踪 Span 工厂。
#[allow(dead_code)]
pub(in crate::core::bot::models::provider) struct ProviderSpan;

#[allow(dead_code)]
impl ProviderSpan {
    /// Creates a span for an interactive Provider management execution.
    ///
    /// 创建一次交互式供应商管理执行的 Span。
    pub(in crate::core::bot::models::provider) fn manager(
        attribution: &ProviderAttribution,
    ) -> Span {
        let (stage, subject, operation) = attribution.as_parts();

        info_span!(
            PROVIDER_REALITY,
            attribution_stage = %stage,
            attribution_subject = %subject,
            attribution_operation = %operation,
        )
    }

    /// Creates a span for one Provider lifecycle check run.
    ///
    /// 创建一轮供应商生命周期检查的 Span。
    pub(in crate::core::bot::models::provider) fn lifecycle(
        attribution: &ProviderAttribution,
        run_id: &str,
        trigger: &ProviderCheckTrigger,
    ) -> Span {
        let (stage, subject, operation) = attribution.as_parts();

        info_span!(
            PROVIDER_REALITY,
            attribution_stage = %stage,
            attribution_subject = %subject,
            attribution_operation = %operation,
            run_id,
            trigger = trigger.as_tag(),
        )
    }
}
