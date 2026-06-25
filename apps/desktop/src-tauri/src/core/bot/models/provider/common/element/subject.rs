// apps/desktop/src-tauri/src/core/bot/models/provider/common/element/subject.rs
use super::ProviderId;

/// Provider-domain attribution subject.
///
/// Provider 领域上下文、日志与错误归因的领域主体。
pub(super) enum ProviderSubject {
    /// A concrete provider identified by a stable provider id.
    ///
    /// 由稳定 Provider ID 标识的单个具体 Provider。
    Provider(ProviderId),
    /// The persisted configured-provider collection.
    ///
    /// 持久化配置中的已配置 Provider 集合。
    ConfiguredProviders,
}

impl From<ProviderId> for ProviderSubject {
    /// Lifts a concrete provider id into a Provider-domain attribution subject.
    ///
    /// 将单个具体 Provider ID 提升为 Provider 领域归因主体。
    fn from(provider_id: ProviderId) -> Self {
        Self::Provider(provider_id)
    }
}
