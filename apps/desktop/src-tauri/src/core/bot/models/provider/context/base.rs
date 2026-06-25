// apps/desktop/src-tauri/src/core/bot/models/provider/context/base.rs
use super::{ProviderErrorContext, ProviderStage};

/// Provider domain base context.
///
/// Provider 领域基础上下文。
pub(super) struct ProviderContext<E = ()> {
    /// Provider domain business execution stage.
    ///
    /// Provider 领域业务执行阶段。
    stage: ProviderStage,
    /// Domain business context fields.
    ///
    /// 领域业务上下文字段。
    extra: E,
}

impl<E> ProviderContext<E> {
    /// Derives this context at the lifecycle-event stage.
    ///
    /// 将当前上下文派生到生命周期事件阶段。
    pub(super) fn at_lifecycle_emit(self) -> Self {
        self.at_stage(ProviderStage::lifecycle_emit())
    }

    /// Derives this context at the connection stage.
    ///
    /// 将当前上下文派生到连接阶段。
    pub(super) fn at_connection(self) -> Self {
        self.at_stage(ProviderStage::connection())
    }

    /// Derives this context at the config-store stage.
    ///
    /// 将当前上下文派生到配置存储阶段。
    pub(super) fn at_config_store(self) -> Self {
        self.at_stage(ProviderStage::config_store())
    }

    /// Derives this context at the secret-store stage.
    ///
    /// 将当前上下文派生到密钥存储阶段。
    pub(super) fn at_secret_store(self) -> Self {
        self.at_stage(ProviderStage::secret_store())
    }

    /// Projects this context into an error attribution snapshot.
    ///
    /// 将当前上下文投影为错误归因快照。
    pub(super) fn error_context(&self) -> ProviderErrorContext {
        ProviderErrorContext::from_parts(None, self.stage)
    }

    /// Returns the current Provider domain stage.
    ///
    /// 返回当前 Provider 领域阶段。
    pub(super) fn stage(&self) -> ProviderStage {
        self.stage
    }

    /// Returns the domain business context fields.
    ///
    /// 返回领域业务上下文字段。
    pub(super) fn extra(&self) -> &E {
        &self.extra
    }

    /// Consumes this context and returns the domain business context fields.
    ///
    /// 消费当前上下文并返回领域业务上下文字段。
    pub(super) fn into_extra(self) -> E {
        self.extra
    }

    /// Creates a Provider domain base context at the given execution stage.
    ///
    /// 使用指定执行阶段创建 Provider 领域基础上下文。
    pub(super) fn new(stage: ProviderStage, extra: E) -> Self {
        Self { stage, extra }
    }

    /// Reuses the current context identity at another execution stage.
    ///
    /// 在另一个执行阶段复用当前上下文身份。
    fn at_stage(self, stage: ProviderStage) -> Self {
        Self {
            stage,
            extra: self.extra,
        }
    }
}
