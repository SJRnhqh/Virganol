// apps/desktop/src-tauri/src/core/bot/models/provider/log/entry.rs
use super::super::super::super::super::{AppLogger, LogEntry};
use super::super::{
    ProviderAttribution, ProviderError, ProviderExecutionContext, ProviderLifecycleContext,
    ProviderManagerContext,
};
use super::{
    ProviderObservation::{
        CheckCompleted, CheckStarted, EnabledModelsUpdated, ProviderConfigRestored,
        ProviderConnected, ProviderKeyRolledBack, ProviderReset, SecretRollbackSkipped,
    },
    ProviderOccurrence,
};

/// Structured logging facade for the Provider subject reality.
///
/// 供应商主体实在的结构化日志门面。
pub(in crate::core::bot) struct ProviderLogEntry;

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
        Self::record_entry(logger, error.into(), error.attribution().clone());
    }

    /// Records a skipped secret rollback to preserve a newer key value.
    ///
    /// 记录为保留较新密钥值而跳过的密钥回滚。
    pub(in crate::core::bot) fn record_secret_rollback_skipped(
        logger: &AppLogger,
        ctx: &ProviderExecutionContext,
    ) {
        Self::record_entry(logger, SecretRollbackSkipped.into(), ctx.into());
    }

    /// Records a successful Provider connection.
    ///
    /// 记录供应商连接成功。
    pub(in crate::core::bot) fn record_provider_connected(
        logger: &AppLogger,
        ctx: &ProviderManagerContext,
    ) {
        Self::record_entry(logger, ProviderConnected.into(), ctx.into());
    }

    /// Records a successful Provider key change rollback.
    ///
    /// 记录供应商密钥变更回滚成功。
    pub(in crate::core::bot) fn record_provider_key_rolled_back(
        logger: &AppLogger,
        ctx: &ProviderExecutionContext,
    ) {
        Self::record_entry(logger, ProviderKeyRolledBack.into(), ctx.into());
    }

    /// Records a successful Provider reset.
    ///
    /// 记录供应商重置成功。
    pub(in crate::core::bot) fn record_provider_reset(
        logger: &AppLogger,
        ctx: &ProviderManagerContext,
    ) {
        Self::record_entry(logger, ProviderReset.into(), ctx.into());
    }

    /// Records a successful Provider configuration restoration after reset failure.
    ///
    /// 记录供应商重置失败后成功恢复配置。
    pub(in crate::core::bot) fn record_provider_config_restored(
        logger: &AppLogger,
        ctx: &ProviderExecutionContext,
    ) {
        Self::record_entry(logger, ProviderConfigRestored.into(), ctx.into());
    }

    /// Records a successful enabled-model update.
    ///
    /// 记录启用模型列表更新成功。
    pub(in crate::core::bot) fn record_enabled_models_updated(
        logger: &AppLogger,
        ctx: &ProviderManagerContext,
    ) {
        Self::record_entry(logger, EnabledModelsUpdated.into(), ctx.into());
    }

    /// Records the start of one provider check lifecycle run.
    ///
    /// 记录一轮供应商检查生命周期的开始。
    pub(in crate::core::bot) fn record_check_started(
        logger: &AppLogger,
        ctx: &ProviderLifecycleContext<'_>,
    ) {
        Self::record_entry(logger, CheckStarted.into(), ctx.into());
    }

    /// Records the successful completion of one provider check lifecycle run.
    ///
    /// 记录一轮供应商检查生命周期成功完成。
    pub(in crate::core::bot) fn record_check_completed(
        logger: &AppLogger,
        ctx: &ProviderLifecycleContext<'_>,
    ) {
        Self::record_entry(logger, CheckCompleted.into(), ctx.into());
    }

    /// Records a structured Provider entry at its contract severity.
    ///
    /// 按契约严重级别记录供应商结构化条目。
    fn record_entry(
        logger: &AppLogger,
        occurrence: ProviderOccurrence,
        attribution: ProviderAttribution,
    ) {
        logger.record(LogEntry::from_observation(
            occurrence.severity(),
            occurrence,
            attribution.generalize(),
        ));
    }
}
