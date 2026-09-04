// apps/desktop/src-tauri/src/core/bot/models/provider/log/occurrence.rs
use strum::Display;

use super::super::super::super::super::LogLevel::{self, Error};
use super::super::{ProviderError, ProviderFailureKind};
use super::ProviderObservation;

/// Business occurrence facts observed by the Provider subject reality logging branch.
///
/// 供应商主体实在日志分支观测到的业务发生事实。
#[derive(Display)]
pub(in crate::core::bot::models::provider) enum ProviderOccurrence {
    /// Provider internal error observed as a failure occurrence.
    ///
    /// 将供应商内部错误观测为失败发生事实。
    #[strum(transparent)]
    Failure(
        /// Provider failure kind observed from the internal error.
        ///
        /// 从内部错误中观测到的供应商失败种类。
        ProviderFailureKind,
    ),
    /// Provider observation fact observed by the logging branch.
    ///
    /// 日志分支观测到的供应商观测事实。
    #[strum(transparent)]
    Observation(
        /// Observed Provider business fact.
        ///
        /// 被观测的供应商业务事实。
        ProviderObservation,
    ),
}

impl ProviderOccurrence {
    /// Returns the severity assigned to this Provider occurrence by the logging contract.
    ///
    /// 返回日志契约为当前供应商发生事实指定的严重级别。
    pub(super) fn severity(&self) -> LogLevel {
        match self {
            Self::Failure(_) => Error,
            Self::Observation(observation) => observation.severity(),
        }
    }
}

impl From<&ProviderError> for ProviderOccurrence {
    /// Observes an internal Provider error as a failure occurrence.
    ///
    /// 将供应商内部错误观测为失败发生事实。
    fn from(error: &ProviderError) -> Self {
        Self::Failure(error.failure_kind())
    }
}

impl From<ProviderObservation> for ProviderOccurrence {
    /// Wraps a Provider observation as an occurrence.
    ///
    /// 将供应商观测事实包装为发生事实。
    fn from(observation: ProviderObservation) -> Self {
        Self::Observation(observation)
    }
}
