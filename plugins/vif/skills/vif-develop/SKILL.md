---
name: vif-develop
description: >-
  Phase 2 - TDD development loop with subagent dispatch. Trigger on: "develop", "開發",
  "implement", "實作", "coding", "寫程式", "task", "任務", "execute plan",
  "開始開發", "RED GREEN REFACTOR".
metadata:
  version: 3.1.0
---

# Phase 2 — Develop TDD 開發

按 spec.md 任務清單（或自行拆解的任務），逐任務執行 TDD，直到所有任務完成。

## Test Strategy

開發前依據驗收條件決定測試策略，不要盲選。

### Step 1: 掃描驗收條件

讀取 spec.md Section 7 的驗收條件，分類每一條：

| 驗收條件特徵 | 需要的測試層級 |
|-------------|---------------|
| 純計算 / 邏輯判斷 / 資料轉換 | Unit |
| 跨模組互動 / API 呼叫 / DB 操作 | Integration |
| 使用者操作流程（點擊、拖放、頁面切換） | E2E |
| 跨系統整合（IPC、sidecar、外部服務） | Integration 或 E2E |

### Step 2: 產出測試策略

```
> 根據驗收條件分析，建議的測試策略：
>
> Unit Test:
>   - AC-1: [純邏輯] 轉檔格式驗證
>   - AC-3: [資料轉換] 時間戳格式化
>
> Integration Test:
>   - AC-4: [跨層] Rust command 透過 IPC 回傳結果到前端
>
> E2E Test:
>   - AC-2: [使用者流程] 拖入音檔 → 轉錄 → 瀏覽
>   - AC-5: [使用者流程] 儲存 → 關閉 → 重新開啟
>
> 確認這個策略？或要調整？
```

### CLAUDE.md 預設方式

如果專案有固定的測試策略，可在 CLAUDE.md 預設（跳過 Step 1-2）：

```markdown
### 測試策略
- Backend: Unit + Integration
- Frontend: Unit + 關鍵流程 E2E
```

## Outside-In 開發策略

從外層行為測試驅動到內層實作：

```
.feature Scenario（如有）
  └─▶ E2E / Integration Test（驗收層）
        └─▶ Unit Test（邏輯層）
              └─▶ Implementation
```

**測試來源優先順序（當多個來源並存時）：**

1. `.feature` scenario — 最優先，行為層級的規格
2. `spec.md` 驗收條件 — 次之，驗收層級的規格
3. `api-spec` / `ui-spec` — 設計層級的細節

> 有 .feature → 從 scenario 驅動外層測試，再往內推進。
> 無 .feature → 從 spec.md 驗收條件或 api-spec / ui-spec 驅動。

## Workspace

> Multi-repo 下，所有 `docs/` 路徑透過 workspace 設定解析。見 `/vif-flow` Workspace Mode。

| 操作 | 位置 |
|------|------|
| 讀取 spec.md、api-spec、ui-spec、.feature | docs repo |
| 讀/寫 progress.md | docs repo |
| 寫 test、寫 src | code repo（當前 repo） |
| 執行 build、test、lint | code repo（當前 repo） |
| git commit | 各自的 repo |

> 多個 code repo 時，根據 task 的 `spec ref` 判斷目標 repo（api-spec → backend，ui-spec → frontend）。

## Prerequisites

- [ ] spec.md 已 approved（或已有明確的開發任務）
- [ ] **設計文件 Gate（讀 progress.md）** — 見下方 Entry Gate
- [ ] **掃描 Guideline** — 使用 `/vif-guideline` 掃描可用的 guideline

### Entry Gate: 設計文件檢查

開始開發前，**必須**讀取 `progress.md` 的設計文件區塊並檢查：

```
讀取 progress.md 設計文件區塊
├── 有跳過 checkbox 且已勾選 → ✅ 放行
├── 有設計文件表 →
│   ├── 有「待撰寫」→ ❌ 阻擋，列出缺少的文件，提示先完成
│   ├── 有自審 ⬜ → ❌ 阻擋，列出未自審的文件
│   ├── Pass 3 未勾選 → 派遣 spec-auditor 交叉比對（+ AI Cross-Review 如啟用，平行）：
│   │     scope: cross-check
│   │     targets: 表中所有已完成的設計文件路徑
│   │     兩方通過 → 勾選 Pass 3 checkbox，commit，繼續
│   │     失敗 → 列出問題，阻擋開發
│   ├── 全部 ✓ + Pass 3 ✓ → ✅ 放行
└── 無設計文件區塊 → ❌ 阻擋，回 vif-spec 補建 progress.md
```

> **不可跳過此 gate。** 設計文件是開發的施工藍圖，沒有藍圖不能開工。

**AI Cross-Review（可選，solo mode only）：**

讀取 CLAUDE.md `AI Cross-Review` 設定，`design` 已啟用且 mode 為 solo 時，與 spec-auditor Pass 3 同時平行觸發。傳入 progress.md 設計文件表中所有已完成的設計文件。

執行：spec-auditor Pass 3 與設定的 AI CLI 平行進行獨立審查 → 兩方完成後比對結果 → 有新發現則修正後重跑。

> team mode 的設計文件 Cross-Review 在各 skill 內個別觸發（見 `/vif-spec`、`/vif-api-spec`、`/vif-ui-spec`）。

### 載入相關設計文件

Entry Gate 通過後，分兩層載入設計文件：

**第一層（確定）**：讀取 progress.md 設計文件表中明確列出的檔案路徑，直接 Read 載入。這些是本 spec 確定需要的設計文件，不經過篩選。

**第二層（探索）**：frontmatter scan 補充跨 spec / 跨域的關聯文件：
```
1. Glob docs/api-specs/**/*.md + docs/ui-specs/**/*.md + docs/schema/**/*.md
2. 讀取每個檔案的 frontmatter（--- 區塊內的 YAML metadata）
3. 排除第一層已載入的檔案，綜合判斷剩餘檔案與當前 spec 的相關性
4. Read 僅載入相關文件全文
```

> 第一層保證本 spec 的設計文件一定被載入（即使 frontmatter 不完整）。第二層發現跨域關聯。

## Guideline 注入

每個 task dispatch agent 前，使用 `/vif-guideline` 取得與 task 相關的 guideline：

- task 的 `spec ref` 為 `api-spec` → context = `api-spec`
- task 的 `spec ref` 為 `ui-spec` → context = `ui-spec`
- task 的 `spec ref` 為 `schema` → context = `schema`
- test-writer → 額外加入 context = `testing`

將取得的 guideline 內容注入 agent dispatch prompt。

> 解析規則、匹配邏輯、CLAUDE.md 映射 → 見 `/vif-guideline`。

## Core Loop

> **CRITICAL: 沒有失敗的測試，就不能寫 production code。**
> 不可以跳過 RED 直接派遣 implementer。
> 不可以先寫 code 再補 test。
> 違反此規則 = 不是 TDD，產出的程式碼品質無法保證。

```
For each task:
┌──────────────────────────────────────────────────┐
│  1. RED       — test-writer 寫失敗測試           │
│  ── GATE: 測試存在且失敗，才能進入 GREEN ──      │
│  2. GREEN     — implementer 寫最小實作           │
│  3. REFACTOR  — implementer 清理（保持綠燈）     │
│  4. Verify    — 輕量驗證（build + typecheck）     │
│  5. Update    — 更新 progress.md                 │
│  6. Commit    — per-task 自動 commit              │
│                                                  │
│  → Next task (respect dependency order)          │
└──────────────────────────────────────────────────┘
```

### Task Execution Order

1. 讀取 spec.md 任務清單和依賴圖（如有）
2. 依序逐一執行（依賴圖決定順序，無依賴的任務可任意排序）
3. 每完成一個任務，更新 progress.md（含 TDD 紀錄）→ 自動 commit

### RED Stage

派遣 `test-writer` agent：

1. 讀取任務的 `spec ref` 對應的設計文件（api-spec / ui-spec）和 `feature ref`（如有）
2. 將規格轉化為測試程式碼（依測試策略決定層級）
3. 執行**目標測試檔案**，確認失敗（RED）。不要跑全部測試，不要用 `run_in_background`
4. 驗證 RED 有效性：
   - ✅ 因功能不存在而失敗 → 正確的 RED
   - ❌ 因語法錯誤而失敗 → 修正後重試
   - ❌ 因 import 失敗而失敗 → 建立最小 stub 後重試
   - ❌ 測試直接通過 → 測試有 bug，重寫

### RED → GREEN Gate

test-writer 完成後，**在派遣 implementer 之前**，自行驗證：

1. **測試檔案存在嗎？** — 用 Glob 或 Read 確認 test-writer 產出的測試檔案存在
2. **測試確實失敗嗎？** — 用 Bash 執行測試，確認 exit code ≠ 0

```
兩者都確認 → 派遣 implementer
任一不符   → 不往下走，回到 RED Stage 修正
```

> 這個 gate 由 vif-develop 自己執行，不是交給 AI 自律。每個 task 都必須過這個 gate。

### GREEN Stage

派遣 `implementer` agent：

1. 讀取失敗的測試
2. 寫**最小程式碼**讓測試通過
3. 執行**目標測試檔案**，確認通過（GREEN）。不要跑全部測試，不要用 `run_in_background`
4. 跑相關測試確認沒有破壞既有功能（`npm test -- --related` 或等效指令）
5. 報告 Status Code

**Implementer Status Codes：**

| 狀態 | 說明 | 後續動作 |
|------|------|---------|
| `DONE` | 任務完成，測試通過 | 進入 REFACTOR |
| `DONE_WITH_CONCERNS` | 完成但有疑慮 | 記錄疑慮，進入 REFACTOR |
| `NEEDS_CONTEXT` | 需要更多上下文 | 見下方反饋迴路 |
| `BLOCKED` | 無法繼續 | Escalate |
| `BLOCKED_BY_ENV` | 環境問題（缺少 dependency / 工具未安裝） | 立即 escalate，不重試 |
| `BLOCKED_BY_SPEC` | 規格問題（spec 自相矛盾 / 不可能的需求） | 立即 escalate，不重試 |

### Implementer → Test-Writer 反饋迴路

當 implementer 回傳 `NEEDS_CONTEXT` 時，依據其 **category** 路由：

```
implementer NEEDS_CONTEXT
  ├── TEST_ISSUE     → 重新派遣 test-writer，附上 implementer 的回饋，修改測試
  │                    → 重跑 RED → GREEN Gate
  │                    → 重新派遣 implementer
  ├── SPEC_UNCLEAR   → 立即 escalate 給 Human（spec 問題不是 AI 能解決的）
  └── MISSING_CONTEXT → 補充 context 後重試 implementer
```

> 反饋迴路最多 1 次。第 2 次 NEEDS_CONTEXT → escalate 給 Human。

### REFACTOR Stage

測試通過後：

- 移除重複
- 改善命名
- 抽取 helper（僅在有明確重複時）
- **保持測試通過**，不新增行為

### Update progress.md

每個任務完成後，記錄 TDD 執行痕跡：

```markdown
- [x] Task 1: 用戶拖入音檔觸發轉錄
  - RED: `test/transcribe.test.ts` — 測試 onDrop 觸發 invoke('transcribe')，失敗：函式不存在 ✓
  - GREEN: `src/lib/FileDropZone.svelte` — 加入 invoke 呼叫，測試通過 ✓
  - REFACTOR: 抽取 handleFileDrop helper ✓
  - Test: Unit ✓ | Integration ✓
```

> 沒有 RED/GREEN/REFACTOR 紀錄 = 沒有走 TDD。reviewer 會檢查。

### Lightweight Verification

每個任務完成後：

```bash
# 依專案建構工具調整
npm run build          # or bun build
npx tsc --noEmit       # TypeScript type check
npm test -- --related  # 執行相關測試
```

### Commit

每個 task 完成後**自動 commit**（test + implementation + progress.md）。Multi-repo 下各 repo 分別 commit：

```
feat: implement login API endpoint (spec-001)
feat: implement login failure lockout (spec-001)
```

### De-Sloppify Pass

所有任務完成後，執行清理：

- 移除 `console.log` / `print` debug 語句
- 移除註解掉的程式碼
- 確保 import 排序整潔
- 檢查不必要的 `any` 類型
- 確認無 TODO hack 遺留

### Review Fix Commit

Review 修復回到 Phase 2 時，修復後 commit 使用：

```
fix: address review feedback (spec-001)
```

## Failure Handling

### Systematic Debugging

當測試無法通過時：

1. **Root Cause Investigation** — 追溯呼叫鏈找到原始觸發點，不要猜
2. **Pattern Analysis** — 這是個別問題還是系統性問題？
3. **Hypothesis Testing** — 形成假設 → 驗證 → 修復

**鐵律：先找根因，再修復。3 次以上修復失敗 → 質疑架構設計。**

### Escalation

依照統一的 Escalation Protocol（見 `/vif-flow`）：

**方案性失敗（`BLOCKED`）：**
- 第 1-2 次：AI 嘗試替代方案
- 第 3 次：產出 Escalation Report，交由 Human

**系統性失敗（`BLOCKED_BY_ENV` / `BLOCKED_BY_SPEC`）：**
- 立即 escalate，不重試（重試也不會解決）
- 例如：缺少 dependency、spec 自相矛盾、測試框架未安裝

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

## God Mode Override

被 `/vif-god` 驅動時，以下行為變更：

| 步驟 | 正常流程 | God Mode |
|------|---------|----------|
| Test Strategy 確認 | 產出策略後問 Human 確認 | CLAUDE.md 預設 > AI 自動分類，不問 Human |
| TDD Exceptions | 需 Human 確認 | AI 自行判斷 |
| BLOCKED（第 3 次） | escalate 給 Human | 中止 God Mode |
| BLOCKED_BY_ENV / BLOCKED_BY_SPEC | escalate 給 Human | 立即中止 God Mode |
| NEEDS_CONTEXT（第 2 次） | escalate 給 Human | 中止 God Mode |

## Exit Criteria

- [ ] 所有任務完成
- [ ] 所有測試通過
- [ ] De-Sloppify 清理完成
- [ ] progress.md 已更新
- [ ] 已 commit
- [ ] 進入 `/vif-verify`
