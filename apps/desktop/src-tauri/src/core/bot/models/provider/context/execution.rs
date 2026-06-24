// apps/desktop/src-tauri/src/core/bot/models/provider/context/execution.rs
use super::super::ProviderId;
use super::{
    ProviderContext, ProviderErrorContext, ProviderExecutionOperation, ProviderExecutionStage,
    ProviderStage,
};

/// Link-specific metadata for shared provider execution flows.
///
/// 共享 Provider 执行链路携带的可靠性元信息。
struct ExecutionExtra {
    /// Provider targeted by the shared execution.
    ///
    /// 当前共享执行链路目标 Provider。
    provider_id: ProviderId,
    /// Shared provider execution operation currently being executed.
    ///
    /// 当前正在执行的共享 Provider 操作。
    operation: ProviderExecutionOperation,
}

/// Provider-scoped shared execution reliability context.
///
/// 单 Provider 共享执行链路的可靠性上下文。
pub(in crate::core::bot) struct ProviderExecutionContext(ProviderContext<ExecutionExtra>);

impl ProviderExecutionContext {
    /// Derives this shared execution context at the connection stage.
    ///
    /// 将当前共享执行上下文派生到连接阶段。
    pub(in crate::core::bot) fn at_connection(self) -> Self {
        Self(self.0.at_connection())
    }

    /// Derives this shared execution context at the config-store stage.
    ///
    /// 将当前共享执行上下文派生到配置存储阶段。
    pub(in crate::core::bot) fn at_config_store(self) -> Self {
        Self(self.0.at_config_store())
    }

    /// Derives this shared execution context at the secret-store stage.
    ///
    /// 将当前共享执行上下文派生到密钥存储阶段。
    pub(in crate::core::bot) fn at_secret_store(self) -> Self {
        Self(self.0.at_secret_store())
    }

    /// Projects this shared execution context into an error attribution snapshot.
    ///
    /// 将当前共享执行上下文投影为错误归因快照。
    pub(in crate::core::bot) fn error_context(&self) -> ProviderErrorContext {
        self.0
            .error_context()
            .with_provider(self.0.extra().provider_id)
    }

    /// Creates shared execution context from a provider execution operation.
    ///
    /// 基于 Provider 执行操作创建共享执行上下文。
    pub(super) fn from_operation(
        stage: ProviderExecutionStage,
        provider_id: ProviderId,
        operation: ProviderExecutionOperation,
    ) -> Self {
        Self::new(stage, provider_id, operation)
    }

    /// Centralizes shared execution context construction.
    ///
    /// 集中管理共享执行上下文构造。
    fn new(
        stage: ProviderExecutionStage,
        provider_id: ProviderId,
        operation: ProviderExecutionOperation,
    ) -> Self {
        Self(ProviderContext::new(
            ProviderStage::execution(stage),
            ExecutionExtra {
                provider_id,
                operation,
            },
        ))
    }
}
