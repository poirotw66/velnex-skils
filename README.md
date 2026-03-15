# vif — AI-Driven Development Flow

Claude Code plugin，提供 11 個 skills + 6 個 agents 的結構化開發流程。

支援兩種模式：
- **完全自動化** — 一人驅動 AI 完成整個開發流程（Solo / 小團隊）
- **輔助自動化** — 各角色各自驅動 AI 處理自己負責的工作（企業團隊）

## 安裝

```bash
# 加入 marketplace
/plugin marketplace add /path/to/velnex
# 或 GitHub
/plugin marketplace add your-org/velnex

# 安裝 plugin
/plugin install vif@velnex
```

## Skills

| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | `/vif-arch` | 架構決策 + ADR 記錄 |
| 需求 | `/vif-prd` | PRD 撰寫 |
| 行為 | `/vif-bdd` | BDD Discovery → .feature（可選） |
| 規劃 | `/vif-spec` | 影響分析 + 技術規劃 |
| 設計 | `/vif-ui-spec` | UI 頁面規格（Figma → spec） |
| 設計 | `/vif-api-spec` | API 規格 + openapi.yaml + dbschema |
| 開發 | `/vif-develop` | TDD 開發（含測試策略選擇） |
| 驗證 | `/vif-verify` | 自動化驗證（Core + Optional） |
| 審查 | `/vif-review` | 程式碼審查（合規 + 品質） |
| 收尾 | `/vif-close` | 文件同步 + 完成檢查清單 |
| 總覽 | `/vif-flow` | 流程編排 + routing |

## Agents

| Agent | 用途 | 工具限制 | 派遣者 |
|-------|------|---------|--------|
| `test-writer` | TDD RED 階段：寫失敗測試 | 無限制 | `/vif-develop` |
| `implementer` | TDD GREEN + REFACTOR：最小實作 + 清理 | 無限制 | `/vif-develop` |
| `spec-reviewer` | 審查 .feature + spec.md + 設計文件 | 無限制 | `/vif-spec` |
| `reviewer` | 兩階段程式碼審查（合規 + 品質） | 無限制 | `/vif-review` |
| `verifier` | 自動化驗證 pipeline | Bash + Read only | `/vif-verify` |
| `security-reviewer` | OWASP Top 10 安全性檢查 | Read only | `/vif-verify` |

### 為什麼需要分 agent？

- **test-writer / implementer** — TDD 紀律：強制 RED 和 GREEN 分離，防止「一邊想實作一邊寫測試」
- **verifier / security-reviewer** — 工具限制：只檢測不修復，防止驗證過程意外修改程式碼
- **spec-reviewer / reviewer** — Context 隔離：獨立審查視角，不受開發者偏見影響

## 兩種模式

### 模式一：完全自動化

一人驅動 AI 走完整流程。適合 solo 或小團隊。

```
/vif-prd → /vif-bdd → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

### 模式二：輔助自動化

各角色各自驅動 AI。適合企業團隊。

```
Architect:  /vif-arch
PD/PM:      /vif-prd → /vif-bdd（可選）
Designer:   Figma（手動）
SA/SD:      /vif-spec
Frontend:   /vif-ui-spec
Backend:    /vif-api-spec
PGs:        /vif-develop → /vif-verify → /vif-review
All:        /vif-close
```

## 導入新專案

詳見 `plugins/vif/skills/vif-flow/references/project-setup.md`。

簡要步驟：

1. 安裝 vif plugin
2. 建立專案目錄結構：

```
project/
├── .claude/
│   └── CLAUDE.md              ← 專案規範 + vif 設定
├── docs/
│   ├── architecture/          ← ADR 架構決策記錄
│   ├── prd-NNN.md             ← 需求規格
│   ├── features/              ← BDD .feature（可選）
│   ├── specs/                 ← 技術規劃
│   │   └── specs-overview.md
│   ├── api-specs/             ← API 設計 + openapi.yaml
│   ├── ui-specs/              ← UI 頁面設計
│   ├── schema/                ← DB Schema
│   └── feature-map.md         ← 功能追蹤
├── guideline/                 ← 開發規範（專案特定）
└── src/
```

3. 在 CLAUDE.md 加入 vif skill 清單和專案設定
4. 執行 `/vif-arch` 記錄架構決策
5. 開始使用 `/vif-prd` 或直接告訴 AI 你想做什麼

## Repo 結構

```
velnex/
├── README.md                          ← 本文件
├── .claude-plugin/
│   └── marketplace.json               ← marketplace 定義
├── plugins/vif/
│   ├── .claude-plugin/
│   │   └── plugin.json                ← plugin manifest (v2.0.0)
│   ├── skills/                        ← 11 個 skills（SKILL.md + references）
│   │   ├── vif-arch/
│   │   ├── vif-prd/
│   │   ├── vif-bdd/
│   │   ├── vif-spec/
│   │   ├── vif-ui-spec/
│   │   ├── vif-api-spec/
│   │   ├── vif-develop/
│   │   ├── vif-verify/
│   │   ├── vif-review/
│   │   ├── vif-close/
│   │   └── vif-flow/
│   └── agents/                        ← 6 個 agents
│       ├── test-writer.md
│       ├── implementer.md
│       ├── spec-reviewer.md
│       ├── reviewer.md
│       ├── verifier.md
│       └── security-reviewer.md
├── guideline/                         ← 流程參考文件
│   ├── README.md                      ← 完整流程說明
│   ├── testing-guideline.md
│   └── ai-driven-development-research-report.md
└── docs/                              ← velnex 自身的追蹤文件
```

## 核心原則

1. **行為先於設計** — 先理解「系統該做什麼」再設計「怎麼做到」
2. **影響分析是核心** — 判斷新增 vs 修改既有，修改比新增更危險
3. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **驗證即誠實** — 每一個聲明都要有新鮮的證據支撐
6. **最多重試 3 次** — 超過就 escalate 給 Human

## 參考框架

vif 整合了以下框架的精華：

| 框架 | 採用的概念 |
|------|-----------|
| **Spec Kit**（GitHub） | 規格驅動開發、Power Inversion |
| **Superpowers**（obra） | Hard Gate、Verification Principle、Don't Trust the Report |
| **OpenSpec**（Fission AI） | Explore Stance、Curious not Prescriptive |
| **ECC**（Affaan-M） | De-Sloppify、OWASP Top 10、Verification Loop |
| **gstack**（Garry Tan） | 認知模式轉換、Error Mapping、推薦導向 |
