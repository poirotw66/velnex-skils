---
name: vif-review
description: >-
  Phase 4 - Two-stage code review (spec compliance + code quality). Trigger on:
  "code review", "程式碼審查", "review code", "PR review", "審查程式碼",
  "code quality", "review feedback".
metadata:
  version: 3.4.0
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
| 讀取 spec.md（含 UI 來源）、api-spec、ui-spec、schema、.feature | docs repo |
| 讀取 implementation | code repo |
| 執行 tests | code repo |

> 從 docs repo 或 code repo 執行 review 都可以，AI 會依 workspace 設定解析路徑。

## Prerequisites

- [ ] Phase 3 Verification Report 為 PASS
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

讀取 spec.md Section 7 的驗收條件，逐條對照實作與測試結果：

- [ ] 每一條驗收條件都有對應的實作
- [ ] 每一條驗收條件都有對應的測試覆蓋（或 .feature scenario）
- [ ] 測試確實驗證了驗收條件描述的行為（不只是形式上存在）

> 產出逐條 PASS / FAIL 清單，FAIL 項目需說明原因。

#### 1-2. 設計文件一致性

以 spec.md Section 4 引用的設計文件為準，進行結構性與語意比對：

- [ ] API 實作與 `docs/api-specs/` 一致（欄位、型別、狀態碼、業務邏輯）
- [ ] UI 實作與 `docs/ui-specs/` 一致（元件、狀態、互動行為）
- [ ] UI 實作與 spec.md Meta 的 UI 來源一致（Figma / Prototype / URL，如有）
- [ ] DB 實作與 `docs/schema/` 一致（表結構、欄位、關聯）
- [ ] 實作行為與 `.feature` 描述一致（如有）
- [ ] 無 breaking change（或已在 spec 中標註）

#### 1-3. 範圍確認

- [ ] 影響檔案與 spec.md 列表一致
- [ ] 沒有超出 spec 範圍的變更（scope creep）
- [ ] spec.md 的技術設計被正確遵循
- [ ] progress.md 備註欄標記的偏差項目 — 確認偏差核准的項目已正確實作，且未因偏差引入不一致

### Stage 2: Code Quality

聚焦需要人類判斷力的項目（自動化無法完全覆蓋的）：

1. **架構合理性** — 模組劃分、職責分離、依賴方向
2. **可讀性** — 命名、結構、意圖清晰度
3. **測試品質** — 測試是否測對的東西、邊界案例
4. **可維護性** — 程式碼是否容易理解和修改

**不重複 Phase 3 自動化已做的檢查**（lint、type check 等）。

### AI Cross-Review（可選）

讀取 CLAUDE.md `AI Cross-Review` 設定，`review` 已啟用時，與 Stage 1+2 同時平行觸發。傳入本次變更的 source code + spec.md + 相關設計文件。

執行：reviewer (Stage 1+2) 與設定的 AI CLI 平行進行獨立審查 → 兩方完成後比對結果 → 新發現加入 Review Report。

## Severity 分級

與 verify 統一的四級燈號系統：

| 燈號 | 等級 | 說明 | 處理 |
|------|------|------|------|
| 🔴 | Critical | 影響正確性、安全性、或 spec 明確要求但未實作 | 必須修 |
| 🟠 | High | Spec 描述的行為與實作不一致、重大功能缺失 | 必須修 |
| 🟡 | Medium | 影響可維護性或效能 | AI 建議 → Human 決定 |
| 🟢 | Low | spec 未要求的改善建議（風格、偏好、最佳實踐） | AI 建議 → Human 決定 |

> **判斷原則：spec 有寫的 = 至少 🟠，spec 沒寫的建議 = 🟡 或 🟢。**

## Findings 處理流程

```
Stage 1 完成
  ├── 有 🔴🟠 → 收集 Stage 1 findings → 回 Phase 2 修復 → 重跑 verify → 重跑 review
  └── 全部 ✅ → 進入 Stage 2
        │
Stage 2 完成 → 收集 Stage 1+2 findings
  ├── 有 🔴🟠 → 回 Phase 2 修復 → 重跑 verify → 重跑 review
  └── 僅 🟡🟢 → 🟡🟢 Findings Review → [Human] 選擇修或跳過
                                          ├── 修復 → 進入 Human 最終審查
                                          └── 跳過 → 記錄決定，進入 Human 最終審查
```

## Giving Feedback

- 具體指出位置（`file:line`）和原因
- 提供修復建議，不只指出問題
- 區分「規範要求」和「個人偏好」

## Receiving Feedback

當 implementer 收到 review feedback 時：

- **不要表演性同意**（"You're absolutely right!", "Great point!"）
- 對每個建議進行 **YAGNI 檢查** — 這個改動真的需要嗎？
- 可以用技術理由 pushback — 提供具體的反對理由
- 處理順序：🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low（Human 選定的）
- 🔴🟠 修復後重新執行 Phase 3 → Phase 4（完整 loop）
- 🟡🟢 修復後直接進入 Human 最終審查（風險低、重跑成本高）

## Report

儲存位置：`docs/specs/NNN-name/review-report.md`（與 spec.md 同層）。重跑時覆蓋。

漸進式儲存：每個階段完成後立即更新 report，確保任何時間點打開都是完整可讀的當前狀態。Skill 負責將 reviewer agent 的 per-finding output 組裝為以下 staged report 格式。

### Format

```
# Review Report

## Summary
Result: APPROVED / CHANGES_REQUESTED
Date: YYYY-MM-DD

## Stage 1: Spec + Design Compliance
| 驗收條件 | Status | 說明 |
|---------|--------|------|
| [條件 1] | ✅/❌ | [details] |
| [條件 2] | ✅/❌ | [details] |

### Design Consistency
| 設計文件 | Status | 說明 |
|---------|--------|------|
| API Spec | ✅/❌ | [details] |
| UI Spec | ✅/❌ | [details] |
| DB Schema | ✅/❌ | [details] |

## Stage 2: Code Quality
| 類別 | Status | 說明 |
|------|--------|------|
| 架構合理性 | ✅/❌ | [details] |
| 可讀性 | ✅/❌ | [details] |
| 測試品質 | ✅/❌ | [details] |
| 可維護性 | ✅/❌ | [details] |

## Findings
| # | 燈號 | Category | File | Description |
|---|------|----------|------|-------------|
| 1 | 🔴 | spec compliance | src/auth.ts:42 | 缺少權限檢查 |
| 2 | 🟠 | spec compliance | src/api.ts:15 | response 缺少 spec 定義的欄位 |
| 3 | 🟡 | maintainability | src/handlers/ | 命名不一致 |
| 4 | 🟢 | style | src/utils.ts:8 | 可抽共用 helper |

## 🟡🟢 Findings Review

🔴 Critical: N 項（已修復） | 🟠 High: N 項（已修復）

| # | 燈號 | 描述 | 影響評估 | 建議做法 | 預估量 | Human 決定 |
|---|------|------|---------|---------|-------|-----------|
| 3 | 🟡 | 命名不一致 | 影響可讀性 | 統一為 camelCase | 小 | |
| 4 | 🟢 | 重複邏輯 | 不影響功能 | 抽出 handleError() | 中 | |

## Manual Testing Checklist
- [ ] [測試項目 1]
- [ ] [測試項目 2]

## Verdict
APPROVED / CHANGES_REQUESTED
```

## Fix → Re-verify Loop

```
Review 發現問題
  → 回 Phase 2 修復
  → 重跑 Phase 3 Verify（完整 pipeline）
  → 重跑 Phase 4 Review
  → 最多 3 次循環，超過產出 Escalation Report（見 /vif-flow）
```

## 更新 progress.md 與 Commit

Review 完成後，更新 `progress.md` 的 Phase 4 區塊：

```markdown
- [x] Phase 4: Review
  - 結果：APPROVED
  - 🔴 0 | 🟠 0 | 🟡 2（1 修復, 1 跳過） | 🟢 3（1 修復, 2 跳過）
```

- **APPROVED** → 勾選 `[x]`，記錄結果、日期、各等級 issue 數量
- **CHANGES_REQUESTED** → 維持 `[ ]`，記錄結果與待修項目摘要，回 develop 修復後重跑時覆蓋更新

Human approve 後 **commit**（`docs: review spec-NNN APPROVED`），包含 review-report.md + progress.md。

## God Mode Override

被 `/vif-god` 驅動時，以下行為變更：

| 步驟 | 正常流程 | God Mode |
|------|---------|----------|
| 🟡🟢 findings | Human 選修或跳 | AI 直接修復 → 重跑 verify → 重跑 review |
| Manual Testing | Human 執行 | 列入 Results Report，由使用者最終驗測 |
| Human approve | Human approve 後 commit | 全部 findings 已處理 → 自動 commit |
| 修復循環上限 | max 3 次 | 同（max 3 次，仍有 🔴🟠 → 中止 God Mode） |

> God Mode 的 🟡🟢 全部修復，修復記錄到 Results Report，供使用者最終確認。

## Exit Criteria

- [ ] Stage 1 Spec + Design Compliance 通過
- [ ] Stage 2 Code Quality 審查完成
- [ ] 🔴🟠 findings 全部修復
- [ ] 🟡🟢 findings 已呈現 Human 決定（修復或跳過）（God Mode: AI 直接修復）
- [ ] Review Report 已儲存
- [ ] **人工測試項目已列出**（reviewer 在 APPROVED 時產出 Manual Testing Checklist）
- [ ] 呈現給 Human 做最終審查（God Mode: 列入 Results Report）
- [ ] Human 完成人工測試並確認（God Mode: 由使用者最終驗測）
- [ ] progress.md Phase 4 已更新
- [ ] Human approve 後已 commit（God Mode: 自動 commit）
- [ ] 進入 Phase 5（`/vif-close`）
