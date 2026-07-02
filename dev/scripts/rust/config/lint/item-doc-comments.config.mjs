// dev/scripts/rust/config/lint/item-doc-comments.config.mjs
// Rust item doc comment lint configuration / Rust 项文档注释检查配置
export default {
  targets: ["apps/desktop/src-tauri/src/commands"],
  excludes: ["**/mod.rs"],
  items: ["fn", "struct", "trait"],
  allowedChineseTerms: ["JSON", "API"],
};
