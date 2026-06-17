// apps/desktop/src-tauri/src/core/bot/models/provider/error/details.rs
use serde::Serialize;

use super::ProviderError;

/// Provider-specific structured application boundary error details.
///
/// Provider 领域的结构化应用边界错误细节。
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct ProviderErrorDetails {
    /// Always-present provider-domain scope for locating the error.
    ///
    /// 常驻的 Provider 领域范围，用于定位错误源头。
    domain_scope: String,
}

impl ProviderErrorDetails {
    /// Projects an internal provider error into a provider-domain scope.
    ///
    /// 将内部 Provider 错误投影为 Provider 领域范围。
    fn domain_scope_from(error: &ProviderError) -> &'static str {
        match error {
            _ => "provider.unknown",
        }
    }
}

impl From<&ProviderError> for ProviderErrorDetails {
    /// Projects an internal provider error into structured boundary details.
    ///
    /// 将内部 Provider 错误投影为结构化边界细节。
    fn from(error: &ProviderError) -> Self {
        Self {
            domain_scope: Self::domain_scope_from(error).to_string(),
        }
    }
}
