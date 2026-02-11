#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI_PACKAGE_DIR="$ROOT_DIR/cli-package"

mkdir -p "$CLI_PACKAGE_DIR/src/cli" "$CLI_PACKAGE_DIR/src/config" "$CLI_PACKAGE_DIR/src/shared"

rsync -a --delete "$ROOT_DIR/src/cli/" "$CLI_PACKAGE_DIR/src/cli/"
rsync -a --delete "$ROOT_DIR/src/config/agents.ts" "$CLI_PACKAGE_DIR/src/config/agents.ts"
rsync -a --delete "$ROOT_DIR/src/shared/" "$CLI_PACKAGE_DIR/src/shared/"

echo "Synced CLI sources from src/ -> cli-package/src/."
