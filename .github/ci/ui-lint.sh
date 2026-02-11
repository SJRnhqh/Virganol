#!/usr/bin/env bash
set -euo pipefail

echo "▶ UI lint"
pnpm -F @virganol/ui lint
