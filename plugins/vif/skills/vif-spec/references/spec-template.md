# Spec-NNN: [功能名稱]

## Meta
- 類型：Feature / Workflow / Infra / Refactor
- 狀態：draft / approved / in-progress / done
- PRD：prds/prd-NNN（如有）
- 行為規格：features/[domain]/[name].feature（如有）
- UI 來源：[Figma link / Prototype 路徑 / URL]（如有，下游 skill 必須遵循）
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

> **動作定義（三張表共用）：**
> - **新增**：全新項目，撰寫完整設計文件
> - **修改**：既有項目需調整，更新既有設計文件
> - **取代**：既有項目不適用需重設計（拆分/合併/重寫），撰寫新設計文件 + 標記舊文件 deprecated
> - **參考**：既有項目不需改動，開發時直接引用，不納入設計文件追蹤
>
> **progress.md 追蹤範圍**：僅「新增」「修改」「取代」項目納入 progress.md 設計文件表。
> 「參考」項目不需要撰寫，不進入追蹤。

### 頁面清單

| 動作 | 頁面 | 說明 | 設計來源 | UISpec |
|------|------|------|---------|--------|
| 新增 | | | Figma# | docs/ui-specs/.../[name].md（待撰寫） |
| 修改 | | | | docs/ui-specs/.../[name].md（既有） |
| 取代 | | | [原因 + 原頁面 ref] | docs/ui-specs/.../[name].md（待撰寫） |
| 參考 | | | | docs/ui-specs/.../[name].md（既有，不需撰寫） |

### API 清單

| 動作 | API | Method | Path | 說明 | ApiSpec |
|------|-----|--------|------|------|---------|
| 新增 | | | | | docs/api-specs/.../[name].md（待撰寫） |
| 修改 | | | | | docs/api-specs/.../[name].md（既有） |
| 取代 | | | | [原因 + 原 API ref] | docs/api-specs/.../[name].md（待撰寫） |
| 參考 | | | | | docs/api-specs/.../[name].md（既有，不需撰寫） |

> Request/Response 定義於 /vif-api-spec，此處僅列清單與路由。

### DB 清單

| 動作 | Table | 說明 | Schema |
|------|-------|------|--------|
| 新增 | | | docs/schema/[domain].md（待撰寫） |
| 修改 | | [變更說明] | docs/schema/[domain].md（既有） |
| 取代 | | [原因 + 原 Table ref] | docs/schema/[domain].md（待撰寫） |
| 參考 | | | docs/schema/[domain].md（既有，不需撰寫） |

> UISpec / ApiSpec / Schema 欄位：已產出 → 填入路徑；待撰寫 → 標記「待撰寫」

## 5. 業務規則

- [規則 1]
- [規則 2]

## 6. 實作任務（可選）

> 模式一（AI 驅動）：拆解為小粒度的任務
> 模式二（團隊分工）：可省略，由各 PG 自行拆解

### 依賴圖

task-1 → task-3 (depends: 1,2)
task-2 → task-3 (depends: 1,2) → task-4 (depends: 3)

### 任務清單

1. [ ] [任務描述] — 影響: [檔案]
   - spec ref: docs/api-specs/[module]/[name].md
2. [ ] [任務描述] — 影響: [檔案]
   - spec ref: docs/ui-specs/[module]/[name].md
3. [ ] [任務描述] — 依賴: 1, 2
   - spec ref: docs/api-specs/[module]/[name].md
   - feature ref: features/[domain]/[name].feature#[scenario]
4. [ ] [任務描述] — 依賴: 3
   - spec ref: docs/ui-specs/[module]/[name].md

## 7. 驗收條件

- [ ] [條件 1]
- [ ] [條件 2]

> **有 .feature** → 可引用：見 features/[domain]/[name].feature，驗收條件保持簡要描述即可
> **沒有 .feature** → 每條驗收條件使用 Given/When/Then 格式，確保 AI 與 Human 都能明確理解預期行為

## 8. 約束與限制

- [技術約束]
- [效能期望]

## 9. 成功標準

- 驗收條件全數通過
- [商業成功指標（如有）]
