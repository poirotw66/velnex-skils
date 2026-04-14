---
name: vif-god
description: >-
  God Mode — PRD approved 後全自動執行 Spec→Design→Develop→Verify→Review。
  Trigger on: "god mode", "god", "一鍵開發", "全自動開發", "auto run",
  "自動跑完", "PRD 到 Review", "直接開發到完", "一路做到底".
metadata:
  version: 3.3.2
---

# God Mode — PRD-to-Review 全自動開發

> **基底已在，需求已定，讓 AI 一路做到結果出來。**

PRD approved 後，依序驅動 `/vif-spec` → `/vif-api-spec` + `/vif-ui-spec` → `/vif-develop` → `/vif-verify` → `/vif-review`，最終產出 Results Report 供使用者檢視。

## CRITICAL: God Mode 是編排器

God Mode **驅動既有 skill**，不重新實作各 skill 的邏輯。各 skill 內部的 **God Mode Override** 段落定義了 God Mode 下的行為差異（Human gate → AI 自動放行等）。

- ✅ 依序呼叫 `/vif-spec`、`/vif-api-spec`、`/vif-ui-spec`、`/vif-develop`、`/vif-verify`、`/vif-review`
- ✅ 各 skill 照常執行其完整流程，遇到 God Mode Override 時自動套用
- ❌ 不要跳過 skill、不要自己重寫 skill 的邏輯

## Prerequisites

- [ ] **PRD 已 approved**（`docs/prds/prd-NNN.md` 存在且已確認）
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

**Phase 內部恢復：** 各 skill 自身的 progress.md 追蹤機制處理（例如 `/vif-develop` 的 task checkbox、`/vif-spec` 的設計文件表）。

> 恢復時向使用者確認：「偵測到 Phase N 進行中（已完成 M/N 項），繼續？」

## Workspace

依 `/vif-flow` Workspace Mode 設定。Multi-repo 下各操作歸屬不變。

## Flow

```
PRD ✓ → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Results Report → User
         Spec      Develop    Verify     Review
         + Design
```

---

## Phase 1: Spec + Design Docs

### 1.1 執行 `/vif-spec`

God Mode Override 生效（見 vif-spec）：
- 方向選擇：AI 自行決定，記錄理由到 Decisions Made
- Step 3：自動展開全部設計文件
- Step 4 Stage C：spec-auditor 通過即自動放行
- 任務拆解 Section 6：必要（TDD Loop 依賴）

### 1.2 執行 `/vif-api-spec`

針對 progress.md 中所有 ApiSpec + Schema 項目，逐一執行。
God Mode Override 生效（見 vif-api-spec）：自我審查通過即自動 commit。

**God Mode 偏差處理**：vif-api-spec Step 1 偵測到偏差時：
- 偏差 ≤ 原計畫 50%（計畫外新增 + 取代的數量 ≤ progress.md 原始 ApiSpec 項目數的一半）→ 自動核准，更新 Spec + progress.md，記入 Decisions Made
- 偏差 > 50% → **暫停 God Mode**，呈現偏差清單給使用者確認後再繼續

### 1.3 執行 `/vif-ui-spec`

針對 progress.md 中所有 UISpec 項目，逐一執行。
God Mode Override 生效（見 vif-ui-spec）：自我審查通過即自動 commit。

**God Mode 偏差處理**：vif-ui-spec Step 1 偵測到偏差時：
- 偏差 ≤ 原計畫 50%（計畫外新增 + 取代的數量 ≤ progress.md 原始 **UISpec** 項目數的一半）→ 自動核准，更新 Spec + progress.md，記入 Decisions Made
- 偏差 > 50% → **暫停 God Mode**，呈現偏差清單給使用者確認後再繼續

### 1.4 Cross-Check (Pass 3)

所有設計文件完成後，由 `/vif-develop` Entry Gate 觸發 Pass 3 交叉比對。

### 1.5 Phase 1 完成

更新 progress.md Phase 1 區塊，自動 commit：`docs: complete phase 1 spec-NNN (god-mode)`

---

## Phase 2: Develop

**執行 `/vif-develop`**

God Mode Override 生效（見 vif-develop）：
- 測試策略：不問 Human 確認
- BLOCKED_BY_ENV / BLOCKED_BY_SPEC → 立即中止 God Mode

---

## Phase 3: Verify

**執行 `/vif-verify`**

God Mode Override 生效（見 vif-verify）：
- Optional Stage：依 CLAUDE.md 設定，不互動詢問
- 🟡🟢 findings：AI 直接修復

---

## Phase 4: Review

**執行 `/vif-review`**

God Mode Override 生效（見 vif-review）：
- 🟡🟢 findings：AI 直接修復
- Manual Testing：列入 Results Report
- 全部 findings 已處理即自動放行

---

## Decisions Tracking

God Mode 中 AI 代替 Human 做的每個決策，都記錄到 Results Report 的 Decisions Made 表：

| 來源 Skill | 決策點 | 記錄內容 |
|-----------|--------|---------|
| `/vif-spec` | 方向選擇 | 選了什麼、為什麼 |
| `/vif-spec` | 任務拆解粒度 | 拆法與依據 |
| `/vif-develop` | 測試策略 | 策略與分類理由 |
| `/vif-develop` | TDD Exceptions | 哪些任務跳過 TDD、理由 |
| `/vif-api-spec` | 偏差核准 | 核准了什麼偏差、偏差比例、核准理由 |
| `/vif-ui-spec` | 偏差核准 | 核准了什麼偏差、偏差比例、核准理由 |
| `/vif-verify` | 🟡🟢 修復 | 每項修復的判斷 |
| `/vif-review` | 🟡🟢 修復 | 每項修復的判斷 |

> 記錄目的：使用者在 Results Report 中審查 AI 的決策是否合理。

## Results Report

Phase 4 完成後，彙整產出 `god-mode-report.md`（格式見 `references/god-mode-contract.md`）。

自動 commit：`docs: god-mode spec-NNN COMPLETED`

**呈現給使用者：**

```
> God Mode 完成。Results Report：docs/specs/NNN-name/god-mode-report.md
>
> 請檢視以下項目：
> 1. Decisions Made — AI 在流程中的自動決策
> 2. 🟡🟢 Fixed — AI 已修復 N 項，請確認修復合理
> 3. Manual Testing Checklist — L 項待執行
>
> 不滿意的地方直接告知調整。調整完畢後執行 /vif-close，
> Close 會自動偵測調整內容並同步更新設計文件。
```

## Escalation

統一 Escalation Protocol（見 `/vif-flow`）：

- **方案性失敗**：1-2 次 AI 嘗試替代方案，第 3 次中止 God Mode
- **系統性失敗**（BLOCKED_BY_ENV / BLOCKED_BY_SPEC）：立即中止
- **中止時**：自動 commit 已完成的工作 + Results Report（Status: ESCALATED）

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

使用者調整完畢後執行 `/vif-close`（標準流程）。Close 會自動同步設計文件反映最終實作。
