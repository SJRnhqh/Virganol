// apps/desktop/src-tauri/src/core/models/provider/error/mod.rs
// 导出内容
mod base;
mod code;
mod issue;
mod skip;

pub use base::ProviderError;
pub use code::ProviderErrorCode;
pub use issue::ProviderIssue;
pub use skip::SkippedProviderDetail;
