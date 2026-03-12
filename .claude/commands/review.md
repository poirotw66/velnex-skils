# Phase 4: Review — 審查

執行程式碼審查。使用 `reviewer` agent 的 Code 審查模式。

## 前置檢查

1. 確認 Phase 3 已完成：Verification Report 全部 PASS
2. 讀取 spec.md 和相關 .feature 檔案
3. 讀取 Verification Report 和 Security Review Report

## 執行

按照 `reviewer` agent 的 Code 審查清單：

### 1. Spec 合規性
- .feature 每個 scenario 都有對應測試
- 沒有超出 spec 範圍的變更
- AC-manual 項目已列出

### 2. 架構合理性
- 分層正確
- 依賴方向正確
- 職責單一

### 3. 程式碼可讀性
- 命名表達意圖
- 函式長度適當
- 複雜邏輯有註解

### 4. 測試品質
- 測試名稱描述行為
- 邊界案例覆蓋
- 測試獨立不互相依賴

## 產出

產出結構化 Review 回饋，每個項目標記嚴重性（🔴 Critical / 🟡 Major / 🟢 Minor）。

## 回饋處理

如果有 🔴 Critical 或 🟡 Major：
1. 列出需要修復的項目
2. 讓 implementer 修復
3. 修復後重新執行 `/verify` → `/review`

如果只有 🟢 Minor 或無回饋：
- 呈現 Review 結果給使用者
- 請使用者做最終 approve

## 退出條件

- [ ] 無 🔴 Critical
- [ ] 🟡 Major 已修復或使用者確認可接受
- [ ] 使用者已 approve

## 完成後

告知使用者：「Review 通過，可以執行 `/close` 完成此 spec。」
