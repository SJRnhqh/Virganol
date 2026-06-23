// apps/desktop/src-tauri/src/core/bot/models/provider/context/manager.rs
use super::super::ProviderId;
use super::{ProviderContext, ProviderOperation, ProviderStage};

/// Provider manager reliability context.
///
/// Provider 交互式 manager 链路的可靠性上下文。
pub(super) struct ProviderManagerContext(ProviderContext<()>);

impl ProviderManagerContext {
    /// Creates context for connecting one provider.
    ///
    /// 创建连接单个 Provider 的上下文。
    pub(super) fn connect(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderOperation::Connect)
    }

    /// Creates context for resetting one provider.
    ///
    /// 创建重置单个 Provider 的上下文。
    pub(super) fn reset(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderOperation::Reset)
    }

    /// Creates context for updating enabled models for one provider.
    ///
    /// 创建更新单个 Provider 启用模型列表的上下文。
    pub(super) fn update_models(provider_id: ProviderId) -> Self {
        Self::new(provider_id, ProviderOperation::UpdateModels)
    }

    fn new(provider_id: ProviderId, operation: ProviderOperation) -> Self {
        Self(ProviderContext {
            provider_id: Some(provider_id),
            operation,
            stage: ProviderStage::Command,
            extra: (),
        })
    }
}
