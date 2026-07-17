// apps/desktop/src-tauri/src/core/bot/models/provider/context/error.rs
use std::fmt;

use super::super::ProviderSubject;
use super::ProviderStage;

/// Provider error attribution context snapshot.
///
/// Provider 错误归因上下文快照。
#[derive(Debug, Clone)]
pub(in crate::core::bot) struct ProviderErrorContext {
    /// Provider domain execution stage where the failure was observed.
    ///
    /// 观察到失败时所在的 Provider 领域执行阶段。
    stage: ProviderStage,
    /// Provider-domain subject targeted by the failure.
    ///
    /// 当前失败归因的 Provider 领域主体。
    subject: ProviderSubject,
}

impl ProviderErrorContext {
    /// Returns the provider-domain subject carried by this error context.
    ///
    /// 返回当前错误上下文携带的 Provider 领域主体。
    pub(in crate::core::bot::models::provider) fn subject(&self) -> &ProviderSubject {
        &self.subject
    }

    /// Creates an error context snapshot from stage and subject.
    ///
    /// 基于执行阶段与领域主体创建错误上下文快照。
    pub(super) fn from_parts(stage: ProviderStage, subject: ProviderSubject) -> Self {
        Self { stage, subject }
    }
}

impl fmt::Display for ProviderErrorContext {
    /// Formats this error context snapshot for internal error messages.
    ///
    /// 将此错误上下文快照格式化为内部错误消息。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.subject {
            ProviderSubject::Provider(id) => {
                write!(f, "provider {id} at {}", self.stage.as_phrase())
            }
            ProviderSubject::Candidate(raw) => {
                write!(f, "candidate {raw} at {}", self.stage.as_phrase())
            }
            ProviderSubject::ConfiguredProviders => {
                write!(f, "the configured providers at {}", self.stage.as_phrase())
            }
        }
    }
}
