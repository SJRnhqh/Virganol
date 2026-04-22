// apps/desktop/src-tauri/src/core/bot/models/provider/contract/reset.rs
use serde::Serialize;

/// Response for resetting a provider.
///
/// 重置 Provider 的响应。
#[derive(Debug, Serialize)]
pub(crate) struct ResetProviderResponse {
    pub success: bool,
    pub error: Option<String>,
}
