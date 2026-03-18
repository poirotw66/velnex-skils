---
name: vif-review
description: >-
  Phase 4 - Two-stage code review (spec compliance + code quality). Trigger on:
  "code review", "程式碼審查", "review code", "PR review", "審查程式碼",
  "code quality", "review feedback".
metadata:
  version: 2.5.0
---

# Phase 4 — Code Review 兩階段程式碼審查

確保程式碼符合 spec 且品質達標。先驗合規再看品質，兩階段分離。

## The Review Principle

> **不要信任報告。親自驗證。**
> 不要信任 implementer 或 verifier 的自我報告。
> 聲明 X 已通過 → 你去確認 X 真的通過了。
> 聲明行為符合 .feature → 你去讀程式碼確認行為真的符合。

## Workspace

> Multi-repo 下，所有 `docs/` 路徑透過 workspace 設定解析。見 `/vif-flow` Workspace Mode。

| 操作 | 位置 |
|------|------|
| 讀取 spec.md、api-spec、ui-spec、schema、.feature | docs repo |
| 讀取 implementation | code repo |
| 執行 tests | code repo |

> 從 docs repo 或 code repo 執行 review 都可以，AI 會依 workspace 設定解析路徑。

## Prerequisites

- [ ] Phase 3 Verification Report 為 PASS（或 WARN 已接受）
- [ ] 所有測試通過

## Guideline 注入

派遣 reviewer agent 前，使用 `/vif-guideline` 取得與此次變更相關的 guideline：

- 涉及後端 → context = `api-spec`
- 涉及前端 → context = `ui-spec`
- 涉及 DB → context = `schema`

將取得的 guideline 內容注入 reviewer dispatch prompt。

## Two-Stage Review

派遣 `reviewer` agent（含相關 guideline）：

### Stage 1: Spec + Design Compliance（先做）

**Stage 1 未通過，不進入 Stage 2。**

#### 1-1. 驗收條件核對

讀取 spec.md Section 4 的驗收條件，逐條對照實作與測試結果：

- [ ] 每一條驗收條件都有對應的實作
- [ ] 每一條驗收條件都有對應的測試覆蓋（或 .feature scenario）
- [ ] 測試確實驗證了驗收條件描述的行為（不只是形式上存在）

> 產出逐條 PASS / FAIL 清單，FAIL 項目需說明原因。

#### 1-2. 設計文件一致性

以 spec.md Section 4 引用的設計文件為準，進行結構性與語意比對：

- [ ] API 實作與 `docs/api-specs/` 一致（欄位、型別、狀態碼、業務邏輯）
- [ ] UI 實作與 `docs/ui-specs/` 一致（元件、狀態、互動行為）
- [ ] DB 實作與 `docs/schema/` 一致（表結構、欄位、關聯）
- [ ] 實作行為與 `.feature` 描述一致（如有）
- [ ] 無 breaking change（或已在 spec 中標註）

#### 1-3. 範圍確認

- [ ] 影響檔案與 spec.md 列表一致
- [ ] 沒有超出 spec 範圍的變更（scope creep）
- [ ] spec.md 的技術設計被正確遵循

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
  → 最多 3 次循環，超過產出 Escalation Report（見 /vif-flow）
```

## Exit Criteria

- [ ] Stage 1 Spec + Design Compliance 通過
- [ ] Stage 2 Code Quality 審查完成
- [ ] 🔴 Critical 全部修復
- [ ] 🟡 Major 全部修復（或有正當理由不修）
- [ ] 呈現給 Human 做最終審查
- [ ] Human approve → 進入 Phase 5（`/vif-close`）
