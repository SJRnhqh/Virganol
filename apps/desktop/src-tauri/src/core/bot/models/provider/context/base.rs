// apps/desktop/src-tauri/src/core/bot/models/provider/context/base.rs
use super::super::ProviderId;
use super::{ProviderOperation, ProviderStage};

/// Provider-domain reliability context.
///
/// Provider 领域可靠性上下文，用领域语言标记一次 Provider 操作的执行处境。
pub(super) struct ProviderContext<T = ()> {
    /// Provider targeted by this execution, when it can be attributed to one provider.
    ///
    /// 当本次执行可归属到单个 Provider 时携带对应 Provider ID。
    pub(super) provider_id: Option<ProviderId>,
    /// Provider-domain operation currently being executed.
    ///
    /// 当前正在执行的 Provider 领域操作。
    pub(super) operation: ProviderOperation,
    /// Provider-domain execution stage currently reached.
    ///
    /// 当前抵达的 Provider 领域执行阶段。
    pub(super) stage: ProviderStage,
    /// Link-specific reliability metadata.
    ///
    /// 具体链路携带的可靠性元信息。
    pub(super) extra: T,
}
