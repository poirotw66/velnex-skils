# Velnex (Velocity Nexus) — Agentic Engineering Lifecycles

AI agent 驅動的端到端工程流程，從需求到交付、從漏洞到修復。

## 安裝

### Claude Code（plugin marketplace）

```bash
# 加入 marketplace
/plugin marketplace add /path/to/velnex
# 或 GitHub
/plugin marketplace add poirotw66/velnex-skils

# 安裝 plugin
/plugin install vif@velnex
/plugin install vul@velnex
/plugin install vex@velnex
```

### Cursor（[skills CLI](https://www.npmjs.com/package/skills)）

透過 `npx skills add` 安裝本 repo 內的 Agent Skills（`SKILL.md`）。與 Claude Code plugin 互補：Cursor 路徑不會一併安裝 vif agents 等 plugin 專屬整合。

```bash
# 列出可安裝的 skills（例如 vif-prd、vul-analyze）
npx skills add poirotw66/velnex-skils -l

# 安裝到 Cursor（專案內）
npx skills add poirotw66/velnex-skils -a cursor -y

# 只裝 vif 相關（範例）
npx skills add poirotw66/velnex-skils --skill vif-prd --skill vif-spec --skill vif-develop -a cursor -y

# 只裝 vul 相關（範例）
npx skills add poirotw66/velnex-skils --skill vul-analyze --skill vul-fix --skill vul-pr -a cursor -y

# 使用者全域（~/.cursor/skills/）
npx skills add poirotw66/velnex-skils -a cursor -g -y
```

本地 clone 尚未 push 時：

```bash
npx skills add /path/to/velnex -a cursor -l
npx skills add /path/to/velnex -a cursor -y
```

| 範圍 | 旗標 | Cursor 典型路徑 |
|------|------|-----------------|
| 專案 | （預設） | `.agents/skills/` |
| 全域 | `-g` | `~/.cursor/skills/` |

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
