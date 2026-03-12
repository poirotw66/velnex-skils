# Phase 2: Develop — 開發（逐任務 TDD）

執行 Phase 2 的逐任務 TDD 迴圈。AI 主導開發，Human 不需介入，除非 escalate。

## 前置檢查

1. 確認 Phase 1 已完成：`spec.md` 狀態為 `approved`
2. 讀取 `spec.md` 的實作任務清單
3. 讀取所有相關的 `.feature` 檔案
4. 確認開發環境可用（build 成功、測試框架可執行）

如果前置檢查失敗 → 停止，告知使用者需要先完成 Phase 1。

## 核心迴圈

按照 `spec.md` 任務清單的順序，逐任務執行：

```
for each task:
  1. RED   — 用 test-writer 的方法，從 feature ref 生成測試，確認失敗
  2. GREEN — 用 implementer 的方法，寫最小實作，確認通過
  3. REFACTOR — 清理程式碼，測試保持綠色
  4. 輕量驗證 — lint + type check
  5. 更新 progress.md — 標記任務完成
```

### 每個任務的詳細步驟

#### 1. RED（生成測試）

- 讀取任務的 `feature ref`
- 將 .feature scenario 轉化為測試程式碼
- 測試名稱用行為描述
- 執行測試 → 確認 RED（正確地失敗）
- 如果無 feature ref（純技術任務）→ 根據 spec.md 技術設計判斷是否需要測試

#### 2. GREEN（寫實作）

- 讀取 RED test + spec.md 技術設計
- 寫出讓測試通過的最小程式碼
- 執行測試 → 確認 GREEN
- 確認既有測試沒有被破壞

#### 3. REFACTOR

- 消除重複、改善命名、簡化邏輯
- 測試必須始終保持 GREEN

#### 4. 輕量驗證

- 執行 lint
- 執行 type check
- 通過 → 下一個任務
- 失敗 → 修正（最多 3 次）→ 仍失敗 → escalate

#### 5. 更新進度

在 `progress.md` 中標記當前任務完成。

### 平行任務

標記 `[P]` 的任務可以同時處理，不需要等待彼此完成。但都完成後才能進入依賴它們的下一個任務。

### 失敗處理

```
任務失敗（測試寫不出來、實作無法通過、lint 失敗）
  → 重試（最多 3 次）
  → 仍失敗 → 產出失敗報告：
      - 嘗試了什麼
      - 失敗原因
      - 可能的解法建議
  → escalate 給使用者
  → 使用者選擇：
      a. 提供提示，讓 AI 重試
      b. 調整 spec / task
      c. 標記 blocked，跳過
```

## 退出條件

- [ ] 所有任務 GREEN
- [ ] Lint 通過
- [ ] Type check 通過
- [ ] progress.md 已更新
- [ ] spec.md 狀態更新為 `in-progress`

## 完成後

告知使用者：「Phase 2 開發完成，所有任務 GREEN。執行 `/verify` 進行驗證。」

如果有 blocked 任務，一併列出。
