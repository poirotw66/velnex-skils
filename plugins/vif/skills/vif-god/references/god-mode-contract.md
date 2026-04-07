# God Mode Contract

God Mode 的自動放行規則、findings 處理、Results Report 格式。

## 自動放行規則

God Mode 以品質門檻取代人工 approval gate。

| Gate | 正常流程 | God Mode 自動放行條件 |
|------|---------|---------------------|
| Spec approve | Human approve | spec-auditor 收斂（max 5 輪）+ 無 critical/high issue |
| Design docs approve | Human 逐一確認 | 每份設計文件 spec-auditor Pass 1+2 通過（各 max 3 輪）+ 全部完成後 Pass 3 交叉比對通過（max 3 輪） |
| Spec 方向選擇 | Human 選 A/B/C/D | AI 依據 PRD + 既有 codebase 慣例選最合理方案，記錄理由 |
| 測試策略確認 | Human 確認 | CLAUDE.md 預設 > AI 依驗收條件自動分類 |
| 🟡🟢 findings | Human 選修/跳 | AI 直接修復，做最佳處理 |
| Review approve | Human approve | 所有 findings 已處理即放行 |
| Manual Testing | Human 執行 | 列入 Results Report，由使用者最終驗測 |

### 放行失敗時

自動放行條件不滿足時（例如 spec-auditor 5 輪未收斂、🔴🟠 修不完），**中止 God Mode**，產出當前進度的 Results Report + Escalation Report，交由使用者決定。

## Findings 處理規則

```
Findings 收集
1. 有 🔴🟠 → 自動修復 → 重跑完整 verify pipeline → 確認無 🔴🟠
2. 有 🟡🟢 → AI 直接修復（做最佳判斷）→ 重跑完整 verify pipeline
3. 記錄所有修復內容到 Results Report，供使用者最終確認
4. max 3 cycles（修復 → 重跑的總循環次數），仍有 🔴🟠 → 中止，escalate
```

**原則：God Mode 全部處理到最好，使用者只需做最終驗測與調整。**

## Results Report 格式

儲存位置：`docs/specs/NNN-name/god-mode-report.md`（與 spec.md 同層）。

```markdown
# God Mode Results Report

## Summary
- PRD: docs/prd-NNN.md
- Spec: docs/specs/NNN-name/spec.md
- Date: YYYY-MM-DD
- Status: COMPLETED / ESCALATED
- Duration: Phase 1-4 total elapsed

## Phase 1: Spec + Design Docs

## Decisions Made（跨 Phase）
| Phase | 決策點 | 選擇 | 理由 |
|-------|--------|------|------|
| 1 | Spec 方向 | [A/B/C/D] | [why] |
| 2 | 測試策略 | [Unit+Integration / ...] | [why] |
| — | [其他自動決策] | [選擇] | [why] |

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
（如有修復的 🔴🟠 項目）

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
（如有修復的 🔴🟠 項目）

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

God Mode 保持與正常流程一致的 per-phase commit，提供 git log 追溯：

| 時機 | Message | 備註 |
|------|---------|------|
| Spec 完成 | `docs: add spec-NNN [name]` | 自動（無需 Human approve） |
| Design docs 完成 | `docs: add api-spec [module]/[domain]` | 自動 |
| Phase 1 完成 | `docs: complete phase 1 spec-NNN (god-mode)` | progress.md Phase 1 `[x]` |
| Per-task develop | `feat: implement [task] (spec-NNN)` | 同正常流程 |
| Verify 完成 | `docs: verify spec-NNN PASS` | 自動 |
| Review 完成 | `docs: review spec-NNN APPROVED` | 自動（無需 Human approve） |
| Results Report | `docs: god-mode spec-NNN COMPLETED` | God Mode 專屬 |
| 中止（Escalation） | `docs: god-mode spec-NNN ESCALATED` | 含已完成工作 + 報告 |

## 中斷與恢復

God Mode 可能因以下原因中斷：

1. **Escalation**：3 次修復失敗
2. **使用者中斷**：關閉終端、網路斷線
3. **Context 壓縮**：長時間執行

恢復方式：重新呼叫 `/vif-god`，skill 讀取 `progress.md` 判斷當前狀態，從中斷點繼續。

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
