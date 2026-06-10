// apps/desktop/src-tauri/src/core/bot/models/provider/error/code.rs
use serde::Serialize;

/// Provider-specific application boundary error code.
///
/// Provider 领域的应用边界错误码。
#[derive(Serialize)]
pub(super) enum ProviderErrorCode {
    /// Manager/request layer received a command payload without required data.
    ///
    /// manager/request 层收到缺少必需 data 字段的命令载荷。
    #[serde(rename = "missing_request_data")]
    MissingRequestData,
}

impl ProviderErrorCode {
    /// Returns the safe fallback message for this error code.
    ///
    /// 返回该错误码对应的安全兜底消息。
    pub(super) fn default_message(&self) -> &'static str {
        match self {
            Self::MissingRequestData => "Missing request data.",
        }
    }
}
