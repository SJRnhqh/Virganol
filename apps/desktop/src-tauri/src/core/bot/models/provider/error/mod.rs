// apps/desktop/src-tauri/src/core/bot/models/provider/error/mod.rs
// 导出内容
mod app;
mod base;
mod code;
mod details;
mod issue;
mod kind;
mod skip;

pub(self) use app::ProviderAppError;
pub use base::ProviderError;
pub(self) use code::ProviderErrorCode;
pub(self) use details::ProviderErrorDetails;
pub use issue::ProviderIssue;
pub use kind::ProviderErrorKind;
pub use skip::SkippedProviderDetail;
