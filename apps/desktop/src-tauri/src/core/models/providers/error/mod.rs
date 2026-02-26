// apps/desktop/src-tauri/src/core/models/providers/error/mod.rs
// 导出内容
mod base;
mod issue;
mod skip;

pub use base::ProviderError;
pub use issue::ProviderIssue;
pub use skip::SkippedProviderDetail;
