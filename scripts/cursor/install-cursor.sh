#!/usr/bin/env bash
# Install velnex skills + Cursor subagents in one step.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SKILLS_SOURCE="${VELNEX_SKILLS_SOURCE:-poirotw66/velnex-skils}"
GLOBAL=0
SKILL_ARGS=()

usage() {
    cat <<'EOF'
Usage: install-cursor.sh [OPTIONS] [-- extra npx skills add args]

Install velnex skills via npx skills add, then symlink subagents for Cursor.

Options:
  -g, --global   Global skills (~/.cursor/skills) + agents (~/.cursor/agents)
  -l, --local    Use local repo path instead of GitHub shorthand
  -h, --help     Show this help

Examples:
  ./scripts/cursor/install-cursor.sh -g
  ./scripts/cursor/install-cursor.sh -l -g
  ./scripts/cursor/install-cursor.sh -g -- --skill vif-develop --skill vif-spec
EOF
}

USE_LOCAL=0
while [[ $# -gt 0 ]]; do
    case "$1" in
        -g | --global) GLOBAL=1; shift ;;
        -l | --local) USE_LOCAL=1; shift ;;
        -h | --help) usage; exit 0 ;;
        --)
            shift
            SKILL_ARGS=("$@")
            break
            ;;
        *) SKILL_ARGS+=("$1"); shift ;;
    esac
done

if [[ "$USE_LOCAL" -eq 1 ]]; then
    SKILLS_SOURCE="${REPO_ROOT}"
fi

SKILLS_CMD=(npx skills add "${SKILLS_SOURCE}" -a cursor -a codex -y)
if [[ "$GLOBAL" -eq 1 ]]; then
    SKILLS_CMD+=(-g)
fi
if [[ ${#SKILL_ARGS[@]} -gt 0 ]]; then
    SKILLS_CMD+=("${SKILL_ARGS[@]}")
fi

echo "==> Installing skills: ${SKILLS_CMD[*]}"
"${SKILLS_CMD[@]}"

AGENT_FLAGS=()
if [[ "$GLOBAL" -eq 1 ]]; then
    AGENT_FLAGS+=(-g)
else
    AGENT_FLAGS+=(-p)
fi

echo ""
echo "==> Installing subagents (Cursor + Codex)"
node "${REPO_ROOT}/bin/velnex-install.mjs" agents "${AGENT_FLAGS[@]}"

echo ""
echo "Velnex Cursor install complete."
