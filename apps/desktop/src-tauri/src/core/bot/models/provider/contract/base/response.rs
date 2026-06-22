// apps/desktop/src-tauri/src/core/bot/models/provider/contract/base/response.rs
use serde::Serialize;

use super::super::super::ProviderAppError;

/// Internal generic response envelope for Provider commands.
///
/// Provider 命令的内部通用响应包裹。
#[derive(Serialize)]
#[serde(tag = "state", rename_all = "snake_case")]
pub(in crate::core::bot::models::provider::contract) enum ProviderCommandResponse<T = ()> {
    /// Successful command response with optional operation-specific data.
    ///
    /// 命令成功响应，可携带可选的操作特定数据。
    Success {
        /// Optional operation-specific data.
        ///
        /// 可选的操作特定数据。
        #[serde(skip_serializing_if = "Option::is_none")]
        data: Option<T>,
    },
    /// Failed command response with a boundary error.
    ///
    /// 命令失败响应，携带边界错误。
    Failure {
        /// Boundary error for the failed operation.
        ///
        /// 操作失败时的边界错误。
        error: ProviderAppError,
    },
}

impl<T> ProviderCommandResponse<T> {
    /// Creates a successful response without data.
    ///
    /// 创建不带数据的成功响应。
    pub(in crate::core::bot::models::provider::contract) fn success() -> Self {
        Self::Success { data: None }
    }

    /// Creates a successful response with data.
    ///
    /// 创建带数据的成功响应。
    pub(in crate::core::bot::models::provider::contract) fn success_with(data: T) -> Self {
        Self::Success { data: Some(data) }
    }

    /// Creates a failed response with a boundary error.
    ///
    /// 创建带边界错误的失败响应。
    pub(in crate::core::bot::models::provider::contract) fn failure(
        error: ProviderAppError,
    ) -> Self {
        Self::Failure { error }
    }
}
