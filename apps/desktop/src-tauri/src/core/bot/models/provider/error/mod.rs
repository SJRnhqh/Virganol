// apps/desktop/src-tauri/src/core/bot/models/provider/error/mod.rs
// 导出内容
mod app;
mod code;
mod details;
mod internal;
mod issue;
mod kind;

pub(in crate::core::bot) use app::ProviderAppError;
pub(in crate::core::bot) use code::ProviderErrorCode;
pub(self) use details::ProviderErrorDetails;
pub(in crate::core::bot) use internal::ProviderError;
pub use issue::ProviderIssue;
pub use kind::ProviderErrorKind;
