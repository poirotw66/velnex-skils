---
name: vif-god
description: >-
  God Mode — PRD approved 後全自動執行 Spec→Design→Develop→Verify→Review。
  Trigger on: "god mode", "god", "一鍵開發", "全自動開發", "auto run",
  "自動跑完", "PRD 到 Review", "直接開發到完", "一路做到底".
metadata:
  version: 3.0.0
---

# God Mode — PRD-to-Review 全自動開發

> **基底已在，需求已定，讓 AI 一路做到結果出來。**

PRD approved 後，自動執行 Spec → Design Docs → Develop → Verify → Review，最終產出 Results Report 供使用者檢視。

## Prerequisites

- [ ] **PRD 已 approved**（`docs/prd-NNN.md` 存在且已確認）
- [ ] **既有專案**：codebase 已建立、架構已決定、guideline 已設定

> **一次執行處理一個 spec。** 啟動時從 `specs-overview.md` 取下一個待處理的 spec 編號。多個 spec 時，逐一執行 `/vif-god`。

## Resume Support

呼叫 `/vif-god` 時，先讀取 `progress.md` 判斷是否為恢復執行：

```
讀取 progress.md
├── 不存在或無 Phase 區塊 → 從 Phase 1 開始
├── Phase 1 [x], Phase 2 [ ] → 從 Phase 2 繼續
├── Phase 2 [x], Phase 3 [ ] → 從 Phase 3 繼續
├── Phase 3 [x], Phase 4 [ ] → 從 Phase 4 繼續
├── Phase 4 [x] → 產出 Results Report
└── 已有 god-mode-report.md → 呈現報告給使用者
```

**Phase 內部恢復策略：**

| Phase | 中斷情境 | 恢復方式 |
|-------|---------|---------|
| Phase 1 | spec.md 已寫，部分 design docs 完成 | 讀 progress.md 設計文件表，跳過已完成的，從第一個「待撰寫」繼續 |
| Phase 2 | N 個 task 完成了 M 個 | 讀 progress.md task checkbox，跳過已勾選 `[x]` 的，從第一個 `[ ]` 繼續 |
| Phase 3 | 部分 stage 跑完 | 重跑整個 Phase（驗證應從頭跑，確保結果一致） |
| Phase 4 | 部分 stage 跑完 | 重跑整個 Phase（審查應從頭跑） |

> 恢復時向使用者確認：「偵測到 Phase N 進行中（已完成 M/N 項），繼續？」

## Workspace

依 `/vif-flow` Workspace Mode 設定。Multi-repo 下各操作歸屬不變。

## Flow Overview

```
PRD ✓ → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Results Report → User
         Spec      Develop    Verify     Review
         + Design
```

自動放行規則、findings 處理、Results Report 格式見 `references/god-mode-contract.md`。

---

## Phase 1: Spec + Design Docs

### 1.1 Impact Analysis

1. **讀取輸入**
   - PRD（`docs/prd-NNN.md`）
   - 既有 codebase（掃描 `src/`）
   - 既有設計文件（frontmatter scan：`docs/api-specs/**/*.md`, `docs/ui-specs/**/*.md`, `docs/schema/**/*.md`）
   - Architecture（`docs/architecture/` 如有）
   - `.feature` 檔案（如有，由先前 BDD 產出）

2. **影響分析**
   - 判斷每個變更項目：新增 vs 修改既有
   - 修改既有 → 讀取現有設計文件，標記差異
   - **交叉驗證** — spec 中的假設（預設值、格式、行為）與既有程式碼和文件一致，不憑印象
   - 掃描 guideline（使用 `/vif-guideline`）

> **God Mode 不執行 BDD Discovery。** 如先前已有 `.feature` 檔案（由 `/vif-bdd` 產出），Phase 1 會讀取作為輸入；如無 `.feature` 則跳過。

### 1.2 Write spec.md

讀取 `vif-spec/references/spec-template.md` 作為模板，撰寫：

- Section 1: 背景與目的（從 PRD 摘要）
- Section 2: 設計原則
- Section 3: 不在範圍內
- Section 4: 涉及範圍（影響分析表 — API / UI / DB 新增與修改項目）
- Section 5: 業務規則
- Section 6: 實作任務（含依賴順序）— **God Mode 下為必要**，TDD Loop 依賴此任務清單
- Section 7: 驗收條件
- Section 8: 約束與限制
- Section 9: 成功標準

**方向選擇（自動）：** 不問使用者，AI 依據 PRD + 既有 codebase 慣例選擇最合理方案。在 Results Report 的 Decisions Made 記錄選擇與理由。

### 1.3 Create progress.md

讀取 `vif-spec/references/progress-template.md`，從 spec Section 4 影響分析表產出設計文件追蹤表：

```markdown
| 類型 | 名稱 | 路徑 | 自審 (Pass 1+2) | 狀態 |
| ApiSpec | [name] | docs/api-specs/... | ⬜ | 待撰寫 |
| UISpec | [name] | docs/ui-specs/... | ⬜ | 待撰寫 |
| Schema | [name] | docs/schema/... | ⬜ | 待撰寫 |
```

更新 `specs-overview.md`。

### 1.4 Spec Quality Gate

派遣 `spec-auditor` agent：

```
scope: spec
targets: [spec.md path, .feature paths (if any)]
spec_ref: (self)
workspace: (if multi-repo)
```

- spec-auditor Pass 1+2+3 + AI 自我審視
- 最多 5 輪迭代收斂
- **自動放行條件：** 收斂 + 無 critical/high issue
- 失敗：中止 God Mode，escalate

**自動 commit：** `docs: add spec-NNN [name]`

### 1.5 Write Design Docs

依 progress.md 設計文件表，**全部撰寫**（不問使用者要展開哪些）。

#### API Spec + Schema

針對 progress.md 中每個 ApiSpec / Schema 項目：

1. 讀取 spec Section 4 的 API / DB 列表
2. 讀取 guideline（`/vif-guideline` context = `api-spec`）
3. 讀取 `vif-api-spec/references/api-spec-template.md` 作為模板
4. 撰寫 API Spec（含 Error Mapping Table）
5. 更新 `openapi.yaml`（OpenAPI 3.0.3）
6. 撰寫 DB Schema（如有，讀取 `vif-api-spec/references/schema-template.md` 作為模板）
7. 派遣 spec-auditor：`scope: design-review`, `targets: [api-spec + openapi.yaml + schema files]`
8. 最多 3 輪迭代
9. 更新 progress.md：自審 ⬜ → ✓, 狀態 待撰寫 → 完成

#### UI Spec

針對 progress.md 中每個 UISpec 項目：

1. 讀取 spec Section 4 的 UI 列表
2. 讀取 guideline（`/vif-guideline` context = `ui-spec`）
3. 讀取 `vif-ui-spec/references/ui-spec-template.md` 作為模板
4. 撰寫 UI Spec（含互動行為、API 對應、狀態處理）
5. 派遣 spec-auditor：`scope: design-review`, `targets: [ui-spec files]`
6. 最多 3 輪迭代
7. 更新 progress.md：自審 ⬜ → ✓, 狀態 待撰寫 → 完成

#### Cross-Check (Pass 3)

所有設計文件完成後：

1. 派遣 spec-auditor：`scope: cross-check`, `targets: [all design doc paths]`
2. AI Cross-Review：如 CLAUDE.md 啟用 `design`（solo mode），與 spec-auditor Pass 3 平行觸發
3. 通過 → 勾選 progress.md Pass 3 checkbox
4. 失敗 → 修正後重跑（max 3 輪）

**自動 commit：** `docs: add api-spec/ui-spec/schema [module]/[domain]`

### 1.6 Phase 1 完成

更新 progress.md Phase 1 區塊後 **一併 commit**（確保 `[x]` 狀態與 commit 同步，避免中斷時 resume 判斷錯誤）：

```markdown
- [x] Phase 1: Spec + Design Docs (God Mode)
  - Spec: docs/specs/NNN-name/spec.md
  - Design docs: N 份完成, spec-auditor Pass 3 ✓
```

自動 commit：`docs: complete phase 1 spec-NNN (god-mode)`

---

## Phase 2: Develop

### 2.1 Entry Gate

讀取 progress.md 設計文件表確認放行（同 vif-develop 的 Entry Gate 邏輯）：
- 無「待撰寫」+ 全部自審 ✓ + Pass 3 ✓ → 放行

### 2.2 Test Strategy（自動）

1. 檢查 CLAUDE.md 是否有預設測試策略 → 有則直接使用
2. 無預設 → 依 spec 驗收條件自動分類（Unit / Integration / E2E）
3. 記錄選擇到 Results Report Decisions Made

### 2.3 載入設計文件

同 vif-develop：
- 第一層：progress.md 明確列出的設計文件
- 第二層：frontmatter scan 補充跨域關聯

### 2.4 TDD Loop

> **CRITICAL: 沒有失敗的測試，就不能寫 production code。God Mode 不改變 TDD 硬性約束。**

依 spec 任務清單，逐任務執行：

```
For each task:
┌─────────────────────────────────────────────────┐
│  1. RED    — dispatch test-writer                │
│  ── GATE: 測試存在且失敗 ──                      │
│  2. GREEN  — dispatch implementer                │
│  3. REFACTOR — implementer 清理                  │
│  4. Verify — 輕量 build + typecheck              │
│  5. Update — progress.md TDD 紀錄                │
│  6. Commit — feat: implement [task] (spec-NNN)   │
└─────────────────────────────────────────────────┘
```

#### RED Stage

派遣 `test-writer` agent（dispatch contract 見 `/vif-flow` references/dispatch-contract.md）：

```
task_id: spec-NNN-task-N
description: [task description]
spec_ref: [api-spec / ui-spec path]
feature_ref: [.feature path, if any]
guideline: [/vif-guideline resolved content, context = testing + spec type]
```

#### RED → GREEN Gate

**自行驗證**（不交給 agent）：
1. 測試檔案存在（Glob/Read 確認）
2. 測試確實失敗（Bash 執行，exit code ≠ 0）
3. 失敗原因正確（功能不存在，非語法錯誤）

#### GREEN Stage

派遣 `implementer` agent：

```
task_id: spec-NNN-task-N
description: [task description]
spec_ref: [api-spec / ui-spec path]
test file: [test-writer 產出的測試檔案路徑]
guideline: [/vif-guideline resolved content]
```

Implementer Status Codes：
- `DONE` → REFACTOR
- `DONE_WITH_CONCERNS` → 記錄 concerns 到 Results Report，REFACTOR
- `NEEDS_CONTEXT` → 路由：TEST_ISSUE → 重跑 test-writer, SPEC_UNCLEAR → escalate, MISSING_CONTEXT → 補充重試
- `BLOCKED` → 依 Escalation Protocol（1-2 次替代方案，第 3 次中止 God Mode）
- `BLOCKED_BY_ENV` / `BLOCKED_BY_SPEC` → 立即中止 God Mode

> 反饋迴路最多 1 次。第 2 次 NEEDS_CONTEXT → escalate。

#### REFACTOR + Verify + Commit

- REFACTOR：移除重複、改善命名，保持測試通過
- 輕量驗證：`build + typecheck + related tests`
- 更新 progress.md TDD 紀錄
- 自動 commit：`feat: implement [task] (spec-NNN)`

### 2.5 De-Sloppify

所有任務完成後：
- 移除 `console.log` / `print` debug 語句
- 移除註解掉的程式碼
- 確保 import 排序整潔
- 檢查不必要的 `any` 類型
- 確認無 TODO hack 遺留

### 2.6 Phase 2 完成

更新 progress.md Phase 2 區塊（含所有任務的 TDD 紀錄）。自動 commit。

---

## Phase 3: Verify

### 3.1 Core Pipeline

派遣 `verifier` agent 執行 Stage 1-6：

```
Build → Type Check → Lint → Test Suite → Diff Review → Dependency Audit
```

派遣 `security-reviewer` agent 執行 Stage 7（Security Code Review）：OWASP Top 10 靜態檢查。

**所有 stage 都執行，即使早期 stage 失敗也繼續。**

AI Cross-Review：如 CLAUDE.md 啟用 `verify`，與 security-reviewer 平行觸發。

**Optional Stage 8: Code Quality**

如 CLAUDE.md 啟用 `Code Quality: true` → 執行（使用 `/simplify` skill）。未啟用 → 跳過。God Mode 不互動詢問，依設定決定。

### 3.2 Findings Handling（God Mode）

**處理順序**（同 vif-verify：先 🔴🟠 再 🟡🟢，因為修復 🔴🟠 可能改變 🟡🟢 的判斷）：

```
1. 收集所有 findings（含 Code Quality findings，統一處理）
2. 有 🔴🟠 → 自動修復 → 重跑完整 verify pipeline → 確認無 🔴🟠
3. 有 🟡🟢 → AI 直接修復（做最佳判斷）→ 重跑完整 verify pipeline
4. 記錄所有修復內容到 Results Report，供使用者最終確認
5. max 3 cycles（修復 → 重跑的總循環次數），仍有 🔴🟠 → 中止 God Mode
```

> God Mode 的 🟡🟢 處理比正常流程嚴格（正常流程由 Human 決定修或跳）。因為 God Mode 無 Human 中間把關，所有修復後均需重跑完整驗證確認品質。

### 3.3 Report + Commit

儲存 `verification-report.md`（格式同 vif-verify）。
更新 progress.md Phase 3 區塊。
自動 commit：`docs: verify spec-NNN PASS`

---

## Phase 4: Review

### 4.1 Two-Stage Review

派遣 `reviewer` agent（dispatch contract 見 `/vif-flow` references/dispatch-contract.md）：

```
spec.md path: docs/specs/NNN-name/spec.md
design doc paths: [all api-spec, ui-spec, schema paths]
guideline: [/vif-guideline resolved content]
```

#### Stage 1: Spec + Design Compliance

- 驗收條件逐條核對（PASS/FAIL）
- 設計文件一致性（API / UI / DB）
- 範圍確認（scope creep check）

**Stage 1 未通過，不進入 Stage 2。**

#### Stage 2: Code Quality

- 架構合理性
- 可讀性
- 測試品質
- 可維護性

AI Cross-Review：如 CLAUDE.md 啟用 `review`，與 reviewer Stage 1+2 平行觸發。

### 4.2 Findings Handling（God Mode）

```
Stage 1 完成
├── 有 🔴🟠 → 收集 Stage 1 findings → 回 Phase 2 修復 → 重跑 Phase 3 → 重跑 Phase 4
└── 全部 ✅ → 進入 Stage 2

Stage 2 完成 → 收集 Stage 1+2 findings
1. 有 🔴🟠 → 回 Phase 2 修復 → 重跑 Phase 3 → 重跑 Phase 4
2. 有 🟡🟢 → AI 直接修復 → 重跑 Phase 3 → 重跑 Phase 4
3. 記錄修復內容到 Results Report
4. max 3 cycles，仍有 🔴🟠 → 中止 God Mode
```

> 同 Phase 3，God Mode 無 Human 把關，所有修復後均需重跑完整驗證。

### 4.3 Manual Testing Checklist

Reviewer 在 APPROVED 時產出 Manual Testing Checklist → **不執行**，直接記錄到 Results Report。

### 4.4 Report + Commit

儲存 `review-report.md`（格式同 vif-review）。
更新 progress.md Phase 4 區塊。
自動 commit：`docs: review spec-NNN APPROVED`

---

## Results Report

Phase 4 完成後，彙整產出 `god-mode-report.md`（格式見 `references/god-mode-contract.md`）。

自動 commit：`docs: god-mode spec-NNN COMPLETED`

**呈現給使用者：**

```
> God Mode 完成。Results Report：docs/specs/NNN-name/god-mode-report.md
>
> 請檢視以下項目：
> 1. Decisions Made — AI 在 Phase 1 做的自動決策
> 2. 🟡🟢 Fixed — AI 已修復 N 項（Phase 3: M 項, Phase 4: K 項），請確認修復合理
> 3. Manual Testing Checklist — L 項待執行
>
> 不滿意的地方直接告知調整。調整完畢後執行 /vif-close，
> Close 會自動偵測調整內容並同步更新設計文件（api-spec、ui-spec、schema、spec.md）。
```

---

## Escalation

統一 Escalation Protocol（見 `/vif-flow`）：

- **方案性失敗**：1-2 次 AI 嘗試替代方案，第 3 次中止 God Mode
- **系統性失敗**：立即中止
- **中止時**：自動 commit 已完成的工作 + Results Report（Status: ESCALATED）+ Escalation Report（`docs: god-mode spec-NNN ESCALATED`）。未完成的 partial work 不 commit

## Model Selection

| 階段 | 建議模型 |
|------|---------|
| Phase 1（Spec + Design） | Opus |
| Phase 2（TDD） | test-writer: Sonnet, implementer: Sonnet |
| Phase 3（Verify） | verifier: Sonnet, security-reviewer: Sonnet |
| Phase 4（Review） | reviewer: Opus |
| Results Report | 當前模型 |

## Exit Criteria

- [ ] Phase 1-4 全部完成
- [ ] progress.md Phase 1-4 全部 `[x]`
- [ ] verification-report.md 已儲存
- [ ] review-report.md 已儲存
- [ ] god-mode-report.md 已儲存
- [ ] Results Report 已呈現給使用者
- [ ] 等待使用者檢視、驗測、調整後執行 `/vif-close`

> God Mode 結束時 progress.md 的 Phase 5 維持 `[ ]`。Phase 5 由 `/vif-close` 負責勾選。

## Post God Mode: `/vif-close`

使用者調整完畢後執行 `/vif-close`（標準流程）。Close 會自動同步設計文件反映最終實作，不需要 God Mode 專用邏輯。
