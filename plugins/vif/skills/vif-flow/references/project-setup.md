# Project Setup Guide

## 使用 AI-Driven Development Flow 設定新專案

### 1. 建立目錄結構

```
your-project/
├── docs/
│   ├── features/          ← Gherkin 行為規格（按業務領域組織）
│   │   └── .gitkeep
│   ├── specs/             ← 技術設計規格
│   │   ├── specs-overview.md
│   │   └── templates/     ← 可選：從 skill references 複製模板
│   └── feature-map.md     ← 功能全貌追蹤
├── .claude/
│   └── CLAUDE.md          ← 專案規範
└── ...
```

### 2. 設定 .claude/CLAUDE.md

在專案的 `.claude/CLAUDE.md` 中加入：

```markdown
# [專案名稱]

## 開發流程

本專案採用 AI-Driven Development Flow。

### Skills

- `/ai-dev-flow` — 流程總覽與 phase routing
- `/prd` — Phase 0: 產品探索
- `/spec` — Phase 1: 規格與設計
- `/develop` — Phase 2: 逐任務 TDD
- `/verify` — Phase 3: 自動化驗證
- `/code-review` — Phase 4: 程式碼審查
- `/close` — Phase 5: 完成

### 技術棧

- 語言：[TypeScript / Dart / Go / ...]
- 框架：[Next.js / Flutter / Gin / ...]
- 測試：[Jest / Vitest / Flutter test / ...]
- 建構：[npm / bun / cargo / ...]

### 專案指令

- Build: `[npm run build / bun build / ...]`
- Test: `[npm test / bun test / ...]`
- Lint: `[npm run lint / ...]`
- Type Check: `[npx tsc --noEmit / ...]`
```

### 3. 初始化追蹤文件

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

## 狀態說明

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

### 4. 開始使用

```
使用者：我想加一個 [功能名稱]
AI：（觸發 /ai-dev-flow）讓我們從 Phase 0 開始...

使用者：/prd
AI：開始 Phase 0 — PRD 產品探索...

使用者：/spec
AI：開始 Phase 1 — Spec 規格與設計...
```

### 5. 可選：複製模板

如果需要專案內的模板參考，可以從 skill references 複製：

```bash
mkdir -p docs/specs/templates
# 手動從 ~/.agents/skills/prd/references/prd-template.md 複製
# 手動從 ~/.agents/skills/spec/references/spec-template.md 複製
# 手動從 ~/.agents/skills/spec/references/progress-template.md 複製
```

或直接讓 AI 使用 skill references 中的模板即可（不需要複製到專案內）。
