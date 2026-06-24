# Velnex (Velocity Nexus) — Agentic Engineering Lifecycles

AI agent 驅動的端到端工程流程，從需求到交付、從漏洞到修復。

## 安裝

### Claude Code（plugin marketplace）

> GitHub repo：`poirotw66/velnex-skills`；Claude marketplace 名稱：`velnex`（`vif@velnex` 等）。

```bash
# 加入 marketplace
/plugin marketplace add /path/to/velnex-skills
# 或 GitHub
/plugin marketplace add poirotw66/velnex-skills

# 安裝 plugin
/plugin install vif@velnex
/plugin install vul@velnex
/plugin install vex@velnex
```

### Cursor & Codex（npx 一鍵安裝）

**skills + subagents（Cursor + Codex，建議）：**

```bash
npx github:poirotw66/velnex-skills -g
```

只裝某一平台：

```bash
npx github:poirotw66/velnex-skills install -g --cursor-only
npx github:poirotw66/velnex-skills install -g --codex-only
```

只裝 skills（不含 subagent，主 agent 會內聯代勞）：

```bash
npx skills add poirotw66/velnex-skills -a cursor -a codex -g -y
```

只裝 subagents：

```bash
npx github:poirotw66/velnex-skills agents -g
```

| 範圍 | 旗標 | Skills | Cursor subagents | Codex subagents |
|------|------|--------|------------------|-----------------|
| 專案 | `-p` | `.agents/skills/` | `.cursor/agents/*.md` | `.codex/agents/*.toml` |
| 全域 | `-g` | `~/.cursor/skills/` 或 `~/.codex/skills/` | `~/.cursor/agents/` | `~/.codex/agents/` |

派遣規則：

- Cursor（Task 工具）：[cursor-subagent-dispatch.md](plugins/vif/references/cursor-subagent-dispatch.md)
- Codex（spawn custom agent）：[codex-subagent-dispatch.md](plugins/vif/references/codex-subagent-dispatch.md)

安裝後重開 Cursor / Codex。`npx skills add` **不會**自動安裝 subagents。

本地開發與測試：

```bash
npm test
node bin/velnex-install.mjs install -l -g   # 從本地 repo 安裝
```

#### 解除安裝（Cursor & Codex）

```bash
npx skills list -g -a cursor    # Cursor 全域
npx skills list -g -a codex     # Codex 全域
```

透過 CLI 解除（需當初以 `npx skills add` 安裝，lock 檔有登記）：

```bash
# 移除單一 skill（Cursor / Codex 各跑一次，或同時指定）
npx skills remove vif-prd -a cursor -a codex -g -y

# 移除多個 velnex skills
npx skills remove \
  vif-arch vif-bdd vif-prd vif-spec vif-develop vif-verify vif-review vif-close \
  vif-flow vif-guideline vif-god vif-api-spec vif-ui-spec vif-uiux vif-prototype \
  vul-analyze vul-decision vul-fix vul-pr vul-cleanup \
  -a cursor -a codex -g -y

# 專案內安裝則省略 -g
npx skills remove vif-prd -a cursor -a codex -y
```

若 `skills remove` 回報 `No matching skills found`，但 `skills list` 仍看得到 vif/vul，代表當初是手動 symlink 或未寫入 lock，改用手動刪除連結即可（不會刪除本 repo 原始檔）：

```bash
# 全域 skills（Cursor 與 Codex 路徑可能不同，兩邊都檢查）
rm -f ~/.cursor/skills/vif-* ~/.cursor/skills/vul-* 2>/dev/null || true
rm -f ~/.codex/skills/vif-* ~/.codex/skills/vul-* 2>/dev/null || true

# 專案內 skills
rm -rf .agents/skills/vif-* .agents/skills/vul-*

# 全域 subagents
npx github:poirotw66/velnex-skills uninstall -g
npx github:poirotw66/velnex-skills uninstall -g --codex-only
```

刪除後重開 Cursor / Codex 或新開 Agent 對話即生效。

#### 解除安裝（Claude Code）

```text
/plugin uninstall vif@velnex
/plugin uninstall vul@velnex
/plugin uninstall vex@velnex
```

## Plugins

### vif (Velocity AI Flow)

AI 驅動的結構化開發流程，覆蓋從需求到交付的完整 SDLC。

- 15 個 skills + 6 個 agents
- 支援完全自動化（Solo）、輔助自動化（企業團隊）和 God Mode 三種模式
- 內建 TDD、Spec 先行、影響分析等核心原則

詳見 [plugins/vif/README.md](plugins/vif/README.md)

### vul (Vulnerability Unified Lifecycle)

漏洞修復 pipeline，從掃描分析到 PR 建立與清理。

- 5 個 skills：analyze → decision → fix → pr → cleanup
- 支援 Checkmarx SAST + Mend 依賴 + Docker Image 掃描
- 支援 GitHub 和 Azure DevOps 雙平台

詳見 [plugins/vul/README.md](plugins/vul/README.md)

### vex (Velnex Extensions)

通用工具集，提供跨 plugin 共用的 agents。

- git-commit：結構化 Git commit 專家（Conventional Commits + 中文 body）

## Repo 結構

```
velnex/
├── package.json                       ← npx 安裝入口（velnex-skills）
├── bin/
│   ├── velnex-install.mjs             ← skills + subagents 安裝器
│   └── lib/                           ← 安裝邏輯（agents、platforms）
├── test/                              ← 安裝器單元與整合測試
├── scripts/
│   └── cursor/                        ← bash 薄包裝（委派 velnex-install.mjs）
├── .claude-plugin/
│   └── marketplace.json               ← marketplace 定義
├── .claude/
│   └── CLAUDE.md                      ← repo 開發規範
├── docs/
│   └── vif/                           ← vif 文件（workflow guide）
├── research/                          ← 研究資料
├── plugins/
│   ├── vif/                           ← Velocity AI Flow
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/                    ← 15 個 skills
│   │   └── agents/                    ← 6 個 agents
│   ├── vul/                           ← Vulnerability Unified Lifecycle
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/                    ← 5 個 skills
│   └── vex/                           ← Velnex Extensions
│       ├── .claude-plugin/plugin.json
│       └── agents/                    ← 共用 agents
└── README.md                          ← 本文件
```
