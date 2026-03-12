# Phase 3: Verify — 驗證

執行六階段自動化驗證。使用 `verifier` agent 的流程。

## 前置檢查

1. 確認 Phase 2 已完成：所有任務 GREEN
2. 讀取 spec.md 確認涉及的檔案範圍

## 執行

依照 `verifier` agent 定義的六階段流水線執行：

1. **Build** — 專案可建構
2. **Type Check** — 型別正確
3. **Lint** — 風格規範通過
4. **Test Suite** — 所有測試通過 + 覆蓋率達標（≥ 80%）
5. **Security** — 無已知漏洞
6. **Diff Review** — 變更合理性

同時執行 `security-reviewer` agent 進行安全審查（僅讀取程式碼，不修改）。

## 失敗處理

- 產出 Verification Report
- 如果有 ❌ FAIL → 讓 implementer 修復對應問題
- 修復後重新執行完整六階段
- 最多 3 次。超過 → escalate 給使用者

## 退出條件

- [ ] 六階段全部 ✅ PASS（⚠️ WARN 可接受）
- [ ] Security Review Report 無 🔴 Critical

## 完成後

呈現 Verification Report + Security Review Report，告知使用者：
「Phase 3 驗證通過，可以執行 `/review` 進行程式碼審查。」
