# Spec-NNN: [功能名稱]

## Meta
- 類型：Feature / Workflow / Infra / Refactor
- 狀態：draft / approved / in-progress / done
- PRD：prd-NNN（如有）
- 實現的行為規格：
  - features/[domain]/[name].feature
- 依賴：spec-NNN, spec-NNN
- 建立：YYYY-MM-DD
- 更新：YYYY-MM-DD

## 1. 背景與目的

[對應 PRD 哪個問題，要達成什麼目標]

## 2. 設計原則

- [決策 1]：[理由]
- [決策 2]：[理由]

## 3. 不在範圍內

- [明確排除項目]

## 4. 技術設計

### 架構

[模組劃分、依賴關係]

### 資料結構

[Interface / Schema 變更，diff 格式]

### API / 介面

[CLI 指令 / API endpoints / 頁面設計]

## 5. 影響檔案

| 檔案 | 變更程度 | 說明 |
|------|---------|------|
| src/xxx.ts | 小 (< 30 行) | Add interface |
| src/yyy.ts | 大 (> 150 行) | New module |

## 6. 實作任務

### 依賴圖

task-1, task-2 [P] → task-3 (depends: 1,2) → task-4 (depends: 3)

### 任務清單

1. [P] [任務描述] — 影響: [檔案] — ~[N] min
2. [P] [任務描述] — 影響: [檔案] — ~[N] min
3. [ ] [任務描述] — 依賴: 1, 2 — ~[N] min
   - feature ref: features/[domain]/[name].feature#[scenario]
4. [ ] [任務描述] — 依賴: 3 — ~[N] min
   - feature ref: features/[domain]/[name].feature#[scenario]

## 7. 驗收標準

### AC-auto

見 `實現的行為規格` 中列出的 .feature 檔案。

### AC-manual（人工驗證）

- [ ] [步驟 + 預期結果]

## 8. 約束與限制

- [技術約束]
- [效能期望]

## 9. 成功標準

- 驗收標準全數通過
- [商業成功指標（如有）]
