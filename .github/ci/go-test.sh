#!/usr/bin/env bash
set -euo pipefail

echo "▶ Go test"
pushd apps/server >/dev/null
go test ./...
popd >/dev/null
