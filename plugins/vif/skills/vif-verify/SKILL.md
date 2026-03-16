---
name: vif-verify
description: >-
  Automated verification pipeline. Trigger on: "verify", "驗證",
  "verification", "pipeline", "驗證流水線", "跑驗證", "品質檢查",
  "build check", "pre-review check".
metadata:
  version: 2.1.1
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

## Pipeline 結構

### Core Stages（必跑）

派遣 `verifier` agent 執行 Stage 1-5：

```
Stage 1     Stage 2       Stage 3     Stage 4       Stage 5
Build    →  Type Check  →  Lint     →  Test Suite →  Diff Review
```

**Stage 6: Security Review**（必跑）

派遣 `security-reviewer` agent，執行 OWASP Top 10 系統性檢查：

1. **Injection** — SQL、Command、XSS、Path Traversal
2. **Broken Authentication** — Session 管理、密碼處理
3. **Sensitive Data Exposure** — 加密、Log 洩漏
4. **Broken Access Control** — 授權檢查
5. **Security Misconfiguration** — 硬編碼 secrets、debug 模式
6. **Vulnerable Dependencies** — `npm audit` / `cargo audit`

**所有 stage 都執行，即使早期 stage 失敗也繼續。** 收集完整問題清單。

### Optional Stages（可選）

**Stage 7: Code Quality**

> **Claude Code 環境**：使用內建的 `/simplify` skill，啟動三個並行審查。
> **非 Claude Code 環境**：跳過此 stage，改由人工 code review 處理。

檢查內容：
- **Code Reuse** — 重複實作、可用既有 utility 替代的手寫邏輯
- **Code Quality** — 多餘狀態、參數膨脹、複製貼上微變、抽象洩漏
- **Efficiency** — 多餘計算、缺少並行、熱路徑膨脹、N+1、記憶體洩漏

> Code Quality 只**報告**問題，不修復。Human 決定要修的項目後自行處理。

**Stage 8: Design Doc Consistency**

派遣 `verifier` agent，以 spec.md 的 Section 4 引用為準，逐項驗證：

- **API 一致性**：API 實作與 spec 引用的 `docs/api-specs/` 及 `openapi.yaml` 一致
- **UI 一致性**：頁面實作與 spec 引用的 `docs/ui-specs/` 一致
- **Schema 一致性**：DB model 與 spec 引用的 `docs/schema/` 一致
- **行為一致性**：實作與 spec 引用的 `.feature` 一致（如有）
- 無 breaking change（或已在 spec 中標註）

> 若 spec 未引用任何設計文件，跳過此 stage。

### Optional Stages 的啟用方式

1. **CLAUDE.md 預設**（取消註解即啟用，預設不啟用）：
```markdown
### vif-verify 設定
# - Code Quality: true
# - Design Doc Consistency: true
```

2. **執行時互動**（CLAUDE.md 未預設時詢問）：
```
> Core stages 執行完畢。要執行額外檢核嗎？
>   A. Code Quality（Reuse + Quality + Efficiency）
>   B. Design Doc Consistency（對照 spec 引用的設計文件）
>   C. 全部
>   D. 不用
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
| Security | ✅/❌/⏭ | [N vulnerabilities] |

## Optional Stage Results
| Stage | Status | Details |
|-------|--------|---------|
| Code Quality | ✅/⚠️/⏭ | [N issues found] |
| Design Doc | ✅/⚠️/⏭ | [consistency check result] |

## Issues
[具體問題描述，含檔案位置和錯誤訊息]

## Verdict
READY / NOT READY for Code Review
```

## Failure Handling

1. 記錄所有失敗 stage 和具體錯誤
2. 回到開發修復問題
3. 修復後重新執行**完整** pipeline（不要只跑失敗的 stage）
4. 最多 3 次修復循環，超過 escalate

## Exit Criteria

- [ ] Core stages 全部 PASS（或 WARN 已評估可接受）
- [ ] Optional stages 已執行或已確認跳過
- [ ] Verification Report 已產出
- [ ] 進入 `/vif-review`
