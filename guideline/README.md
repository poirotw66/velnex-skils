# vif 開發流程規範

本目錄為人類參考文件，描述 vif 的完整開發流程。

> 實際的 AI skill 定義在 `plugins/vif/skills/` 下，本目錄僅供人類閱讀和理解流程。

## 流程總覽

```
/vif-arch → /vif-prd → /vif-bdd(可選) → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

## Skill 清單

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

## 兩種模式

### 模式一：完全自動化

AI 為主力，Human 為審查角色。適合 solo 或小團隊。

- BDD 是標準流程的一部分
- AI 自動串接各階段
- 一人驅動完整流程

### 模式二：輔助自動化

各角色各自驅動 AI。適合企業團隊（PM、PD、SA、SD、Frontend、Backend、QA）。

- BDD 是可選的
- 各角色使用對應的 skill
- Figma 是重要輸入來源

## 文件結構（導入 vif 的專案）

```
project/
├── .claude/
│   └── CLAUDE.md                      ← 專案規範 + vif 設定
│
├── docs/
│   ├── architecture/                  ← ADR 架構決策記錄
│   │   └── adr-NNN-[name].md
│   │
│   ├── prd-NNN.md                     ← 需求規格（WHY + WHAT）
│   │
│   ├── features/                      ← BDD 行為規格（可選）
│   │   └── [domain]/
│   │       └── [name].feature
│   │
│   ├── specs/                         ← 技術規劃（per-feature）
│   │   ├── specs-overview.md          ← 索引
│   │   └── NNN-name/
│   │       ├── spec.md                ← 作戰計畫
│   │       └── progress.md            ← 進度追蹤
│   │
│   ├── api-specs/                     ← API 設計（累積型，per-module）
│   │   └── [module]/
│   │       ├── openapi.yaml           ← OpenAPI 3.x
│   │       └── [domain]/
│   │           └── [name].md          ← 單支 API 完整規格
│   │
│   ├── ui-specs/                      ← UI 設計（累積型，per-page）
│   │   └── [module]/
│   │       └── [page]/
│   │           └── [name].md          ← 頁面規格
│   │
│   ├── schema/                        ← DB Schema（累積型，per-domain）
│   │   └── [domain].md                ← Table 定義 + 關聯 + Migration
│   │
│   └── feature-map.md                 ← 功能追蹤
│
├── guideline/                         ← 開發規範（專案特定）
│   ├── api/                           ← API 開發規範 + 撰寫模板
│   ├── ui/                            ← UI 開發規範 + 撰寫模板
│   └── schema/                        ← Schema 命名規範
│
└── src/
    └── ...
```

### 文件性質

| 目錄 | 性質 | 誰產出 | 更新頻率 |
|------|------|--------|---------|
| `docs/architecture/` | 累積型 | Architect / SA | 少（重大決策時） |
| `docs/prd-*.md` | per-feature | PD / PM | 寫完不改 |
| `docs/features/` | per-feature（可選） | PD / PM | 偶爾修正 |
| `docs/specs/` | per-feature | SA / SD / AI | 開發中更新 |
| `docs/api-specs/` | 累積型 | Backend / SA | 隨功能迭代 |
| `docs/ui-specs/` | 累積型 | Frontend / PD | 隨功能迭代 |
| `docs/schema/` | 累積型 | Backend / SA | 隨功能迭代 |
| `guideline/` | 穩定型 | 專案初期建立 | 很少 |

## Agents

Skills 在特定階段會派遣 agents（subagents）執行工作：

| Agent | 用途 | 工具限制 | 派遣者 |
|-------|------|---------|--------|
| `test-writer` | TDD RED：寫失敗測試 | 無限制 | `/vif-develop` |
| `implementer` | TDD GREEN + REFACTOR：最小實作 | 無限制 | `/vif-develop` |
| `spec-reviewer` | 審查 spec + 設計文件 | 無限制 | `/vif-spec` |
| `reviewer` | 程式碼審查（合規 + 品質） | 無限制 | `/vif-review` |
| `verifier` | 驗證 pipeline（Build → Test → Diff） | Bash + Read | `/vif-verify` |
| `security-reviewer` | OWASP Top 10 安全性檢查 | Read only | `/vif-verify` |

> `/vif-verify` 的 Code Quality 檢查使用 Claude Code 內建的 `/simplify` skill（非 Claude Code 環境不適用）。

## Human 介入點

| Gate | Human 行為 | 說明 |
|------|-----------|------|
| PRD → Spec | Approve PRD | 確認問題定義與方向 |
| Spec → Develop | Approve Spec | 確認涉及範圍 + 設計文件 |
| Review → Close | Approve Code | 最終審查 |

## Commit Points

| 時機 | Message 範例 |
|------|-------------|
| PRD approved | `docs: add prd-001 user-login` |
| BDD 完成 | `docs: add feature iam/user-login` |
| Spec approved | `docs: add spec-001 user-login` |
| 設計文件完成 | `docs: add api-spec iam/auth/login` |
| 開發 per-scenario | `feat: implement login API (spec-001)` |
| Review 修復 | `fix: address review feedback (spec-001)` |
| 收尾 | `docs: close spec-001, update feature-map` |

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
| **ECC**（Affaan-M） | De-Sloppify、OWASP Top 10、六階段驗證 |
| **gstack**（Garry Tan） | 認知模式轉換、Error Mapping、推薦導向 |

## 其他參考

- 研究報告：`guideline/ai-driven-development-research-report.md`
- 測試規範：`plugins/vif/skills/vif-develop/references/testing-guideline.md`
