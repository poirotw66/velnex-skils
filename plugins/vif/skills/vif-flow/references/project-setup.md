# Project Setup Guide

> Workspace 模式說明見 `/vif-flow` Workspace Mode section。
> 本文件分成三部分：Overview、兩種模式的設定步驟、共用 Reference（CLAUDE.md 區塊、追蹤文件模板、Health Check）。

---

## Overview

vif 支援兩種 workspace 模式，擇一使用：

| 模式 | 適用情境 | docs 與 code 關係 |
|------|---------|-------------------|
| **Monorepo**（預設） | 小型 / 中型專案，docs 與 code 在同一個 repo | 同 repo，`docs/` 為子目錄 |
| **Multi-Repo** | 大型專案、docs 與 code 獨立維護（如前後端分離） | 多個 repo 並列，docs repo 獨立 |

兩種模式的設定流程骨架一致：

```
1. 安裝 plugin      →  2. 建立目錄結構      →  3. 設定 CLAUDE.md
        ↓                       ↓                        ↓
4. 初始化追蹤文件   →  5. 架構決策          →  6. Health Check   →  7. 開始使用
```

差異在步驟 1（多個 repo 各自安裝）、2、3（多份 CLAUDE.md + Workspace 宣告）、4、5（追蹤文件與架構決策只在 docs repo 執行）。

---

## Part A — Monorepo 設定

### A.1 安裝 vif plugin

**Claude Code:**

```bash
/plugin marketplace add [velnex-repo-path-or-url]
/plugin install vif@velnex
/plugin install vex@velnex        # git-commit agent（vif 依賴）
```

**Cursor & Codex** (skills + subagents):

```bash
npx github:poirotw66/velnex-skils -g
# or local clone: npx . -g
```

### A.2 建立目錄結構

```
your-project/
├── .claude/
│   └── CLAUDE.md                  ← 專案規範 + vif 設定
├── docs/
│   ├── prds/                      [必要] PRD 文件
│   │   └── prd-NNN.md
│   ├── specs/                     [必要] 技術規劃
│   │   ├── specs-overview.md
│   │   └── NNN-name/
│   │       ├── spec.md
│   │       ├── progress.md
│   │       ├── verification-report.md   ← Phase 3 驗證報告
│   │       ├── review-report.md         ← Phase 4 審查報告
│   │       └── god-mode-report.md       ← God Mode 報告（如使用）
│   ├── api-specs/                 [視需要] API 設計（per-module）
│   ├── ui-specs/                  [視需要] UI 設計（per-page）
│   ├── schema/                    [視需要] DB Schema（per-domain）
│   ├── architecture/              [視需要] ADR 架構決策記錄
│   └── features/                  [視需要] BDD .feature
├── guideline/                     [視需要] 開發規範
└── src/
    └── ...                        （專案原始碼）
```

| 分類 | 何時建立 |
|------|---------|
| **[必要]** | 專案 init 時建立 |
| **[視需要]** | 首次使用對應 skill 時自動建立 |

### A.3 設定 `.claude/CLAUDE.md`

依 [Reference R1：CLAUDE.md 區塊總覽](#r1-claudemd-區塊總覽) 撰寫。Monorepo 需包含：

- **必要**：AI-Driven Development Flow、Skills、Git 規範
- **建議**：flow_mode、技術棧、專案指令、測試策略、vif-verify 設定
- **可選**：AI Cross-Review、Guideline 映射、Templates

> `vif Workspace` 區塊 Monorepo 不需要。

### A.4 初始化追蹤文件

建立 `docs/specs/specs-overview.md`（模板見 [R2](#r2-specs-overviewmd-模板)）。

### A.5 架構決策

```
/vif-arch
```

會引導完成技術棧選擇、專案架構、共用規範、測試策略，並自動回填 CLAUDE.md。

### A.6 Health Check

Init 完成後自動執行（見 `/vif-flow` Health Check）。**BLOCK = 0 才算 init 完成。** WARN / INFO 列出供參考，不阻擋。

### A.7 開始使用

```
> 我想加一個使用者登入功能
AI：讓我們從 /vif-prd 開始...
```

---

## Part B — Multi-Repo 設定

### B.1 安裝 vif plugin

**每個 repo** 都需安裝（步驟同 [A.1](#a1-安裝-vif-plugin)）。

### B.2 建立目錄結構

```
workspace/
├── project-docs/                  ← docs repo（根目錄即 docs/）
│   ├── .claude/CLAUDE.md          ← Workspace + vif 完整設定
│   ├── prds/                      [必要]
│   ├── specs/                     [必要]
│   ├── api-specs/                 [視需要]
│   ├── ui-specs/                  [視需要]
│   ├── schema/                    [視需要]
│   ├── architecture/              [視需要]
│   ├── features/                  [視需要]
│   └── guideline/                 [視需要]
├── project-frontend/              ← frontend code repo
│   ├── .claude/CLAUDE.md          ← Workspace + 技術棧
│   ├── src/
│   └── test/
└── project-backend/               ← backend code repo
    ├── .claude/CLAUDE.md          ← Workspace + 技術棧
    ├── src/
    └── test/
```

> Code repo 可依需要增減（單 code repo、三個以上 repo 都可以）。

### B.3 設定各 Repo 的 CLAUDE.md

Multi-Repo 的關鍵差異：**每個 repo 的 CLAUDE.md 都必須有 `vif Workspace` 區塊宣告彼此的相對位置**，且 vif 設定依角色分布：

| 角色 | CLAUDE.md 必備區塊 |
|------|-------------------|
| **docs repo** | `vif Workspace` + `AI-Driven Development Flow` 標頭 + Skills + Git + Templates + AI Cross-Review + Guideline 映射 |
| **code repo**（frontend / backend / 其他）| `vif Workspace` + `AI-Driven Development Flow` 標頭 + 技術棧 + 專案指令 + 測試策略 + Git |

詳細區塊內容見 [R1](#r1-claudemd-區塊總覽)。

**`vif Workspace` 區塊的路徑規則：**

- **當前 repo 對應那一列：路徑填 `.`**
- 其他 repo 填相對路徑（通常是 `../repo-name`）
- 三個 repo 的 Workspace 表格結構相同，**差異只在哪一列的路徑填 `.`**

**三份範例：**

docs repo（`project-docs/.claude/CLAUDE.md`）：
```markdown
## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | . | prds/, api-specs/, ui-specs/, schema/, specs/, guideline/ |
| frontend | ../project-frontend | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: docs
```

frontend repo（`project-frontend/.claude/CLAUDE.md`）：
```markdown
## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | ../project-docs | prds/, api-specs/, ui-specs/, schema/, specs/, guideline/ |
| frontend | . | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: frontend
```

backend repo（`project-backend/.claude/CLAUDE.md`）：
```markdown
## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | ../project-docs | prds/, api-specs/, ui-specs/, schema/, specs/, guideline/ |
| frontend | ../project-frontend | src/, test/ |
| backend | . | src/, test/ |

當前 repo 角色: backend
```

### B.4 初始化追蹤文件

**只在 docs repo 執行**：建立 `specs/specs-overview.md`（模板見 [R2](#r2-specs-overviewmd-模板)）。

### B.5 架構決策

**只在 docs repo 執行**：`/vif-arch`，會自動回填各 code repo 的 CLAUDE.md 技術棧相關區塊。

### B.6 Health Check

Multi-repo 特有的 BLOCK 項目：

- 各 repo 路徑可達
- 各 repo 是 git repo
- 各 repo 的 CLAUDE.md 有 `vif Workspace` 區塊且角色不衝突

完整檢查見 `/vif-flow` Health Check。

### B.7 開始使用

```
> 我是 SA，需要根據 PRD-001 和 Figma 規劃技術 spec
AI：讓我用 /vif-spec 來分析影響範圍...
```

> 視當前 repo 角色，skill 會自動透過 Workspace 解析路徑。例如 `/vif-spec` 在 frontend repo 執行時，會讀寫 `../project-docs/specs/` 下的文件。

---

## Reference

### R1: CLAUDE.md 區塊總覽

依需求組合。下方以 Monorepo 範本呈現，Multi-Repo 只需額外加入 `vif Workspace` 區塊（放在最前面）並依角色裁剪。

```markdown
# [專案名稱]

## vif Workspace                    ← [Multi-Repo 必要, Monorepo 不需]

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | . | prds/, specs/, ... |
| frontend | ../project-frontend | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: docs

## AI-Driven Development Flow       ← [必要]

本專案採用 vif。

模式：完全自動化（Solo）
流程：技術先行

> 模式選項：完全自動化（Solo）/ 輔助自動化（Team）
> 流程選項：技術先行 / 產品先行

### flow_mode（可選）

> PRD approved 後的預設行為。未設定時，PRD 後會提示選擇。
>
> - `god` — 自動跑完 Spec→Review
> - `normal` — 逐階段手動推進（預設）

<!-- - flow_mode: god -->

### Skills                          ← [必要]

| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | `/vif-arch` | 架構決策 + ADR |
| 設計基礎 | `/vif-uiux` | UI/UX 設計基礎 |
| 需求 | `/vif-prd` | PRD 撰寫 |
| 行為 | `/vif-bdd` | BDD Discovery（可選） |
| 規劃 | `/vif-spec` | 影響分析 + 技術規劃 |
| 原型 | `/vif-prototype` | HTML 原型（可選） |
| 設計 | `/vif-ui-spec` | UI 頁面規格 |
| 設計 | `/vif-api-spec` | API + openapi + dbschema |
| 開發 | `/vif-develop` | TDD 開發 |
| 驗證 | `/vif-verify` | 自動化驗證 |
| 審查 | `/vif-review` | 程式碼審查 |
| 收尾 | `/vif-close` | 完成檢查清單 |
| 全自動 | `/vif-god` | God Mode：PRD 確認後全自動開發 |

### 技術棧                           ← [建議, /vif-arch 自動填]

- 語言：[TypeScript / Python / Go / ...]
- 框架：[Next.js / FastAPI / Gin / ...]
- 測試：[Jest / Vitest / pytest / ...]
- 建構：[npm / bun / cargo / ...]

### 專案指令                         ← [建議, /vif-arch 自動填]

- Build: `[npm run build / ...]`
- Test: `[npm test / ...]`
- Lint: `[npm run lint / ...]`
- Type Check: `[npx tsc --noEmit / ...]`

### 測試策略                         ← [建議, /vif-arch 自動填]

- Backend: Unit + Integration
- Frontend: Unit + 關鍵流程 E2E

### Git 規範                         ← [必要]

- 使用 git-commit subagent 執行 commit
- dispatch 時附上當前模型名稱（供 Co-Authored-By 使用）

### 設計基礎                         ← [建議, /vif-uiux 自動填]

詳見 `guideline/ui/ui-guideline.md`

### vif-verify 設定                  ← [可選]

> 啟用 /vif-verify 的 Code Quality 檢查（Reuse、Quality、Efficiency）。

<!-- - Code Quality: true -->

### AI Cross-Review                  ← [可選]

> 原 agent 審查（spec-auditor / security-reviewer / reviewer）與第二個 AI CLI（如 Codex）平行進行獨立審查，比對結果。
>
> - **solo**：設計文件在開發前統一審查一次（/vif-develop entry gate）
> - **team**：各 skill 完成時個別審查（/vif-spec, /vif-api-spec, /vif-ui-spec）
> - **verify / review**：分別在 /vif-verify 和 /vif-review 與原 agent 平行進行
>
> 完整觸發時機見 vif-flow「AI Cross-Review Trigger Points」。

<!-- - mode: solo -->
<!-- - design: codex -->
<!-- - verify: codex -->
<!-- - review: codex -->

### Guideline 映射                   ← [可選]

> 指定各 context 對應的 guideline 路徑，讓 /vif-guideline 注入正確的規範。未設定時依目錄慣例自動匹配。

<!-- - api-spec → guideline/backend/ -->
<!-- - ui-spec → guideline/frontend/ -->
<!-- - testing → guideline/testing/ -->

### Templates                        ← [可選]

> 覆蓋 plugin 內建模板（`references/*-template.md`）。
> Multi-repo 下此設定**只放在 docs repo**。
> 路徑相對於 CLAUDE.md 所在的 repo 根目錄：Monorepo = 專案根目錄（`docs/` 是子目錄）；Multi-Repo = docs repo 根目錄（`docs/` 不存在，`prds/`、`specs/` 等直接在根）。
> 未設定 → 使用內建。指定但檔案不存在 → 警告後 fallback 到內建。

# Monorepo 範例（路徑相對專案根）：
<!-- - prd → docs/templates/prd-template.md -->
<!-- - spec → docs/templates/spec-template.md -->
<!-- - api-spec → docs/templates/api-spec-template.md -->
<!-- - ui-spec → docs/templates/ui-spec-template.md -->
<!-- - schema → docs/templates/schema-template.md -->

# Multi-Repo 範例（路徑相對 docs repo 根目錄，不含 docs/ 前綴）：
<!-- - prd → templates/prd-template.md -->
<!-- - spec → templates/spec-template.md -->
<!-- - api-spec → templates/api-spec-template.md -->
<!-- - ui-spec → templates/ui-spec-template.md -->
<!-- - schema → templates/schema-template.md -->
```

> 角色分布規則見 [B.3](#b3-設定各-repo-的-claudemd)（單一權威）。Monorepo 使用者可忽略 `vif Workspace` 區塊。

### R2: specs-overview.md 模板

建立 `docs/specs/specs-overview.md`（Monorepo）或 `project-docs/specs/specs-overview.md`（Multi-Repo）：

```markdown
# Specs Overview

## 狀態說明

| 符號 | 狀態 |
|------|------|
| — | not-started |
| 📋 | draft |
| ✅ | approved |
| 🚧 | in-progress |
| ✔️ | done |

## Spec 清單

| # | 名稱 | 領域 | 狀態 | PRD | 依賴 | 備註 |
|---|------|------|------|-----|------|------|

## 依賴圖

（待 spec 建立後更新）
```

### R3: Health Check 與偵測

Init 完成後的 Structural Health Check 詳見 `/vif-flow` Health Check 章節。判定標準：

- **BLOCK = 0** → init 完成
- **WARN / INFO** → 列出供參考，不阻擋流程

**Multi-Repo 特有 BLOCK 項目：** 各 repo 路徑可達 / 是 git repo / CLAUDE.md 有 `vif Workspace` 區塊且角色不衝突。

### R4: 已知設計限制

vif 目前的設計假設，列出供使用者有預期：

- **spec 類文件集中在 docs repo**：PRD、spec、api-spec、ui-spec、schema 一律在 docs repo 產生與讀取。Templates 覆蓋設定也只放在 docs repo。
- **Code repo 無本地 Templates override**：frontend / backend / 其他 code repo 的 CLAUDE.md 不支援 Templates 區塊。即使填了也會被忽略（Health Check 會 WARN）。
- **所有 skill 的 Multi-Repo 模板解析一律導向 docs repo**：不會讀 code repo 的 CLAUDE.md。

若未來有「code repo 自帶文件 / 自動生成 API 參考」等需求，屬於本設計範圍外——需擴展 skill 的模板解析規則。目前不在 roadmap。
