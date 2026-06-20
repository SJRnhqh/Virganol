// apps/desktop/src-tauri/src/core/bot/models/provider/error/mod.rs
// 导出内容
mod app;
mod code;
mod details;
mod internal;

pub(in crate::core::bot) use app::ProviderAppError;
pub(self) use code::ProviderErrorCode;
pub(self) use details::ProviderErrorDetails;
pub(in crate::core::bot) use internal::ProviderError;
