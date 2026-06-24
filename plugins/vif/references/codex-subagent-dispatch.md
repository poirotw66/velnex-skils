# Codex Subagent Dispatch

Use this reference when running vif in **OpenAI Codex** (skills installed via `npx skills add -a codex`).

Codex custom agents are **TOML files** in `~/.codex/agents/` (not Markdown like Cursor). Install them with:

```bash
npx github:poirotw66/velnex-skils -g
# Codex only:
npx github:poirotw66/velnex-skils install -g --codex-only
```

## Iron Rule

When a skill says **「派遣 `X` agent」**, the orchestrating skill **must** explicitly ask Codex to **spawn** custom agent `X` by name. The parent agent must **not** inline that work.

> Codex does not auto-spawn subagents. Use explicit instructions such as:  
> **「Spawn the `test-writer` custom agent with the dispatch context below.」**

## Agent Registry

| Agent `name` | TOML file | Typical dispatcher | `sandbox_mode` |
|--------------|-----------|-------------------|----------------|
| `test-writer` | `test-writer.toml` | vif-develop | `workspace-write` |
| `implementer` | `implementer.toml` | vif-develop | `workspace-write` |
| `spec-auditor` | `spec-auditor.toml` | vif-spec, vif-api-spec, vif-ui-spec, vif-close | `read-only` |
| `reviewer` | `reviewer.toml` | vif-review | `workspace-write` |
| `verifier` | `verifier.toml` | vif-verify | `workspace-write` |
| `security-reviewer` | `security-reviewer.toml` | vif-verify | `read-only` |
| `git-commit` | `git-commit.toml` | vif-develop, commits | `workspace-write` |

## Spawn Template

Include in the parent turn (after building Dispatch Context from `dispatch-contract.md`):

```text
Spawn the `{agent-name}` custom agent as a subagent.

Wait for it to finish before continuing.

## Dispatch Context
<paste Context Block>

## Stage instructions
<steps from parent skill for this stage>
```

For parallel work (rare in vif), state clearly how many agents and how to merge results.

## Per-Stage Quick Reference

Same dispatch points as Cursor — see `cursor-subagent-dispatch.md` for the stage table. Differences:

| Item | Codex behavior |
|------|----------------|
| Code Quality `/simplify` | **Skip** (Claude Code only) |
| Spawn mechanism | Named custom agent in `~/.codex/agents/*.toml` |
| Read-only agents | `spec-auditor`, `security-reviewer` use `sandbox_mode = "read-only"` in TOML |

## Failure Handling

1. Agent not found → run `npx github:poirotw66/velnex-skils agents -g --codex-only` and restart Codex.
2. Parent inlined work → stop and re-run with explicit spawn instruction.
3. `BLOCKED` / `BLOCKED_BY_SPEC` → escalate per vif-flow; do not fix inline.

## Uninstall

```bash
npx github:poirotw66/velnex-skils uninstall -g --codex-only
```
