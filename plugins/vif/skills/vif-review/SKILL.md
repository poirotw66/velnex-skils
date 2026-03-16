---
name: vif-review
description: >-
  Phase 4 - Two-stage code review (spec compliance + code quality). Trigger on:
  "code review", "程式碼審查", "review code", "PR review", "審查程式碼",
  "code quality", "review feedback".
metadata:
  version: 2.1.2
---

# Phase 4 — Code Review 兩階段程式碼審查

確保程式碼符合 spec 且品質達標。先驗合規再看品質，兩階段分離。

## The Review Principle

> **不要信任報告。親自驗證。**
> 不要信任 implementer 或 verifier 的自我報告。
> 聲明 X 已通過 → 你去確認 X 真的通過了。
> 聲明行為符合 .feature → 你去讀程式碼確認行為真的符合。

## Prerequisites

- [ ] Phase 3 Verification Report 為 PASS（或 WARN 已接受）
- [ ] 所有測試通過

## Two-Stage Review

派遣 `reviewer` agent：

### Stage 1: Spec + Design Compliance（先做）

**Stage 1 未通過，不進入 Stage 2。**

- [ ] 所有 .feature scenario 都有對應實作
- [ ] 實作行為與 .feature 描述一致
- [ ] spec.md 的技術設計被正確遵循
- [ ] API 實作與 `docs/api-specs/` 一致（如有）
- [ ] UI 實作與 `docs/ui-specs/` 一致（如有）
- [ ] DB 實作與 `docs/schema/` 一致（如有）
- [ ] 影響檔案與 spec.md 列表一致
- [ ] 沒有超出 spec 範圍的變更（scope creep）

### Stage 2: Code Quality

聚焦需要人類判斷力的項目（自動化無法完全覆蓋的）：

1. **架構合理性** — 模組劃分、職責分離、依賴方向
2. **可讀性** — 命名、結構、意圖清晰度
3. **測試品質** — 測試是否測對的東西、邊界案例
4. **可維護性** — 程式碼是否容易理解和修改

**不重複 Phase 3 自動化已做的檢查**（lint、type check 等）。

## Severity Levels

| 等級 | 說明 | 處理 |
|------|------|------|
| 🔴 Critical | 影響正確性或安全性 | 必須修復，回到 Phase 2 |
| 🟡 Major | 影響可維護性或效能 | 應該修復 |
| 🟢 Minor | 風格或偏好 | 可選修復，不阻塞 approve |

## Giving Feedback

- 具體指出位置（`file:line`）和原因
- 提供修復建議，不只指出問題
- 區分「規範要求」和「個人偏好」

## Receiving Feedback

當 implementer 收到 review feedback 時：

- **不要表演性同意**（"You're absolutely right!", "Great point!"）
- 對每個建議進行 **YAGNI 檢查** — 這個改動真的需要嗎？
- 可以用技術理由 pushback — 提供具體的反對理由
- 處理順序：🔴 Critical → 🟡 Major → 🟢 Minor
- 修復後重新執行 Phase 3 驗證

## Fix → Re-verify Loop

```
Review 發現問題
  → 回 Phase 2 修復
  → 重跑 Phase 3 Verify（完整 pipeline）
  → 重跑 Phase 4 Review
  → 最多 3 次循環，超過 escalate
```

## Exit Criteria

- [ ] Stage 1 Spec + Design Compliance 通過
- [ ] Stage 2 Code Quality 審查完成
- [ ] 🔴 Critical 全部修復
- [ ] 🟡 Major 全部修復（或有正當理由不修）
- [ ] 呈現給 Human 做最終審查
- [ ] Human approve → 進入 Phase 5（`/vif-close`）
