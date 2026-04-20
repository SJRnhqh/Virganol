// apps/desktop/src-tauri/src/core/bot/models/provider/contract/reset.rs
// 外部依赖
use serde::Serialize;

#[derive(Debug, Serialize)]
pub(crate) struct ResetProviderResponse {
    pub success: bool,
    pub error: Option<String>,
}
