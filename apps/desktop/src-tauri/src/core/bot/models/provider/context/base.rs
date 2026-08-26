// apps/desktop/src-tauri/src/core/bot/models/provider/context/base.rs
use super::super::ProviderSubject;
use super::{ProviderOperation, ProviderStage};

/// Provider subject reality base context.
///
/// 供应商主体实在基础上下文。
pub(super) struct ProviderContext<E = ()> {
    /// Provider subject reality business execution stage represented by this context view.
    ///
    /// 当前上下文视图表示的供应商主体实在业务执行阶段。
    stage: ProviderStage,
    /// Subject reality business context fields shared across derived stage views.
    ///
    /// 跨派生阶段视图共享的主体实在业务上下文字段。
    extra: E,
}

impl<E> ProviderContext<E> {
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

    /// Returns stable attribution parts for a subject and operation at the current stage.
    ///
    /// 返回指定主体与操作在当前阶段的稳定归因组成部分。
    pub(super) fn attribution_parts_for(
        &self,
        subject: ProviderSubject,
        operation: ProviderOperation,
    ) -> (ProviderStage, ProviderSubject, ProviderOperation) {
        (self.stage, subject, operation)
    }

    /// Consumes this context and returns the subject reality business context fields.
    ///
    /// 消费当前上下文并返回主体实在业务上下文字段。
    pub(super) fn into_extra(self) -> E {
        self.extra
    }

    /// Returns the current Provider subject reality stage.
    ///
    /// 返回当前供应商主体实在阶段。
    pub(super) fn stage(&self) -> ProviderStage {
        self.stage
    }

    /// Returns the subject reality business context fields.
    ///
    /// 返回主体实在业务上下文字段。
    pub(super) fn extra(&self) -> &E {
        &self.extra
    }

    /// Assembles a Provider subject reality base context from its parts.
    ///
    /// 由组成部分组装供应商主体实在基础上下文。
    pub(super) fn from_parts(stage: ProviderStage, extra: E) -> Self {
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
