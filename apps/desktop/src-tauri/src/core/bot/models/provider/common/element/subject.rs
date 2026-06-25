// apps/desktop/src-tauri/src/core/bot/models/provider/common/element/subject.rs
use super::ProviderId;

/// Provider-domain attribution subject.
///
/// Provider 领域上下文、日志与错误归因的领域主体。
#[derive(Clone)]
pub(in crate::core::bot) enum ProviderSubject {
    /// A concrete provider identified by a stable provider id.
    ///
    /// 由稳定 Provider ID 标识的单个具体 Provider。
    Provider(ProviderId),
    /// The persisted configured-provider collection.
    ///
    /// 持久化配置中的已配置 Provider 集合。
    ConfiguredProviders,
}

impl ProviderSubject {
    /// Projects this Provider-domain subject into a concrete provider id when available.
    ///
    /// 当当前 Provider 领域主体可归因到单个具体 Provider 时，投影出对应 Provider ID。
    pub(in crate::core::bot) fn provider_id(&self) -> Option<ProviderId> {
        match self {
            Self::Provider(provider_id) => Some(*provider_id),
            Self::ConfiguredProviders => None,
        }
    }
}

impl From<ProviderId> for ProviderSubject {
    /// Lifts a concrete provider id into a Provider-domain attribution subject.
    ///
    /// 将单个具体 Provider ID 提升为 Provider 领域归因主体。
    fn from(provider_id: ProviderId) -> Self {
        Self::Provider(provider_id)
    }
}
