// dev/scripts/rust/comments/crates/core/src/models/config.rs

/// Configures Rust comment checks.
///
/// 配置 Rust 注释检查。
pub struct CommentCheckConfig {
    /// ASCII terms allowed in Chinese documentation content.
    ///
    /// 中文文档内容中允许使用的 ASCII 术语。
    allowed_ascii_terms: Vec<String>,
}

impl CommentCheckConfig {
    /// Creates a comment check configuration.
    ///
    /// 创建注释检查配置。
    pub fn new(allowed_ascii_terms: Vec<String>) -> Self {
        Self {
            allowed_ascii_terms,
        }
    }

    /// Returns the ASCII terms allowed in Chinese documentation content.
    ///
    /// 返回中文文档内容中允许使用的 ASCII 术语。
    pub(crate) fn allowed_ascii_terms(&self) -> &[String] {
        &self.allowed_ascii_terms
    }
}
