# Spec-NNN: [功能名稱] — Progress

## 設計文件

| 類型 | 名稱 | 路徑 | 自審 (Pass 1+2) | 狀態 | 備註 |
|------|------|------|:---:|------|------|
| Feature | [name].feature | docs/features/[domain]/[name].feature | — | 完成 | — |
| ApiSpec | [API 名稱] | docs/api-specs/[module]/[domain]/[name].md | ⬜ | 待撰寫 | — |
| Schema | [domain] | docs/schema/[domain].md | ⬜ | 待撰寫 | — |
| UISpec | [頁面名稱] | docs/ui-specs/[module]/[page]/[name].md | ⬜ | 待撰寫 | — |

> 備註欄用途：記錄偏差來源（如「設計階段新增」「取代 PRJ-INT-10」）。正常按計畫執行的項目填「—」。

### 交叉比對 (Pass 3)
- [ ] spec-auditor Pass 3

> **不需要展開設計文件時**，以下列格式取代上方表格：
> ```
> - [x] 不需要展開設計文件 — [原因說明，例如：Bug fix，直接修復既有邏輯]
> ```

## 測試策略

依據驗收條件分析：

| 驗收條件 | 測試層級 | 理由 |
|---------|---------|------|
| AC-1: [描述] | Unit | [純邏輯] |
| AC-2: [描述] | E2E | [使用者操作流程] |

## 進度

- [ ] Phase 1: Spec approved
- [ ] Phase 2: Develop
  - [ ] Task 1: [描述]
    - RED: `[test file]` — [測試描述]，失敗原因：[原因] ✓
    - GREEN: `[impl file]` — [實作描述] ✓
    - REFACTOR: [重構描述] ✓
    - Test: Unit ✓ | Integration ✓ | E2E ✓
  - [ ] Task 2: [描述]
  - [ ] Task 3: [描述]
- [ ] Phase 3: Verify
  - 結果：PASS / FAIL
  - 🟡🟢 跳過：[如有]
- [ ] Phase 4: Review
  - 結果：APPROVED / CHANGES_REQUESTED
  - 🔴 0 | 🟠 0 | 🟡 0 | 🟢 0
- [ ] Phase 5: Close

## 決策紀錄

### YYYY-MM-DD: [決策標題]
- 考慮：[選項與比較]
- 決定：[選擇與理由]
