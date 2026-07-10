// apps/desktop/src-tauri/src/core/bot/models/provider/contract/base/response.rs
use serde::Serialize;

/// Internal generic success response envelope for Provider commands.
///
/// 供应商命令的内部通用成功响应包裹。
#[derive(Serialize)]
pub(in crate::core::bot::models::provider::contract) struct ProviderCommandResponse<T = ()> {
    /// Optional operation-specific success data.
    ///
    /// 命令成功响应中的可选操作数据区块。
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

impl<T> ProviderCommandResponse<T> {
    /// Creates a successful response without data.
    ///
    /// 创建不带数据的成功响应。
    pub(in crate::core::bot::models::provider::contract) fn success() -> Self {
        Self { data: None }
    }

    /// Creates a successful response with data.
    ///
    /// 创建带操作数据的成功响应。
    pub(in crate::core::bot::models::provider::contract) fn success_with(data: T) -> Self {
        Self { data: Some(data) }
    }
}
