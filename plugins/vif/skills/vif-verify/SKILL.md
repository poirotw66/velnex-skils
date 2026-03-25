---
name: vif-verify
description: >-
  Automated verification pipeline. Trigger on: "verify", "驗證",
  "verification", "pipeline", "驗證流水線", "跑驗證", "品質檢查",
  "build check", "pre-review check".
metadata:
  version: 2.7.0
---

# Verify — 自動化驗證

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

**所有 stage 都執行，即使早期 stage 失敗也繼續。** 收集完整問題清單。

### Optional Stage（可選）

**Stage 7: Code Quality**

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
- **Security-reviewer agent**: 僅 Read（不能 Edit/Write/Bash）
- **Code Quality（`/simplify`）**: Claude Code 內建 skill（非 Claude Code 環境不適用）

驗證過程**只檢測不修復**。發現問題就記錄，不要修改程式碼。

## Report Format

```
# Verification Report

## Summary
Overall: PASS / WARN / FAIL
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
| Code Quality | ✅/⚠️/⏭ | [N issues found] |

## Issues

| # | Severity | Stage | Category | File | Description | Auto-fixable |
|---|----------|-------|----------|------|-------------|-------------|
| 1 | ❌ FAIL | ... | ... | ... | ... | Yes/No |
| 2 | ⚠️ WARN | ... | ... | ... | ... | Yes/No |

## WARN Evaluation
[每個 WARN 項目的評估結果和理由]

## Verdict
READY / NOT READY for Code Review
```

## Result Classification

每個 stage 的結果分為三種：

| 結果 | 說明 | 能否進入 review？ |
|------|------|-------------------|
| ✅ PASS | 無錯誤 | 可以 |
| ⚠️ WARN | 有 warnings，不影響正確性 | 需評估後決定 |
| ❌ FAIL | 有 errors | 不可以，必須修復 |

### WARN 的處理流程

WARN 不能直接跳過。每個 WARN 項目必須逐一評估：

```
對每個 WARN 項目：
├─ 需要修復 → 回 develop 修復 → 重跑完整 verify
└─ 確認不修 → 記錄理由（為什麼可以接受）
```

**記錄格式**（在 Report 的 Issues 區塊）：

```
### [WARN-accepted] Rust dead_code warnings (20)
理由：commands.rs 為預留空殼，實作時自然消除。不影響功能。

### [WARN-accepted] Security: CSP disabled
理由：Tauri 開發階段需要，production build 會啟用。
```

> WARN 沒有記錄理由 = 沒有評估 = 不能進入 review。

## Failure Handling

### FAIL 修復流程

1. 記錄所有 FAIL stage 和具體錯誤
2. 回到 develop 修復
3. 修復後重新執行**完整** pipeline（不能只跑失敗的 stage）
4. 最多 3 次修復循環，超過產出 Escalation Report（格式見 `/vif-flow` Escalation Protocol）

> **為什麼要重跑完整 pipeline？** 修復 A 問題可能引入 B 問題。只跑失敗的 stage 會漏掉連帶影響。

### 職責分界

verify 發現的問題由 verify 流程處理完畢才能往下走。reviewer 不負責處理 verify 的遺留項目。

| 問題來源 | 誰處理 | 什麼時候 |
|---------|--------|---------|
| FAIL | 開發者 | 修復後重跑 verify |
| WARN（需修復） | 開發者 | 修復後重跑 verify |
| WARN（可接受） | verify 記錄理由 | 當下評估 |
| Spec 合規 / 驗收條件 | reviewer | `/vif-review` Stage 1 |

## 更新 progress.md

驗證完成後（不論 PASS 或 FAIL），更新 `progress.md` 的 Phase 3 區塊：

```markdown
- [x] Phase 3: Verify
  - 結果：PASS
  - WARN 接受項：Rust dead_code warnings (20) — 預留空殼
```

- **PASS**（含 WARN 已接受）→ 勾選 `[x]`，記錄結果與日期
- **FAIL** → 維持 `[ ]`，記錄失敗結果與日期，回 develop 修復後重跑時覆蓋更新

## Exit Criteria

- [ ] Core stages 全部 PASS
- [ ] WARN 項目全部已評估（修復或記錄理由）
- [ ] Optional stages 已執行或已確認跳過
- [ ] Verification Report 已產出
- [ ] progress.md Phase 3 已更新
- [ ] 進入 `/vif-review`
