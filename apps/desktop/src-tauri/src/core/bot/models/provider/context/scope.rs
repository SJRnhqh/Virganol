// apps/desktop/src-tauri/src/core/bot/models/provider/context/scope.rs
use serde::Serialize;

use super::super::super::super::{
    PROVIDER_CONFIG_STORE_SCOPES, PROVIDER_CONNECTION_SCOPES, PROVIDER_LIFECYCLE_EMIT_SCOPES,
    PROVIDER_MANAGER_SCOPES, PROVIDER_SECRET_STORE_SCOPES,
};
use super::ProviderManagerOperation::{Connect, Reset, UpdateModels};
use super::ProviderOperation::{self, LifecycleCheck, Manager};
use super::ProviderStage::{
    self, ConfigStore, Connection, LifecycleEmit, Manager as ManagerStage, SecretStore,
};

/// Stable Provider business scope derived from an execution stage and operation.
///
/// 由执行阶段与业务操作共同派生的稳定供应商业务范围。
#[derive(Serialize)]
#[serde(transparent)]
pub(in crate::core::bot::models::provider) struct ProviderScope(
    /// Serialized scope identifier.
    ///
    /// 序列化后的范围标识。
    &'static str,
);

impl ProviderScope {
    /// Derives a Provider scope from an attributed stage and business operation.
    ///
    /// 根据已归因的阶段与业务操作派生供应商业务范围。
    pub(super) fn from_parts(stage: ProviderStage, operation: ProviderOperation) -> Self {
        let stage_scopes = match stage {
            ManagerStage => &PROVIDER_MANAGER_SCOPES,
            LifecycleEmit => &PROVIDER_LIFECYCLE_EMIT_SCOPES,
            Connection => &PROVIDER_CONNECTION_SCOPES,
            ConfigStore => &PROVIDER_CONFIG_STORE_SCOPES,
            SecretStore => &PROVIDER_SECRET_STORE_SCOPES,
        };

        let scope = match operation {
            Manager(Connect) => stage_scopes.connect(),
            Manager(Reset) => stage_scopes.reset(),
            Manager(UpdateModels) => stage_scopes.update_models(),
            LifecycleCheck => stage_scopes.lifecycle_check(),
        };

        Self(scope)
    }
}
