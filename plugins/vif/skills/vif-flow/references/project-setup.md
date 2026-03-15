# Project Setup Guide

## 使用 vif 設定新專案

### 1. 安裝 vif plugin

```bash
/plugin marketplace add [velnex-repo-path-or-url]
/plugin install vif@velnex
```

### 2. 建立目錄結構

```
your-project/
├── .claude/
│   └── CLAUDE.md                  ← 專案規範 + vif 設定
│
├── docs/
│   ├── architecture/              ← ADR 架構決策記錄
│   │   └── .gitkeep
│   ├── features/                  ← BDD .feature（可選）
│   │   └── .gitkeep
│   ├── specs/                     ← 技術規劃（per-feature）
│   │   ├── specs-overview.md
│   │   └── templates/
│   ├── api-specs/                 ← API 設計（累積型，per-module）
│   │   └── .gitkeep
│   ├── ui-specs/                  ← UI 設計（累積型，per-page）
│   │   └── .gitkeep
│   ├── schema/                    ← DB Schema（累積型，per-domain）
│   │   └── .gitkeep
│   └── feature-map.md
│
├── guideline/                     ← 開發規範（專案特定）
│   └── .gitkeep
│
└── src/
    └── ...
```

> `docs/api-specs/`、`docs/ui-specs/`、`docs/schema/` 不是每個專案都需要。
> 依專案性質選用即可。

### 3. 設定 .claude/CLAUDE.md

```markdown
# [專案名稱]

## AI-Driven Development Flow

本專案採用 vif。

### Skills

| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | `/vif-arch` | 架構決策 + ADR |
| 需求 | `/vif-prd` | PRD 撰寫 |
| 行為 | `/vif-bdd` | BDD Discovery（可選） |
| 規劃 | `/vif-spec` | 影響分析 + 技術規劃 |
| 設計 | `/vif-ui-spec` | UI 頁面規格 |
| 設計 | `/vif-api-spec` | API + openapi + dbschema |
| 開發 | `/vif-develop` | TDD 開發 |
| 驗證 | `/vif-verify` | 自動化驗證 |
| 審查 | `/vif-review` | 程式碼審查 |
| 收尾 | `/vif-close` | 完成檢查清單 |

### 技術棧

- 語言：[TypeScript / Python / Go / ...]
- 框架：[Next.js / FastAPI / Gin / ...]
- 測試：[Jest / Vitest / pytest / ...]
- 建構：[npm / bun / cargo / ...]

### 專案指令

- Build: `[npm run build / ...]`
- Test: `[npm test / ...]`
- Lint: `[npm run lint / ...]`
- Type Check: `[npx tsc --noEmit / ...]`

### 測試策略

- Backend: Unit + Integration
- Frontend: Unit + 關鍵流程 E2E

### vif-verify 設定

# - Code Quality: true
# - Design Doc Consistency: true
```

### 4. 初始化追蹤文件

**docs/specs/specs-overview.md:**

```markdown
# Specs Overview

## 狀態說明

| 符號 | 狀態 |
|------|------|
| 📋 | draft |
| ✅ | approved |
| 🚧 | in-progress |
| ✔️ | done |

## Spec 清單

| # | 名稱 | 狀態 | PRD | 依賴 | 備註 |
|---|------|------|-----|------|------|

## 依賴圖

（待 spec 建立後更新）
```

**docs/feature-map.md:**

```markdown
# Feature Map

| 符號 | 意義 |
|------|------|
| ✅ | 已完成 |
| 🚧 | 進行中 |
| 📋 | 已規劃 |
| 🔲 | 未開始 |

## 功能清單

| 領域 | 功能 | 狀態 | Spec | 備註 |
|------|------|------|------|------|
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
