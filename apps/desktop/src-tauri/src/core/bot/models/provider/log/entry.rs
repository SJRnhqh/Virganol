// apps/desktop/src-tauri/src/core/bot/models/provider/log/entry.rs
use super::super::super::super::super::{AppLogger, LogEntry};
use super::super::{
    ProviderAttribution, ProviderError, ProviderExecutionContext, ProviderLifecycleContext,
    ProviderManagerContext, ProviderOperation, ProviderStage, ProviderSubject,
};
use super::{
    ProviderObservation::{
        self, CheckCompleted, CheckStarted, EnabledModelsUpdated, ProviderConfigRestored,
        ProviderConnected, ProviderKeyRolledBack, ProviderReset, SecretRollbackSkipped,
    },
    ProviderOccurrence,
};

/// Structured log entry for the Provider subject reality.
///
/// 供应商主体实在的结构化日志条目。
pub(in crate::core::bot) struct ProviderLogEntry {
    /// Business occurrence fact observed by this entry.
    ///
    /// 当前条目观测到的业务发生事实。
    occurrence: ProviderOccurrence,
    /// Attribution projected from the originating business context.
    ///
    /// 从来源业务上下文投影出的归因。
    attribution: ProviderAttribution,
}

impl ProviderLogEntry {
    /// Records structured log entries for one primary failure plus its suppressed companions.
    ///
    /// 为一个主失败及其被抑制的伴随失败记录结构化日志条目。
    pub(in crate::core::bot) fn record_failure_with_suppressed<'a>(
        logger: &AppLogger,
        error: &'a ProviderError,
        suppressed_errors: impl IntoIterator<Item = &'a ProviderError>,
    ) {
        for error in [error].into_iter().chain(suppressed_errors) {
            Self::record_failure(logger, error);
        }
    }

    /// Records a structured log entry for a single Provider failure.
    ///
    /// 为单个供应商失败记录结构化日志条目。
    pub(in crate::core::bot) fn record_failure(logger: &AppLogger, error: &ProviderError) {
        logger.record(Self::new(error.into(), error.attribution().clone()).generalize());
    }

    /// Records a skipped secret rollback to preserve a newer key value.
    ///
    /// 记录为保留较新密钥值而跳过的密钥回滚。
    pub(in crate::core::bot) fn record_secret_rollback_skipped(
        logger: &AppLogger,
        ctx: &ProviderExecutionContext,
    ) {
        Self::record_observation(logger, SecretRollbackSkipped, ctx);
    }

    /// Records a successful Provider connection.
    ///
    /// 记录供应商连接成功。
    pub(in crate::core::bot) fn record_provider_connected(
        logger: &AppLogger,
        ctx: &ProviderManagerContext,
    ) {
        Self::record_observation(logger, ProviderConnected, ctx);
    }

    /// Records a successful Provider key change rollback.
    ///
    /// 记录供应商密钥变更回滚成功。
    pub(in crate::core::bot) fn record_provider_key_rolled_back(
        logger: &AppLogger,
        ctx: &ProviderExecutionContext,
    ) {
        Self::record_observation(logger, ProviderKeyRolledBack, ctx);
    }

    /// Records a successful Provider reset.
    ///
    /// 记录供应商重置成功。
    pub(in crate::core::bot) fn record_provider_reset(
        logger: &AppLogger,
        ctx: &ProviderManagerContext,
    ) {
        Self::record_observation(logger, ProviderReset, ctx);
    }

    /// Records a successful Provider configuration restoration after reset failure.
    ///
    /// 记录供应商重置失败后成功恢复配置。
    pub(in crate::core::bot) fn record_provider_config_restored(
        logger: &AppLogger,
        ctx: &ProviderExecutionContext,
    ) {
        Self::record_observation(logger, ProviderConfigRestored, ctx);
    }

    /// Records a successful enabled-model update.
    ///
    /// 记录启用模型列表更新成功。
    pub(in crate::core::bot) fn record_enabled_models_updated(
        logger: &AppLogger,
        ctx: &ProviderManagerContext,
    ) {
        Self::record_observation(logger, EnabledModelsUpdated, ctx);
    }

    /// Records the start of one provider check lifecycle run.
    ///
    /// 记录一轮供应商检查生命周期的开始。
    pub(in crate::core::bot) fn record_check_started(
        logger: &AppLogger,
        ctx: &ProviderLifecycleContext<'_>,
    ) {
        Self::record_observation(logger, CheckStarted, ctx);
    }

    /// Records the successful completion of one provider check lifecycle run.
    ///
    /// 记录一轮供应商检查生命周期成功完成。
    pub(in crate::core::bot) fn record_check_completed(
        logger: &AppLogger,
        ctx: &ProviderLifecycleContext<'_>,
    ) {
        Self::record_observation(logger, CheckCompleted, ctx);
    }

    /// Records a structured Provider observation at its contract severity.
    ///
    /// 按契约严重级别记录供应商结构化观测事实。
    fn record_observation(
        logger: &AppLogger,
        observation: ProviderObservation,
        attribution: impl Into<ProviderAttribution>,
    ) {
        logger.record(Self::new(observation.into(), attribution.into()).generalize());
    }

    /// Generalizes this Provider log entry into a shared structured log entry.
    ///
    /// 将当前供应商日志条目通用化为共享结构化日志条目。
    fn generalize(
        self,
    ) -> LogEntry<ProviderOccurrence, ProviderStage, ProviderSubject, ProviderOperation> {
        let level = self.occurrence.severity();

        LogEntry::from_observation(level, self.occurrence, self.attribution.generalize())
    }

    /// Creates a Provider structured log entry.
    ///
    /// 创建供应商结构化日志条目。
    fn new(occurrence: ProviderOccurrence, attribution: ProviderAttribution) -> Self {
        Self {
            occurrence,
            attribution,
        }
    }
}
