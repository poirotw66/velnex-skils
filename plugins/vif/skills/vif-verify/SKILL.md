---
name: vif-verify
description: >-
  Phase 3 - Automated verification pipeline. Trigger on: "verify", "驗證",
  "verification", "pipeline", "驗證流水線", "跑驗證", "品質檢查",
  "build check", "pre-review check".
metadata:
  version: 3.0.0
---

# Phase 3 — Verify 自動化驗證

全面驗證程式碼品質，產出 Verification Report。

## The Verification Principle

> **沒有新鮮的驗證證據，就不能做出任何完成聲明。**
> 在驗證之前做出聲明是不誠實的，不是效率。

每一項檢查都必須通過五步閘門：

1. **辨識** — 什麼命令能證明這個聲明？
2. **執行** — 完整地跑命令（新鮮的，不是上次的結果）
3. **閱讀** — 檢查完整輸出和退出代碼
4. **驗證** — 輸出是否確認聲明？
5. **只有之後** — 才能在報告中做出聲明

## Workspace

> Multi-repo 下，所有 `docs/` 路徑透過 workspace 設定解析。見 `/vif-flow` Workspace Mode。

| 操作 | 位置 |
|------|------|
| 執行 build、test、lint、type check | code repo |
| git diff | code repo |
| 檢查 progress.md TDD 紀錄 | docs repo |
| Security Review | code repo |

> 多個 code repo 時，每個 code repo 各跑一次完整 pipeline。
> 從 docs repo 執行 verify 時，需 cd 到 code repo 執行 commands。

## Pipeline 結構

### Core Stages（必跑）

派遣 `verifier` agent 執行 Stage 1-6：

```
Stage 1     Stage 2       Stage 3     Stage 4       Stage 5         Stage 6
Build    →  Type Check  →  Lint     →  Test Suite →  Diff Review →  Dependency Audit
```

Stage 6 (Dependency Audit) 由 verifier 執行 `npm audit` / `cargo audit` 等命令，檢查已知漏洞。

**Stage 7: Security Code Review**（必跑）

派遣 `security-reviewer` agent（Read only），對程式碼進行 OWASP Top 10 靜態檢查：

1. **Injection** — SQL、Command、XSS、Path Traversal
2. **Broken Authentication** — Session 管理、密碼處理
3. **Sensitive Data Exposure** — 加密、Log 洩漏
4. **Broken Access Control** — 授權檢查
5. **Security Misconfiguration** — 硬編碼 secrets、debug 模式

> security-reviewer 是 Read only，只做靜態程式碼審查。需要執行命令的檢查（npm audit 等）由 verifier 處理。

**AI Cross-Review（可選）：**

讀取 CLAUDE.md `AI Cross-Review` 設定，`verify` 已啟用時，與 security-reviewer 同時平行觸發。傳入本次變更的 source code 檔案。

執行：security-reviewer 與設定的 AI CLI 平行進行獨立安全審查 → 兩方完成後比對結果 → 新發現加入 Verification Report。

**所有 stage 都執行，即使早期 stage 失敗也繼續。** 收集完整問題清單。

### Optional Stage（可選）

**Stage 8: Code Quality**

> **Claude Code 環境**：使用內建的 `/simplify` skill，啟動三個並行審查。
> **非 Claude Code 環境**：跳過此 stage，改由人工 code review 處理。

檢查內容：
- **Code Reuse** — 重複實作、可用既有 utility 替代的手寫邏輯
- **Code Quality** — 多餘狀態、參數膨脹、複製貼上微變、抽象洩漏
- **Efficiency** — 多餘計算、缺少並行、熱路徑膨脹、N+1、記憶體洩漏

> Code Quality 只**報告**問題，不修復。Human 決定要修的項目後自行處理。

> 設計文件一致性（Design Doc Consistency）和驗收條件核對由 `/vif-review` Stage 1 處理，不在 verify 範圍。

### Optional Stage 的啟用方式

1. **CLAUDE.md 預設**（取消註解即啟用，預設不啟用）：
```markdown
### vif-verify 設定
# - Code Quality: true
```

2. **執行時互動**（CLAUDE.md 未預設時詢問）：
```
> Core stages 執行完畢。要執行 Code Quality 檢核嗎？
>   A. Yes（Reuse + Quality + Efficiency）
>   B. 不用
```

## Tool Restrictions

- **Verifier agent**: 僅 Bash + Read（不能 Edit/Write）
- **Security-reviewer agent**: 僅 Read + Grep + Glob（不能 Edit/Write/Bash）
- **Code Quality（`/simplify`）**: Claude Code 內建 skill（非 Claude Code 環境不適用）

驗證過程**只檢測不修復**。發現問題就記錄，不要修改程式碼。

## Report

儲存位置：`docs/specs/NNN-name/verification-report.md`（與 spec.md 同層）。重跑時覆蓋。

### Format

漸進式儲存：每個 stage 完成後立即更新 report，確保任何時間點打開都是完整可讀的當前狀態。重跑時先清空舊 report 再開始漸進式寫入。

```
# Verification Report

## Summary
Overall: PASS / FAIL
Date: YYYY-MM-DD

## Core Stage Results
| Stage | Status | Details |
|-------|--------|---------|
| Build | ✅/❌ | [output summary] |
| Type Check | ✅/❌ | [output summary] |
| Lint | ✅/❌ | [N warnings, M errors] |
| Test Suite | ✅/❌ | [N pass, M fail, coverage: X%] |
| Diff Review | ✅/❌ | [N files changed] |
| Dependency Audit | ✅/❌ | [N vulnerabilities] |
| Security Code Review | ✅/❌ | [N findings] |

## Optional Stage Results
| Stage | Status | Details |
|-------|--------|---------|
| Code Quality | ✅/⏭ | [N issues found] |

## Findings

| # | 燈號 | Stage | Category | File | Description |
|---|------|-------|----------|------|-------------|
| 1 | 🔴 | Test Suite | assertion | src/auth.ts:42 | login 回傳錯誤狀態碼 |
| 2 | 🟠 | Security | injection | src/api.ts:15 | SQL 未參數化 |
| 3 | 🟡 | Lint | dead_code | src/commands.rs | 20 unused function warnings |
| 4 | 🟢 | Code Quality | reuse | src/handlers/ | 重複 error handling 邏輯 |

## 🟡🟢 Findings Review

🔴 Critical: N 項（已修復） | 🟠 High: N 項（已修復）

| # | 燈號 | 描述 | 影響評估 | 建議做法 | 預估量 | Human 決定 |
|---|------|------|---------|---------|-------|-----------|
| 3 | 🟡 | unused function warnings | 低，預留空殼 | 實作時自然消除，可暫不處理 | — | |
| 4 | 🟢 | 重複 error handling | 低，不影響功能 | 抽出共用 handleError() | 小 | |

## Verdict
PASS / FAIL
```

## Severity 分級

所有 stage 產出的 findings 統一分級：

| 燈號 | 等級 | 說明 | 處理 |
|------|------|------|------|
| 🔴 | Critical | 安全漏洞、正確性錯誤、資料遺失風險 | 必須修 |
| 🟠 | High | Spec 不符、重大功能缺失 | 必須修 |
| 🟡 | Medium | 可維護性、效能、命名不一致 | AI 建議 → Human 決定 |
| 🟢 | Low | 風格偏好、可選重構、最佳實踐 | AI 建議 → Human 決定 |

Stage 結果維持 ✅ PASS / ❌ FAIL（二元），findings 另外收集分級。

## Findings 處理流程

```
所有 stage 跑完 → 收集 findings
  ├── 有 🔴🟠 → 回 develop 修復 → 重跑完整 verify
  │   （重跑後無 🔴🟠 再進入下一步）
  └── 僅 🟡🟢 → 🟡🟢 Findings Review → [Human] 選擇修或跳過
                                          ├── 修復 → 重跑完整 verify
                                          └── 跳過 → 記錄決定，繼續
```

> **處理順序**：先修 🔴🟠 → 重跑 → 確認無 🔴🟠 → 再處理 🟡🟢。因為修復 🔴🟠 可能改變 🟡🟢 的判斷。
>
> **為什麼要重跑完整 pipeline？** 修復 A 問題可能引入 B 問題。只跑失敗的 stage 會漏掉連帶影響。

最多 3 次修復循環，超過產出 Escalation Report（格式見 `/vif-flow` Escalation Protocol）。

### 職責分界

verify 發現的問題由 verify 流程處理完畢才能往下走。reviewer 不負責處理 verify 的遺留項目。

| 問題來源 | 誰處理 | 什麼時候 |
|---------|--------|---------|
| 🔴🟠 | 開發者 | 修復後重跑 verify |
| 🟡🟢（需修復） | 開發者 | Human 選定後修復，重跑 verify |
| 🟡🟢（跳過） | verify 記錄決定 | 當下 |
| Spec 合規 / 驗收條件 | reviewer | `/vif-review` Stage 1 |

## 更新 progress.md 與 Commit

驗證完成後（不論 PASS 或 FAIL），更新 `progress.md` 的 Phase 3 區塊：

```markdown
- [x] Phase 3: Verify
  - 結果：PASS
  - 🟡🟢 跳過：dead_code warnings (20) — 預留空殼，實作時自然消除
```

- **PASS** → 勾選 `[x]`，記錄結果與日期
- **FAIL** → 維持 `[ ]`，記錄失敗結果與日期，回 develop 修復後重跑時覆蓋更新

自動 **commit**（`docs: verify spec-NNN PASS/FAIL`），包含 verification-report.md + progress.md。

## Exit Criteria

- [ ] Core stages 全部 ✅ PASS
- [ ] 🔴🟠 findings 全部修復
- [ ] 🟡🟢 findings 已由 Human 決定（修復或跳過）
- [ ] Optional stages 已執行或已確認跳過
- [ ] Verification Report 已儲存
- [ ] progress.md Phase 3 已更新
- [ ] 已 commit
- [ ] 進入 `/vif-review`
