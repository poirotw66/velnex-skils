#!/usr/bin/env bash
# Deprecated wrapper — use: node bin/velnex-install.mjs uninstall
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
exec node "${REPO_ROOT}/bin/velnex-install.mjs" uninstall "$@"
