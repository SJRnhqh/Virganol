// apps/desktop/src-tauri/src/core/bot/models/provider/context/scope.rs
use serde::Serialize;

use super::super::super::super::{
    PROVIDER_CONFIG_STORE_SCOPES, PROVIDER_CONNECTION_SCOPES, PROVIDER_LIFECYCLE_EMIT_SCOPES,
    PROVIDER_MANAGER_SCOPES, PROVIDER_SECRET_STORE_SCOPES,
};
use super::{ProviderManagerOperation, ProviderOperation, ProviderStage};

/// Stable Provider business scope derived from an execution stage and operation.
///
/// 由执行阶段与业务操作共同派生的稳定 Provider 业务范围。
#[derive(Serialize)]
#[serde(transparent)]
pub(in crate::core::bot::models::provider) struct ProviderScope(&'static str);

impl ProviderScope {
    /// Derives a Provider scope from an attributed stage and business operation.
    ///
    /// 根据已归因的阶段与业务操作派生 Provider 业务范围。
    pub(super) fn from_parts(stage: ProviderStage, operation: ProviderOperation) -> Self {
        let stage_scopes = match stage {
            ProviderStage::Manager => &PROVIDER_MANAGER_SCOPES,
            ProviderStage::LifecycleEmit => &PROVIDER_LIFECYCLE_EMIT_SCOPES,
            ProviderStage::Connection => &PROVIDER_CONNECTION_SCOPES,
            ProviderStage::ConfigStore => &PROVIDER_CONFIG_STORE_SCOPES,
            ProviderStage::SecretStore => &PROVIDER_SECRET_STORE_SCOPES,
        };

        let scope = match operation {
            ProviderOperation::Manager(ProviderManagerOperation::Connect) => stage_scopes.connect(),
            ProviderOperation::Manager(ProviderManagerOperation::Reset) => stage_scopes.reset(),
            ProviderOperation::Manager(ProviderManagerOperation::UpdateModels) => {
                stage_scopes.update_models()
            }
            ProviderOperation::LifecycleCheck => stage_scopes.lifecycle_check(),
        };

        Self(scope)
    }
}
