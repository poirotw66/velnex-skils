# God Mode Contract

God Mode 的自動放行規則摘要、Results Report 格式、Commit 策略。

## 自動放行規則（摘要）

各 skill 的 **God Mode Override** 段落定義了完整的覆寫規則。以下為快速對照：

| Gate | 正常流程 | God Mode | 定義於 |
|------|---------|----------|--------|
| Spec 方向選擇 | Human 選 | AI 選，記錄理由 | `/vif-spec` |
| Spec approve | Human approve | spec-auditor 通過即放行 | `/vif-spec` |
| Design docs 確認 | Human 確認 | 自我審查通過即 commit | `/vif-api-spec`、`/vif-ui-spec` |
| 測試策略確認 | Human 確認 | CLAUDE.md 預設 > AI 自動 | `/vif-develop` |
| 🟡🟢 findings | Human 選修/跳 | AI 直接修復 | `/vif-verify`、`/vif-review` |
| Review approve | Human approve | 全部 findings 已處理即放行 | `/vif-review` |
| Manual Testing | Human 執行 | 列入 Results Report | `/vif-review` |

### 放行失敗時

自動放行條件不滿足時（例如 spec-auditor 5 輪未收斂、🔴🟠 修不完），**中止 God Mode**，產出 Results Report（Status: ESCALATED），交由使用者決定。

## Results Report 格式

儲存位置：`docs/specs/NNN-name/god-mode-report.md`（與 spec.md 同層）。

```markdown
# God Mode Results Report

## Summary
- PRD: docs/prds/prd-NNN.md
- Spec: docs/specs/NNN-name/spec.md
- Date: YYYY-MM-DD
- Status: COMPLETED / ESCALATED
- Duration: Phase 1-4 total elapsed

## Decisions Made
| Phase | 決策點 | 選擇 | 理由 |
|-------|--------|------|------|
| 1 | Spec 方向 | [選擇] | [why] |
| 2 | 測試策略 | [選擇] | [why] |
| — | [其他自動決策] | [選擇] | [why] |

## Phase 1: Spec + Design Docs

### Documents Produced
| Type | Path | spec-auditor |
|------|------|-------------|
| Spec | docs/specs/... | Pass 1+2+3 ✓ |
| API Spec | docs/api-specs/... | Pass 1+2 ✓ |
| UI Spec | docs/ui-specs/... | Pass 1+2 ✓ |
| Schema | docs/schema/... | Pass 1+2 ✓（含於 API Spec 審查） |

## Phase 2: Develop

### Tasks Summary
| # | Task | TDD | Test Coverage |
|---|------|-----|--------------|
| 1 | [description] | RED→GREEN→REFACTOR ✓ | Unit ✓ · Integration ✓ |

### Concerns (if any)
- [DONE_WITH_CONCERNS items]

## Phase 3: Verify

### Core Stage Results
| Stage | Status |
|-------|--------|
| Build | ✅/❌ |
| Type Check | ✅/❌ |
| Lint | ✅/❌ |
| Test Suite | ✅/❌ |
| Diff Review | ✅/❌ |
| Dependency Audit | ✅/❌ |
| Security Code Review | ✅/❌ |

### 🔴🟠 Fixed
| # | 燈號 | Description | Fix |
|---|------|-------------|-----|

### 🟡🟢 Fixed
| # | 燈號 | Stage | Description | Fix Applied |
|---|------|-------|-------------|-------------|

## Phase 4: Review

### Results
| Stage | Status |
|-------|--------|
| Spec + Design Compliance | PASS/FAIL |
| Code Quality | PASS/FAIL |

### 🔴🟠 Fixed
| # | 燈號 | Description | Fix Applied |
|---|------|-------------|-------------|

### 🟡🟢 Fixed
| # | 燈號 | Category | Description | Fix Applied |
|---|------|----------|-------------|-------------|

## Manual Testing Checklist
- [ ] [測試項目 1]
- [ ] [測試項目 2]

## Action Items

使用者需完成以下項目後執行 `/vif-close`：

- [ ] 審查上方 Decisions Made（確認 AI 的自動決策合理）
- [ ] 審查 🟡🟢 Fixed items（確認 AI 的修復合理，不合理則調整）
- [ ] 執行 Manual Testing Checklist
- [ ] 確認整體結果可接受
```

## Commit 策略

God Mode 由各 skill 各自 commit（與正常流程一致），額外的 God Mode 專屬 commit：

| 時機 | Message | 備註 |
|------|---------|------|
| Phase 1 全部完成 | `docs: complete phase 1 spec-NNN (god-mode)` | progress.md Phase 1 `[x]` |
| Results Report | `docs: god-mode spec-NNN COMPLETED` | God Mode 專屬 |
| 中止（Escalation） | `docs: god-mode spec-NNN ESCALATED` | 含已完成工作 + 報告 |

> 各 Phase 內的 per-task commit 由各 skill 處理（如 `/vif-develop` 的 per-task commit、`/vif-spec` 的 spec commit）。

## 中斷與恢復

God Mode 可能因以下原因中斷：

1. **Escalation**：修復失敗超過上限
2. **使用者中斷**：關閉終端、網路斷線
3. **Context 壓縮**：長時間執行

恢復方式：重新呼叫 `/vif-god`，skill 讀取 `progress.md` 判斷當前狀態，從中斷點繼續。

### Phase 內部恢復

| Phase | 恢復依據 | 策略 |
|-------|---------|------|
| 1 (Spec+Design) | progress.md 設計文件表 | 跳過已完成項，從第一個「待撰寫」繼續 |
| 2 (Develop) | progress.md task checkbox | 跳過已勾選 `[x]`，從第一個 `[ ]` 繼續 |
| 3 (Verify) | — | 重跑整個 Phase（確保結果一致） |
| 4 (Review) | — | 重跑整個 Phase |

### 狀態判斷

```
讀取 progress.md
├── 無 Phase 1 區塊 → 從頭開始（Phase 1）
├── Phase 1 [x] + Phase 2 [ ] → 從 Phase 2 繼續
├── Phase 2 [x] + Phase 3 [ ] → 從 Phase 3 繼續
├── Phase 3 [x] + Phase 4 [ ] → 從 Phase 4 繼續
├── Phase 4 [x] → 產出 Results Report
└── 已有 god-mode-report.md → 呈現給使用者
```
