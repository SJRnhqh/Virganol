// apps/desktop/src-tauri/src/core/bot/models/provider/context/execution.rs
use super::super::ProviderId;
use super::{ProviderContext, ProviderErrorContext, ProviderExecutionOperation, ProviderStage};

/// Execution business context fields.
///
/// 执行业务上下文字段。
struct ExecutionExtra {
    /// Provider targeted by this execution.
    ///
    /// 当前执行链路目标 Provider。
    provider_id: ProviderId,
    /// Provider execution operation currently being executed.
    ///
    /// 当前正在执行的 Provider 执行操作。
    operation: ProviderExecutionOperation,
}

/// Provider execution domain business context.
///
/// Provider 领域执行业务上下文。
pub(in crate::core::bot) struct ProviderExecutionContext(ProviderContext<ExecutionExtra>);

impl ProviderExecutionContext {
    /// Derives this execution context at the connection stage.
    ///
    /// 将当前执行上下文派生到连接阶段。
    pub(in crate::core::bot) fn at_connection(self) -> Self {
        Self(self.0.at_connection())
    }

    /// Derives this execution context at the config-store stage.
    ///
    /// 将当前执行上下文派生到配置存储阶段。
    pub(in crate::core::bot) fn at_config_store(self) -> Self {
        Self(self.0.at_config_store())
    }

    /// Derives this execution context at the secret-store stage.
    ///
    /// 将当前执行上下文派生到密钥存储阶段。
    pub(in crate::core::bot) fn at_secret_store(self) -> Self {
        Self(self.0.at_secret_store())
    }

    /// Projects this execution context into an error attribution snapshot.
    ///
    /// 将当前执行上下文投影为错误归因快照。
    pub(in crate::core::bot) fn error_context(&self) -> ProviderErrorContext {
        self.0
            .error_context()
            .with_provider(self.0.extra().provider_id)
    }

    /// Creates an execution context from a provider execution operation.
    ///
    /// 基于 Provider 执行操作创建执行上下文。
    pub(super) fn from_operation(
        stage: ProviderStage,
        provider_id: ProviderId,
        operation: ProviderExecutionOperation,
    ) -> Self {
        Self::new(stage, provider_id, operation)
    }

    /// Centralizes execution context construction.
    ///
    /// 集中创建执行上下文。
    fn new(
        stage: ProviderStage,
        provider_id: ProviderId,
        operation: ProviderExecutionOperation,
    ) -> Self {
        Self(ProviderContext::new(
            stage,
            ExecutionExtra {
                provider_id,
                operation,
            },
        ))
    }
}
