#!/usr/bin/env bash
set -euo pipefail

echo "▶ Rust check"
pushd apps/desktop/src-tauri >/dev/null
cargo check
popd >/dev/null
