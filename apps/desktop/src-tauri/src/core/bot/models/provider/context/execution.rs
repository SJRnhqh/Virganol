// apps/desktop/src-tauri/src/core/bot/models/provider/context/execution.rs
use super::super::super::SettingsStorageContext;
use super::super::ProviderSubject;
use super::{ProviderContext, ProviderErrorContext, ProviderExecutionOperation, ProviderStage};

/// Execution business context fields.
///
/// 执行业务上下文字段。
#[derive(Clone)]
struct ExecutionExtra {
    /// Provider domain subject targeted by this execution.
    ///
    /// 当前执行链路归因的 Provider 领域主体。
    subject: ProviderSubject,
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
    /// Consumes this execution context into the connection stage.
    ///
    /// 消费当前执行上下文，并将其转换为连接阶段。
    pub(in crate::core::bot) fn into_connection(self) -> Self {
        Self(self.0.into_connection())
    }

    /// Consumes this execution context into the config-store stage.
    ///
    /// 消费当前执行上下文，并将其转换为配置存储阶段。
    pub(in crate::core::bot) fn into_config_store(self) -> Self {
        Self(self.0.into_config_store())
    }

    /// Consumes this execution context into the secret-store stage.
    ///
    /// 消费当前执行上下文，并将其转换为密钥存储阶段。
    pub(in crate::core::bot) fn into_secret_store(self) -> Self {
        Self(self.0.into_secret_store())
    }

    /// Derives an owned connection stage view from this execution context.
    ///
    /// 从当前执行上下文派生一个拥有所有权的连接阶段视图，不改变来源上下文。
    pub(in crate::core::bot) fn for_connection(&self) -> Self {
        Self(self.0.for_connection())
    }

    /// Derives an owned config-store stage view from this execution context.
    ///
    /// 从当前执行上下文派生一个拥有所有权的配置存储阶段视图，不改变来源上下文。
    pub(in crate::core::bot) fn for_config_store(&self) -> Self {
        Self(self.0.for_config_store())
    }

    /// Derives an owned secret-store stage view from this execution context.
    ///
    /// 从当前执行上下文派生一个拥有所有权的密钥存储阶段视图，不改变来源上下文。
    pub(in crate::core::bot) fn for_secret_store(&self) -> Self {
        Self(self.0.for_secret_store())
    }

    /// Derives a settings storage context from this execution context.
    ///
    /// 从当前执行上下文派生 settings 存储上下文。
    pub(in crate::core::bot) fn for_settings_storage(&self) -> SettingsStorageContext {
        SettingsStorageContext::storage()
    }

    /// Projects this execution context into an error attribution snapshot.
    ///
    /// 将当前执行上下文投影为错误归因快照。
    pub(in crate::core::bot::models::provider) fn error_context(&self) -> ProviderErrorContext {
        let ctx = self.0.error_context();

        match self.0.extra().subject.provider_id() {
            Some(provider_id) => ctx.with_provider(provider_id),
            None => ctx,
        }
    }

    /// Creates an execution context from its constituent parts.
    ///
    /// 基于组成部分创建执行上下文。
    pub(super) fn from_parts(
        stage: ProviderStage,
        subject: ProviderSubject,
        operation: ProviderExecutionOperation,
    ) -> Self {
        Self::new(stage, subject, operation)
    }

    /// Centralizes execution context construction.
    ///
    /// 集中创建执行上下文。
    fn new(
        stage: ProviderStage,
        subject: ProviderSubject,
        operation: ProviderExecutionOperation,
    ) -> Self {
        Self(ProviderContext::new(
            stage,
            ExecutionExtra { subject, operation },
        ))
    }
}
