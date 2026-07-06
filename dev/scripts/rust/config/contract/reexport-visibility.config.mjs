// dev/scripts/rust/config/contract/reexport-visibility.config.mjs
// Rust re-export visibility contract configuration / Rust re-export 可见性契约配置
export default {
  targets: ["apps/desktop/src-tauri/src/commands", "apps/desktop/src-tauri/src/core/shared"],
  items: ["fn", "struct", "enum", "union", "trait", "type", "const", "static"],
};
