// apps/desktop/src-tauri/src/core/bot/models/provider/trace/span.rs
use tracing::{info_span, Span};

use super::super::super::super::{
    PROVIDER_EXECUTION_SPAN, PROVIDER_LIFECYCLE_SPAN, PROVIDER_MANAGER_SPAN,
};
use super::super::{
    ProviderAttribution, ProviderExecutionContext, ProviderLifecycleContext, ProviderManagerContext,
};

/// Creates a Provider span carrying the shared attribution fields plus optional extra fields.
///
/// 创建携带共享归因字段与可选附加字段的供应商 Span。
macro_rules! attributed_span {
    ($name:expr, $attribution:expr $(, $($fields:tt)*)?) => {{
        let attribution: ProviderAttribution = $attribution;
        let (stage, subject, operation) = attribution.as_parts();

        info_span!(
            $name,
            attribution_stage = %stage,
            attribution_subject = %subject,
            attribution_operation = %operation
            $(, $($fields)*)?
        )
    }};
}

/// Structured tracing span factory for Provider business executions.
///
/// 供应商业务执行的结构化追踪 Span 工厂。
pub(in crate::core::bot) struct ProviderSpan;

impl ProviderSpan {
    /// Creates a span for interactive provider management business.
    ///
    /// 创建交互式供应商管理业务的 Span。
    pub(in crate::core::bot) fn manager(ctx: &ProviderManagerContext) -> Span {
        attributed_span!(PROVIDER_MANAGER_SPAN, ctx.into())
    }

    /// Creates a span for provider lifecycle check business.
    ///
    /// 创建供应商生命周期检查业务的 Span。
    pub(in crate::core::bot) fn lifecycle(ctx: &ProviderLifecycleContext<'_>) -> Span {
        attributed_span!(
            PROVIDER_LIFECYCLE_SPAN,
            ctx.into(),
            run_id = ctx.run_id(),
            trigger = %ctx.trigger(),
        )
    }

    /// Creates a span for provider execution business.
    ///
    /// 创建供应商执行业务的 Span。
    pub(in crate::core::bot) fn execution(ctx: &ProviderExecutionContext) -> Span {
        attributed_span!(PROVIDER_EXECUTION_SPAN, ctx.into())
    }
}
