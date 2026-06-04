// apps/desktop/src-tauri/src/core/bot/models/provider/contract/base/response.rs
use serde::Serialize;

/// Internal generic response envelope for Provider commands.
///
/// Provider 命令的内部通用响应包裹。
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub(in crate::core::bot::models::provider::contract) struct ProviderCommandResponse<T = ()> {
    /// Indicates whether the operation succeeded.
    ///
    /// 指示操作是否成功。
    success: bool,

    /// Error message if the operation failed.
    ///
    /// 操作失败时的错误消息。
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,

    /// Optional operation-specific data.
    ///
    /// 可选的操作特定数据。
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

impl<T> ProviderCommandResponse<T> {
    /// Creates a successful response without data.
    ///
    /// 创建不带数据的成功响应。
    pub(in crate::core::bot::models::provider::contract) fn success() -> Self {
        Self {
            success: true,
            error: None,
            data: None,
        }
    }

    /// Creates a successful response with data.
    ///
    /// 创建带数据的成功响应。
    pub(in crate::core::bot::models::provider::contract) fn success_with(data: T) -> Self {
        Self {
            success: true,
            error: None,
            data: Some(data),
        }
    }

    /// Creates a failed response with error message.
    ///
    /// 创建带错误消息的失败响应。
    pub(in crate::core::bot::models::provider::contract) fn failure(
        error: impl Into<String>,
    ) -> Self {
        Self {
            success: false,
            error: Some(error.into()),
            data: None,
        }
    }
}
