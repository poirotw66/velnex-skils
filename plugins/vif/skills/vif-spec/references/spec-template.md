# Spec-NNN: [功能名稱]

## Meta
- 類型：Feature / Workflow / Infra / Refactor
- 狀態：draft / approved / in-progress / done
- PRD：prd-NNN（如有）
- 行為規格：features/[domain]/[name].feature（如有）
- 參考畫面：[Figma link / 截圖路徑]（如有）
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

## 4. 涉及範圍

### 頁面清單

| 動作 | 頁面 | 說明 | 參考 | UISpec |
|------|------|------|------|--------|
| 新增 | | | Figma# | docs/ui-specs/... 或「待撰寫」 |
| 修改 | | | | docs/ui-specs/...（既有） |

### API 清單

| 動作 | API | Method | Path | 說明 | ApiSpec |
|------|-----|--------|------|------|---------|
| 新增 | | | | | docs/api-specs/... 或「待撰寫」 |
| 修改 | | | | | docs/api-specs/...（既有） |

### DB 清單

| 動作 | Table | 說明 | Schema |
|------|-------|------|--------|
| 新增 | | | docs/schema/... 或「待撰寫」 |
| 修改 | | [變更說明] | docs/schema/...（既有） |

> UISpec / ApiSpec / Schema 欄位：已產出 → 填入路徑；待撰寫 → 標記「待撰寫」

## 5. 業務規則

- [規則 1]
- [規則 2]

## 6. 實作任務（可選）

> 模式一（AI 驅動）：拆解為小粒度的任務
> 模式二（團隊分工）：可省略，由各 PG 自行拆解

### 依賴圖

task-1, task-2 [P] → task-3 (depends: 1,2) → task-4 (depends: 3)

### 任務清單

1. [P] [任務描述] — 影響: [檔案]
   - spec ref: docs/api-specs/[module]/[name].md
2. [P] [任務描述] — 影響: [檔案]
   - spec ref: docs/ui-specs/[module]/[name].md
3. [ ] [任務描述] — 依賴: 1, 2
   - spec ref: docs/api-specs/[module]/[name].md
   - feature ref: features/[domain]/[name].feature#[scenario]
4. [ ] [任務描述] — 依賴: 3
   - spec ref: docs/ui-specs/[module]/[name].md

## 7. 驗收條件

- [ ] [條件 1]
- [ ] [條件 2]

> 如有 .feature，可引用：見 features/[domain]/[name].feature

## 8. 約束與限制

- [技術約束]
- [效能期望]

## 9. 成功標準

- 驗收條件全數通過
- [商業成功指標（如有）]
