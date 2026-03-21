#!/usr/bin/env bash
set -euo pipefail

echo "▶ Build Go sidecar"
pnpm -F @virganol/desktop build:sidecar

echo "▶ Rust check"
pushd apps/desktop/src-tauri >/dev/null
cargo check
popd >/dev/null

echo "▶ Rust test"
pushd apps/desktop/src-tauri >/dev/null
cargo test
popd >/dev/null
