// apps/desktop/src-tauri/src/core/bot/models/provider/context/base.rs
use super::{ProviderErrorContext, ProviderStage};

/// Provider domain base context.
///
/// Provider 领域基础上下文。
pub(super) struct ProviderContext<E = ()> {
    /// Provider domain business execution stage represented by this context view.
    ///
    /// 当前上下文视图表示的 Provider 领域业务执行阶段。
    stage: ProviderStage,
    /// Domain business context fields shared across derived stage views.
    ///
    /// 跨派生阶段视图共享的领域业务上下文字段。
    extra: E,
}

impl<E> ProviderContext<E> {
    /// Consumes this context into the lifecycle-event stage.
    ///
    /// 消费当前上下文，并将其转换为生命周期事件阶段。
    pub(super) fn into_lifecycle_emit(self) -> Self {
        self.to_stage(ProviderStage::lifecycle_emit())
    }

    /// Consumes this context into the connection stage.
    ///
    /// 消费当前上下文，并将其转换为连接阶段。
    pub(super) fn into_connection(self) -> Self {
        self.to_stage(ProviderStage::connection())
    }

    /// Consumes this context into the config-store stage.
    ///
    /// 消费当前上下文，并将其转换为配置存储阶段。
    pub(super) fn into_config_store(self) -> Self {
        self.to_stage(ProviderStage::config_store())
    }

    /// Consumes this context into the secret-store stage.
    ///
    /// 消费当前上下文，并将其转换为密钥存储阶段。
    pub(super) fn into_secret_store(self) -> Self {
        self.to_stage(ProviderStage::secret_store())
    }

    /// Projects this context into an error attribution snapshot.
    ///
    /// 将当前上下文投影为错误归因快照。
    pub(super) fn error_context(&self) -> ProviderErrorContext {
        ProviderErrorContext::from_parts(None, self.stage)
    }

    /// Consumes this context and returns the domain business context fields.
    ///
    /// 消费当前上下文并返回领域业务上下文字段。
    pub(super) fn into_extra(self) -> E {
        self.extra
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

    /// Creates a Provider domain base context at the given execution stage.
    ///
    /// 使用指定执行阶段创建 Provider 领域基础上下文。
    pub(super) fn new(stage: ProviderStage, extra: E) -> Self {
        Self { stage, extra }
    }

    /// Reuses this context identity at another execution stage.
    ///
    /// 在另一个执行阶段复用当前上下文身份。
    fn to_stage(self, stage: ProviderStage) -> Self {
        Self {
            stage,
            extra: self.extra,
        }
    }
}

impl<E: Clone> ProviderContext<E> {
    /// Derives an owned lifecycle-event stage view from this context.
    ///
    /// 从当前上下文派生一个拥有所有权的生命周期事件阶段视图，不改变来源上下文。
    pub(super) fn for_lifecycle_emit(&self) -> Self {
        self.for_stage(ProviderStage::lifecycle_emit())
    }

    /// Derives an owned connection stage view from this context.
    ///
    /// 从当前上下文派生一个拥有所有权的连接阶段视图，不改变来源上下文。
    pub(super) fn for_connection(&self) -> Self {
        self.for_stage(ProviderStage::connection())
    }

    /// Derives an owned config-store stage view from this context.
    ///
    /// 从当前上下文派生一个拥有所有权的配置存储阶段视图，不改变来源上下文。
    pub(super) fn for_config_store(&self) -> Self {
        self.for_stage(ProviderStage::config_store())
    }

    /// Derives an owned secret-store stage view from this context.
    ///
    /// 从当前上下文派生一个拥有所有权的密钥存储阶段视图，不改变来源上下文。
    pub(super) fn for_secret_store(&self) -> Self {
        self.for_stage(ProviderStage::secret_store())
    }

    /// Derives an owned stage view while preserving the source context identity.
    ///
    /// 在保留来源上下文身份的同时，派生一个拥有所有权的阶段视图。
    fn for_stage(&self, stage: ProviderStage) -> Self {
        Self {
            stage,
            extra: self.extra.clone(),
        }
    }
}
