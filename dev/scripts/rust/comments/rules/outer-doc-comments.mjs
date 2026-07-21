// dev/scripts/rust/comments/rules/outer-doc-comments.mjs
const supportedAdapters = new Set(["cli", "napi"]);

export function assertOuterDocCommentsAdapter(adapter) {
  if (!supportedAdapters.has(adapter)) {
    throw new Error(`unsupported Outer Doc Comments adapter: ${adapter}`);
  }
}
