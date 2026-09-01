// apps/desktop/src-tauri/src/core/bot/models/provider/trace/span.rs
use tracing::{info_span, Span};

use super::super::super::super::{
    PROVIDER_EXECUTION_SPAN, PROVIDER_LIFECYCLE_SPAN, PROVIDER_MANAGER_SPAN,
};
use super::super::{
    ProviderAttribution, ProviderExecutionContext, ProviderLifecycleContext, ProviderManagerContext,
};

/// Structured tracing span factory for Provider business executions.
///
/// 供应商业务执行的结构化追踪 Span 工厂。
pub(in crate::core::bot) struct ProviderSpan;

impl ProviderSpan {
    /// Creates a span for interactive provider management business.
    ///
    /// 创建交互式供应商管理业务的 Span。
    pub(in crate::core::bot) fn manager(ctx: &ProviderManagerContext) -> Span {
        let attribution = ProviderAttribution::from(ctx);
        let (stage, subject, operation) = attribution.as_parts();

        info_span!(
            PROVIDER_MANAGER_SPAN,
            attribution_stage = %stage,
            attribution_subject = %subject,
            attribution_operation = %operation,
        )
    }

    /// Creates a span for provider lifecycle check business.
    ///
    /// 创建供应商生命周期检查业务的 Span。
    pub(in crate::core::bot) fn lifecycle(ctx: &ProviderLifecycleContext<'_>) -> Span {
        let attribution = ProviderAttribution::from(ctx);
        let (stage, subject, operation) = attribution.as_parts();

        info_span!(
            PROVIDER_LIFECYCLE_SPAN,
            attribution_stage = %stage,
            attribution_subject = %subject,
            attribution_operation = %operation,
            run_id = ctx.run_id(),
            trigger = ctx.trigger().as_tag(),
        )
    }

    /// Creates a span for provider execution business.
    ///
    /// 创建供应商执行业务的 Span。
    pub(in crate::core::bot) fn execution(ctx: &ProviderExecutionContext) -> Span {
        let attribution = ProviderAttribution::from(ctx);
        let (stage, subject, operation) = attribution.as_parts();

        info_span!(
            PROVIDER_EXECUTION_SPAN,
            attribution_stage = %stage,
            attribution_subject = %subject,
            attribution_operation = %operation,
        )
    }
}
