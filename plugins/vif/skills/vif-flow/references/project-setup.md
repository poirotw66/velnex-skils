# Project Setup Guide

> Workspace 模式說明見 `/vif-flow` Workspace Mode section。
> 本文件提供 Monorepo 和 Multi-Repo 的設定範例。

---

## Monorepo（預設）

### 1. 安裝 vif plugin

```bash
/plugin marketplace add [velnex-repo-path-or-url]
/plugin install vif@velnex
/plugin install vex@velnex        # git-commit agent（vif 依賴）
```

### 2. 建立目錄結構

```
your-project/
├── .claude/
│   └── CLAUDE.md                  ← 專案規範 + vif 設定
│
├── docs/
│   ├── prd-NNN.md                 ← PRD 文件（per-feature）        [必要]
│   ├── specs/                     ← 技術規劃（per-feature）        [必要]
│   │   ├── specs-overview.md
│   │   └── NNN-name/
│   │       ├── spec.md
│   │       ├── progress.md
│   │       ├── verification-report.md  ← Phase 3 驗證報告
│   │       ├── review-report.md        ← Phase 4 審查報告
│   │       └── god-mode-report.md      ← God Mode Results Report（如使用）
│   │
│   ├── api-specs/                 ← API 設計（累積型，per-module）  [視需要]
│   ├── ui-specs/                  ← UI 設計（累積型，per-page）     [視需要]
│   ├── schema/                    ← DB Schema（累積型，per-domain） [視需要]
│   ├── architecture/              ← ADR 架構決策記錄                [視需要]
│   └── features/                  ← BDD .feature                   [視需要]
│
├── guideline/                     ← 開發規範（專案特定）            [視需要]
│
└── src/
    └── ...
```

**目錄分類：**

| 分類 | 說明 | 何時建立 |
|------|------|---------|
| **必要** | VIF 流程運作所需 | 專案 init 時建立 |
| **視需要** | 使用對應 skill 時才需要 | 首次使用該 skill 時自動建立 |

> 視需要的目錄不用預先建立。例如 `docs/api-specs/` 在第一次執行 `/vif-api-spec` 時才會建立。

### 3. 設定 .claude/CLAUDE.md

```markdown
# [專案名稱]

## AI-Driven Development Flow

本專案採用 vif。

模式：完全自動化（Solo）
流程：技術先行

> 模式選項：完全自動化（Solo）/ 輔助自動化（Team）
> 流程選項：技術先行 / 產品先行

### flow_mode（可選）

> PRD approved 後的預設行為。未設定時，PRD 後會提示選擇。
>
> - `god` — 自動跑完 Spec→Review，最後看結果做調整
> - `normal` — 逐階段手動推進（預設）

<!-- - flow_mode: god -->

### Skills

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

### 技術棧

> /vif-arch 完成後會自動填入此區塊。也可手動填寫。

- 語言：[TypeScript / Python / Go / ...]
- 框架：[Next.js / FastAPI / Gin / ...]
- 測試：[Jest / Vitest / pytest / ...]
- 建構：[npm / bun / cargo / ...]

### 專案指令

> /vif-arch 完成後會自動填入此區塊。也可手動填寫。

- Build: `[npm run build / ...]`
- Test: `[npm test / ...]`
- Lint: `[npm run lint / ...]`
- Type Check: `[npx tsc --noEmit / ...]`

### 測試策略

> /vif-arch 完成後會自動填入此區塊。也可手動填寫。

- Backend: Unit + Integration
- Frontend: Unit + 關鍵流程 E2E

### Git 規範

- 使用 git-commit subagent 執行 commit
- dispatch 時附上當前模型名稱（供 Co-Authored-By 使用）

### 設計基礎

> /vif-uiux 完成後會自動填入此區塊。也可手動填寫。

詳見 `guideline/ui/ui-guideline.md`

### vif-verify 設定

> 啟用 /vif-verify 的 Code Quality 檢查（Reuse、Quality、Efficiency），使用 Claude Code 內建 /simplify skill。

<!-- - Code Quality: true -->

### AI Cross-Review（可選，取消註解啟用）

> 原本的 agent 審查（spec-auditor / security-reviewer / reviewer）與第二個 AI CLI（如 Codex）同時平行進行獨立審查，完成後比對兩方結果，將新發現整合回報告。
>
> - **solo**：設計文件在開發前統一審查一次（/vif-develop entry gate）
> - **team**：設計文件在各 skill 完成時個別審查（/vif-spec, /vif-api-spec, /vif-ui-spec）
> - **verify / review**：不分 mode，分別在 /vif-verify 和 /vif-review 中與原 agent 平行進行
>
> 完整觸發時機見 vif-flow「AI Cross-Review Trigger Points」。

<!-- - mode: solo -->
<!-- - design: codex -->
<!-- - verify: codex -->
<!-- - review: codex -->

### Guideline 映射（可選，覆蓋目錄慣例，支援檔案或資料夾）

> 指定各 context 對應的 guideline 路徑，讓 /vif-guideline 注入正確的開發規範給 agent。未設定時依目錄慣例自動匹配。

<!-- - api-spec → guideline/backend/ -->
<!-- - ui-spec → guideline/frontend/ -->
<!-- - testing → guideline/testing/ -->

```

### 4. 初始化追蹤文件

**docs/specs/specs-overview.md:**

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

### 5. 架構決策（建議先做）

```
/vif-arch

討論並記錄：
- 技術棧選擇
- 專案架構
- 共用規範
- 測試策略
```

### 6. 開始使用

**模式一（完全自動化）：**
```
> 我想加一個使用者登入功能
AI：讓我們從 /vif-prd 開始...
```

**模式二（輔助自動化）：**
```
> 我是 SA，需要根據 PRD-001 和 Figma 規劃技術 spec
AI：讓我用 /vif-spec 來分析影響範圍...
```

---

## Multi-Repo 模式

### 目錄結構

```
workspace/
├── project-docs/                  ← docs repo
│   ├── .claude/
│   │   └── CLAUDE.md              ← workspace 設定 + vif 設定
│   ├── docs/
│   │   ├── prd-NNN.md             [必要]
│   │   ├── specs/                 [必要]
│   │   ├── api-specs/             [視需要]
│   │   ├── ui-specs/              [視需要]
│   │   ├── schema/                [視需要]
│   │   ├── architecture/          [視需要]
│   │   └── features/              [視需要]
│   └── guideline/                 [視需要]
│
├── project-frontend/              ← frontend code repo
│   ├── .claude/
│   │   └── CLAUDE.md              ← workspace 設定 + 技術棧 + 測試策略
│   ├── src/
│   └── test/
│
└── project-backend/               ← backend code repo
    ├── .claude/
    │   └── CLAUDE.md              ← workspace 設定 + 技術棧 + 測試策略
    ├── src/
    └── test/
```

### 每個 Repo 的 CLAUDE.md 設定

**docs repo（project-docs/.claude/CLAUDE.md）：**

```markdown
# Project Docs

## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | . | docs/, guideline/ |
| frontend | ../project-frontend | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: docs

## AI-Driven Development Flow

本專案採用 vif（multi-repo workspace）。

### Skills
（同 monorepo 的 skill 表格）

### Git 規範

- 使用 git-commit subagent 執行 commit
- dispatch 時附上當前模型名稱（供 Co-Authored-By 使用）
```

**frontend repo（project-frontend/.claude/CLAUDE.md）：**

```markdown
# Project Frontend

## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | ../project-docs | docs/, guideline/ |
| frontend | . | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: frontend

## AI-Driven Development Flow

本專案採用 vif（multi-repo workspace）。

### 技術棧
- 語言：TypeScript
- 框架：Svelte 5
- 測試：Vitest
- 建構：Vite

### 專案指令
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Type Check: `npx svelte-check`

### 測試策略
- Frontend: Unit + 關鍵流程 E2E

### Git 規範

- 使用 git-commit subagent 執行 commit
- dispatch 時附上當前模型名稱（供 Co-Authored-By 使用）
```

**backend repo（project-backend/.claude/CLAUDE.md）：**

```markdown
# Project Backend

## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | ../project-docs | docs/, guideline/ |
| frontend | ../project-frontend | src/, test/ |
| backend | . | src/, test/ |

當前 repo 角色: backend

## AI-Driven Development Flow

本專案採用 vif（multi-repo workspace）。

### 技術棧
- 語言：Python 3.11
- 框架：FastAPI
- 測試：pytest
- 建構：uv

### 專案指令
- Build: `uv build`
- Test: `uv run pytest`
- Lint: `uv run ruff check`
- Type Check: `uv run mypy .`

### 測試策略
- Backend: Unit + Integration

### Git 規範

- 使用 git-commit subagent 執行 commit
- dispatch 時附上當前模型名稱（供 Co-Authored-By 使用）
```

> 初始化追蹤文件（specs-overview）只在 docs repo 建立。
