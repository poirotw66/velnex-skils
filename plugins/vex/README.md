# vex (Velnex Extensions)

通用工具集，提供跨 plugin 共用的 agents 和工具。

## Agents

### git-commit

結構化 Git commit 專家，自動分析 staged 變更並產出符合 Conventional Commits 規範的 commit message。

- 第一行：英文，小寫，祈使語氣（max 50 字元）
- Body：繁體中文描述變更細節（max 72 字元/行）
- 自動加入 `Co-Authored-By` 標記

**支援的 commit type**：`feat`、`fix`、`docs`、`refactor`、`test`、`chore`

## 安裝

### Claude Code

```bash
/plugin marketplace add poirotw66/velnex-skills
/plugin install vex@velnex
```

### Cursor & Codex

`git-commit` agent 會隨 vif 一併安裝（`velnex-install` 包含 `plugins/vex/agents/`）：

```bash
npx github:poirotw66/velnex-skills agents -g
# 或完整安裝（vif skills + 全部 subagents）
npx github:poirotw66/velnex-skills -g
```

## 使用方式

git-commit agent 會由其他 plugin 的 skill 自動派遣，也可由 CLAUDE.md 全域指引觸發。

當 skill 需要提交變更時：
1. 優先使用 git-commit agent
2. 如果 agent 不可用，fallback 為直接 `git commit`
