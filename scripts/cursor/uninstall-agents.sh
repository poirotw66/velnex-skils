#!/usr/bin/env bash
# Remove velnex agent symlinks from Cursor's agents directory.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SCOPE="global"

usage() {
    cat <<'EOF'
Usage: uninstall-agents.sh [OPTIONS]

Remove velnex agent symlinks from Cursor (~/.cursor/agents or .cursor/agents).

Options:
  -g, --global   Uninstall from ~/.cursor/agents (default)
  -p, --project  Uninstall from <repo>/.cursor/agents
  -h, --help     Show this help
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -g | --global) SCOPE="global"; shift ;;
        -p | --project) SCOPE="project"; shift ;;
        -h | --help) usage; exit 0 ;;
        *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
    esac
done

if [[ "$SCOPE" == "global" ]]; then
    TARGET_DIR="${HOME}/.cursor/agents"
else
    TARGET_DIR="${REPO_ROOT}/.cursor/agents"
fi

if [[ ! -d "$TARGET_DIR" ]]; then
    echo "Nothing to remove: ${TARGET_DIR} does not exist"
    exit 0
fi

removed=0
for link_path in "${TARGET_DIR}"/*.md; do
    [[ -L "$link_path" ]] || continue
    target="$(readlink "$link_path")"
    if [[ "$target" == *"/velnex/plugins/"*"/agents/"* ]] \
        || [[ "$target" == "${REPO_ROOT}/plugins/"*"/agents/"* ]]; then
        rm -f "$link_path"
        echo "removed: $(basename "$link_path")"
        removed=$((removed + 1))
    fi
done

rm -f "${TARGET_DIR}/.velnex-agents"

echo ""
echo "Done. ${removed} velnex agent symlink(s) removed from ${TARGET_DIR}"
