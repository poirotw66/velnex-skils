#!/usr/bin/env bash
# Symlink vif + vex agent definitions into Cursor's agents directory.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SCOPE="global"
FORCE=0

usage() {
    cat <<'EOF'
Usage: install-agents.sh [OPTIONS]

Symlink velnex plugin agents into Cursor (~/.cursor/agents or .cursor/agents).

Options:
  -g, --global   Install to ~/.cursor/agents (default)
  -p, --project  Install to <repo>/.cursor/agents
  -f, --force    Replace existing symlinks that point to this repo's agents
  -h, --help     Show this help
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -g | --global) SCOPE="global"; shift ;;
        -p | --project) SCOPE="project"; shift ;;
        -f | --force) FORCE=1; shift ;;
        -h | --help) usage; exit 0 ;;
        *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
    esac
done

if [[ "$SCOPE" == "global" ]]; then
    TARGET_DIR="${HOME}/.cursor/agents"
else
    TARGET_DIR="${REPO_ROOT}/.cursor/agents"
fi

mkdir -p "$TARGET_DIR"

AGENT_DIRS=(
    "${REPO_ROOT}/plugins/vif/agents"
    "${REPO_ROOT}/plugins/vex/agents"
)

VELNEX_MARKER="${TARGET_DIR}/.velnex-agents"

link_agent() {
    local agent_file="$1"
    local agent_name
    agent_name="$(basename "$agent_file")"
    local link_path="${TARGET_DIR}/${agent_name}"

    if [[ -e "$link_path" ]] && [[ ! -L "$link_path" ]]; then
        echo "skip (not a symlink): ${link_path}" >&2
        return 0
    fi

    if [[ -L "$link_path" ]]; then
        local current_target
        current_target="$(readlink "$link_path")"
        if [[ "$current_target" == "$agent_file" ]]; then
            echo "already linked: ${agent_name}"
            return 0
        fi
        if [[ "$FORCE" -eq 0 ]]; then
            echo "skip (exists): ${link_path} -> ${current_target} (use --force)" >&2
            return 0
        fi
        rm -f "$link_path"
    fi

    ln -sf "$agent_file" "$link_path"
    echo "linked: ${agent_name} -> ${agent_file}"
}

linked_count=0
for agent_dir in "${AGENT_DIRS[@]}"; do
    if [[ ! -d "$agent_dir" ]]; then
        echo "warning: missing agent dir ${agent_dir}" >&2
        continue
    fi
    for agent_file in "${agent_dir}"/*.md; do
        [[ -f "$agent_file" ]] || continue
        link_agent "$agent_file"
        linked_count=$((linked_count + 1))
    done
done

cat >"$VELNEX_MARKER" <<EOF
repo_root=${REPO_ROOT}
scope=${SCOPE}
installed_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo ""
echo "Done. ${linked_count} agent(s) processed in ${TARGET_DIR}"
echo "Restart Cursor or start a new Agent chat to pick up subagents."
