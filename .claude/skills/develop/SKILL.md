---
name: develop
description: >-
  Phase 2 - Per-task TDD development loop with subagent dispatch. Trigger on:
  "develop", "開發", "implement", "實作", "coding", "寫程式", "task",
  "任務", "execute plan", "開始開發", "RED GREEN REFACTOR".
metadata:
  version: 1.0.0
---

# Phase 2 — Develop 逐任務 TDD 開發

按 spec.md 任務清單，逐任務執行 TDD，直到所有任務完成。

## Outside-In 開發策略

從外層行為測試驅動到內層實作：

```
.feature Scenario (驗收測試)
  └─▶ 外層測試 (Controller/API)
        └─▶ 內層測試 (Service/Domain)
              └─▶ 實作程式碼
```

- **BDD** 回答「要建什麼？」— .feature scenario 定義外層行為
- **TDD** 回答「怎麼建？」— RED/GREEN/REFACTOR 實現內層邏輯
- 從 .feature scenario 開始，逐層往內推進，需要內層邏輯時切換到 TDD 循環

## Prerequisites

- [ ] spec.md 已 approved
- [ ] progress.md 已建立
- [ ] 任務清單已確認

## Core Loop

```
For each task in spec.md:
┌──────────────────────────────────────────────────┐
│  1. RED       — test-writer 寫失敗測試           │
│  2. GREEN     — implementer 寫最小實作           │
│  3. REFACTOR  — implementer 清理（保持綠燈）     │
│  4. Verify    — 輕量驗證（build + typecheck）     │
│  5. Update    — 更新 progress.md                 │
│                                                  │
│  → Next task (respect dependency order)          │
└──────────────────────────────────────────────────┘
```

### Task Execution Order

1. 讀取 spec.md 任務清單和依賴圖
2. `[P]` 標記的任務可平行處理（用 Agent tool 並行派遣）
3. 有依賴的任務必須等依賴完成
4. 每完成一個任務，更新 progress.md

### RED Stage

派遣 `test-writer` agent：

1. 讀取任務的 `feature ref:` 找到對應 .feature scenario
2. 將 scenario 轉化為測試程式碼
3. 執行測試，**確認失敗**（RED）
4. 驗證 RED 有效性：
   - ✅ 因功能不存在而失敗 → 正確的 RED
   - ❌ 因語法錯誤而失敗 → 修正後重試
   - ❌ 因 import 失敗而失敗 → 建立最小 stub 後重試
   - ❌ 測試直接通過 → 測試有 bug，重寫

### GREEN Stage

派遣 `implementer` agent：

1. 讀取失敗的測試
2. 寫**最小程式碼**讓測試通過
3. 執行測試，**確認通過**（GREEN）
4. 確認沒有破壞既有測試
5. 報告 Status Code

**Implementer Status Codes：**

| 狀態 | 說明 | 後續動作 |
|------|------|---------|
| `DONE` | 任務完成，測試通過 | 進入 REFACTOR |
| `DONE_WITH_CONCERNS` | 完成但有疑慮 | 記錄疑慮，進入 REFACTOR |
| `NEEDS_CONTEXT` | 需要更多上下文 | 補充上下文後重試 |
| `BLOCKED` | 無法繼續 | Escalate |

### REFACTOR Stage

測試通過後：

- 移除重複
- 改善命名
- 抽取 helper（僅在有明確重複時）
- **保持測試通過**，不新增行為

### Lightweight Verification

每個任務完成後：

```bash
# 依專案建構工具調整
npm run build       # or bun build
npx tsc --noEmit    # TypeScript type check
npm test -- --related  # 執行相關測試
```

### De-Sloppify Pass

所有任務完成後（或每完成一輪），執行清理：

- 移除 `console.log` / `print` debug 語句
- 移除註解掉的程式碼
- 確保 import 排序整潔
- 檢查不必要的 `any` 類型
- 確認無 TODO hack 遺留

## Failure Handling

### Systematic Debugging

當測試無法通過時：

1. **Root Cause Investigation** — 追溯呼叫鏈找到原始觸發點，不要猜
2. **Pattern Analysis** — 這是個別問題還是系統性問題？
3. **Hypothesis Testing** — 形成假設 → 驗證 → 修復

**鐵律：先找根因，再修復。3 次以上修復失敗 → 質疑架構設計。**

### Escalation

- 第 1-2 次失敗：AI 嘗試替代方案
- 第 3 次失敗：產出 Escalation Report，交由 Human 決定：
  - a. 提供提示讓 AI 重試
  - b. Human 手動修復
  - c. 調整 spec / task 拆分
  - d. 標記 blocked，跳過

## TDD Exceptions

以下情境可不走 TDD，但需 Human 確認：

- Throwaway prototypes（探索性原型，用完即丟）
- Generated code（自動產生的程式碼）
- Configuration files（純設定檔）

## When Stuck

| 問題 | 解法 |
|------|------|
| 不知道怎麼測 | 先寫你期望的 API 長什麼樣，從 assertion 開始寫 |
| 測試太複雜 | 設計太複雜，簡化介面 |
| 什麼都要 mock | 耦合太高，用 dependency injection |
| 測試 setup 很大 | 抽 helper。還是複雜？簡化設計 |

## Exit Criteria

- [ ] 所有任務完成
- [ ] 所有測試通過
- [ ] De-Sloppify 清理完成
- [ ] progress.md 已更新
- [ ] 進入 Phase 3（`/verify`）
