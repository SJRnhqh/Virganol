// apps/desktop/src-tauri/src/core/bot/models/provider/context/scope.rs
use serde::Serialize;

use super::super::super::super::PROVIDER_REALITY;
use super::{ProviderOperation, ProviderStage};

/// Stable Provider business scope derived from an execution stage and operation.
///
/// 由执行阶段与业务操作共同派生的稳定供应商业务范围。
#[derive(Serialize)]
#[serde(transparent)]
pub(in crate::core::bot::models::provider) struct ProviderScope(
    /// Serialized scope identifier.
    ///
    /// 序列化后的范围标识。
    String,
);

impl ProviderScope {
    /// Derives a Provider scope from an attributed stage and business operation.
    ///
    /// 根据已归因的阶段与业务操作派生供应商业务范围。
    pub(super) fn from_parts(stage: ProviderStage, operation: ProviderOperation) -> Self {
        Self(format!("{PROVIDER_REALITY}.{stage}.{operation}"))
    }
}
