// apps/desktop/src-tauri/src/core/bot/models/provider/error/details.rs
use serde::Serialize;

use super::super::{ProviderId, ProviderScope};
use super::{ProviderAppError, ProviderError};

/// Structured application boundary error details for the Provider subject reality.
///
/// 供应商主体实在的结构化应用边界错误细节。
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct ProviderErrorDetails {
    /// Provider business scope for this error.
    ///
    /// 当前错误对应的供应商业务范围。
    scope: ProviderScope,
    /// Concrete Provider id attributed to the error, when available.
    ///
    /// 错误可归因到具体供应商时对应的标识。
    #[serde(skip_serializing_if = "Option::is_none")]
    provider_id: Option<ProviderId>,
    /// Provider boundary errors observed but not selected as the primary error.
    ///
    /// 已观察到但未被选为主错误的供应商边界错误。
    #[serde(skip_serializing_if = "Option::is_none")]
    suppressed_errors: Option<Vec<ProviderAppError>>,
}

impl ProviderErrorDetails {
    /// Creates boundary details with suppressed Provider errors attached.
    ///
    /// 创建附带被抑制供应商错误的边界细节。
    pub(super) fn with_suppressed_errors(
        error: &ProviderError,
        suppressed_errors: Vec<ProviderAppError>,
    ) -> Self {
        Self {
            suppressed_errors: (!suppressed_errors.is_empty()).then_some(suppressed_errors),
            ..Self::from(error)
        }
    }
}

impl From<&ProviderError> for ProviderErrorDetails {
    /// Projects an internal provider error into structured boundary details.
    ///
    /// 将内部供应商错误投影为结构化边界细节。
    fn from(error: &ProviderError) -> Self {
        Self {
            scope: error.context().scope(),
            provider_id: error.context().subject().provider_id(),
            suppressed_errors: None,
        }
    }
}
