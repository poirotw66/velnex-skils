# Cursor Subagent Dispatch

Use this reference when running vif in **Cursor** (skills installed via `npx skills add`).

Claude Code loads agents from the plugin automatically. Cursor requires agents under `~/.cursor/agents/` or `.cursor/agents/`.

## Prerequisite

```bash
# One command (skills + agents for Cursor and Codex)
npx github:poirotw66/velnex-skils -g

# Cursor agents only
npx github:poirotw66/velnex-skils agents -g --cursor-only

# Local clone
node bin/velnex-install.mjs agents -g --cursor-only
```

## Iron Rule

When a skill says **「派遣 `X` agent」**, the orchestrating skill **must** launch subagent `X` via the **Task** tool. The parent agent must **not** inline that work (write tests, implement code, run review, etc.) unless the subagent fails twice with the same blocker.

## Agent Registry

| `subagent_type` | Source file | Typical dispatcher | `readonly` |
|-----------------|-------------|-------------------|------------|
| `test-writer` | `plugins/vif/agents/test-writer.md` | vif-develop | `false` |
| `implementer` | `plugins/vif/agents/implementer.md` | vif-develop | `false` |
| `spec-auditor` | `plugins/vif/agents/spec-auditor.md` | vif-spec, vif-api-spec, vif-ui-spec, vif-develop, vif-close | `true` |
| `reviewer` | `plugins/vif/agents/reviewer.md` | vif-review | `false` |
| `verifier` | `plugins/vif/agents/verifier.md` | vif-verify | `false` |
| `security-reviewer` | `plugins/vif/agents/security-reviewer.md` | vif-verify | `true` |
| `git-commit` | `plugins/vex/agents/git-commit.md` | vif-develop, vif-flow commits | `false` |

## Task Invocation Template

Launch **exactly one** subagent per dispatch:

```
Task tool:
  subagent_type: "<name from table>"
  description: "<short label, e.g. TDD RED spec-001-task-3>"
  readonly: <true|false per table>
  run_in_background: false
  prompt: |
    Follow your agent definition (already loaded as system prompt).

    ## Dispatch Context
    <paste Context Block from dispatch-contract.md>

    ## Instructions
    <stage-specific steps from the parent skill>
```

Build the **Dispatch Context** block per `plugins/vif/skills/vif-flow/references/dispatch-contract.md`.

## Per-Stage Quick Reference

### vif-develop

| Stage | `subagent_type` | Parent keeps |
|-------|-----------------|--------------|
| RED | `test-writer` | Guideline fetch, RED→GREEN gate (verify file exists + test fails) |
| GREEN / REFACTOR | `implementer` | NEEDS_CONTEXT routing, progress.md, lightweight verify |
| Commit | `git-commit` | Provide task summary + model name for Co-Authored-By |

### vif-spec / vif-api-spec / vif-ui-spec

| Step | `subagent_type` | Notes |
|------|-----------------|-------|
| Review before commit | `spec-auditor` | Set `scope` + `targets` per dispatch-contract.md |

### vif-verify

| Stage | `subagent_type` | Notes |
|-------|-----------------|-------|
| Core Stages 1–6 | `verifier` | Parent assembles verification report from agent output |
| Security | `security-reviewer` | `readonly: true` |
| Code Quality `/simplify` | — | **Skip in Cursor** (Claude Code only) |

### vif-review

| Stage | `subagent_type` |
|-------|-----------------|
| Full review | `reviewer` |

### vif-close

| Pass | `subagent_type` | `scope` |
|------|-----------------|---------|
| 1 | `spec-auditor` | `design-review` |
| 2 | `spec-auditor` | `cross-check` |

## Failure Handling

1. Wrong invocation (bad prompt shape, wrong `subagent_type`) → fix and retry **once** immediately.
2. Subagent `BLOCKED` / `BLOCKED_BY_SPEC` → parent escalates per vif-flow Escalation Protocol; do not inline.
3. Subagent unavailable (Task errors: unknown agent) → run `npx github:poirotw66/velnex-skils agents -g --cursor-only` and restart Cursor.

## Uninstall

```bash
npx github:poirotw66/velnex-skils uninstall -g --cursor-only
```
