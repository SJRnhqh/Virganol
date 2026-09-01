// apps/desktop/src-tauri/src/core/bot/models/provider/log/occurrence.rs
use std::fmt::{Display, Formatter, Result};

use super::super::{ProviderError, ProviderFailureKind};

/// Business occurrence facts observed by the Provider subject reality logging branch.
///
/// 供应商主体实在日志分支观测到的业务发生事实。
pub(in crate::core::bot::models::provider) enum ProviderOccurrence {
    /// Provider internal error observed as a failure occurrence.
    ///
    /// 将供应商内部错误观测为失败发生事实。
    Failure(
        /// Provider failure kind observed from the internal error.
        ///
        /// 从内部错误中观测到的供应商失败种类。
        ProviderFailureKind,
    ),
    /// Provider key rollback skipped to preserve a newer key value.
    ///
    /// 为保留较新的密钥值而跳过供应商密钥回滚。
    SecretRollbackSkipped,
    /// One provider check lifecycle run started.
    ///
    /// 一轮供应商检查生命周期开始运行。
    CheckStarted,
    /// Persisted configuration and secret material were reset for one provider.
    ///
    /// 已重置一个供应商的持久化配置与密钥材料。
    ProviderReset,
    /// Enabled models were updated successfully for one provider.
    ///
    /// 已成功更新一个供应商的启用模型列表。
    EnabledModelsUpdated,
}

impl From<&ProviderError> for ProviderOccurrence {
    /// Observes an internal Provider error as a failure occurrence.
    ///
    /// 将供应商内部错误观测为失败发生事实。
    fn from(error: &ProviderError) -> Self {
        Self::Failure(error.failure_kind())
    }
}

impl Display for ProviderOccurrence {
    /// Formats this Provider occurrence as a stable token.
    ///
    /// 将当前供应商发生事实格式化为稳定令牌。
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        match self {
            Self::Failure(failure_kind) => write!(f, "{failure_kind}"),
            Self::SecretRollbackSkipped => f.write_str("secret_rollback_skipped"),
            Self::CheckStarted => f.write_str("check_started"),
            Self::ProviderReset => f.write_str("provider_reset"),
            Self::EnabledModelsUpdated => f.write_str("enabled_models_updated"),
        }
    }
}
