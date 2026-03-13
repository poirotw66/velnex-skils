---
name: vif-verify
description: >-
  Phase 3 - Six-stage automated verification pipeline. Trigger on: "verify",
  "驗證", "verification", "pipeline", "驗證流水線", "跑驗證", "品質檢查",
  "build check", "pre-review check".
metadata:
  version: 1.0.0
---

# Phase 3 — Verify 六階段自動化驗證

全面驗證程式碼品質，產出 Verification Report。

## Prerequisites

- [ ] Phase 2 所有任務完成
- [ ] 所有測試通過

## Six-Stage Pipeline

派遣 `verifier` agent 執行：

```
Stage 1     Stage 2       Stage 3     Stage 4       Stage 5       Stage 6
Build    →  Type Check  →  Lint     →  Test Suite →  Security  →  Diff Review
```

**所有 stage 都執行，即使早期 stage 失敗也繼續。** 收集完整問題清單。

### Stage 1: Build

- 專案可成功建構
- `npm run build` / `bun build` / 對應命令

### Stage 2: Type Check

- 型別檢查通過，無 error
- `npx tsc --noEmit` / `flutter analyze` / 對應命令

### Stage 3: Lint

- 程式碼風格一致
- `npm run lint` / 對應命令
- 無 error（warning 需評估是否可接受）

### Stage 4: Test Suite

- 所有測試通過
- 覆蓋率達標（整體 ≥ 80%，核心 ≥ 90%）
- 無 skip 的測試（除非有正當理由）

### Stage 5: Security

派遣 `security-reviewer` agent。

**OWASP Top 10 系統性檢查：**

1. **Injection** — SQL、Command、XSS、Path Traversal
2. **Broken Authentication** — Session 管理、密碼處理
3. **Sensitive Data Exposure** — 加密、Log 洩漏
4. **Broken Access Control** — 授權檢查
5. **Security Misconfiguration** — 硬編碼 secrets、debug 模式
6. **Vulnerable Dependencies** — `npm audit` / `cargo audit`

### Stage 6: Diff Review

- 變更範圍與 spec 一致
- 無意外的檔案變更
- 無遺留 debug 程式碼（console.log、print、debugger）
- 無註解掉的程式碼

## Tool Restrictions

- **Verifier subagent**: 僅 Bash + Read（不能 Edit/Write）
- **Security reviewer subagent**: 僅 Read（不能 Edit/Write/Bash）

驗證過程**只檢測不修復**。發現問題就記錄，不要修改程式碼。

## Report Format

```
# Verification Report

## Summary
Overall: PASS / WARN / FAIL
Date: YYYY-MM-DD

## Stage Results
| Stage | Status | Details |
|-------|--------|---------|
| Build | ✅/❌ | [output summary] |
| Type Check | ✅/❌ | [output summary] |
| Lint | ✅/❌ | [N warnings, M errors] |
| Test Suite | ✅/❌ | [N pass, M fail, coverage: X%] |
| Security | ✅/❌ | [N vulnerabilities] |
| Diff Review | ✅/❌ | [N files changed] |

## Issues
[具體問題描述，含檔案位置和錯誤訊息]

## Verdict
READY / NOT READY for Code Review
```

## Failure Handling

1. 記錄所有失敗 stage 和具體錯誤
2. 回到 Phase 2 修復問題
3. 修復後重新執行**完整** pipeline
4. 最多 3 次修復循環，超過 escalate

## Exit Criteria

- [ ] 六階段全部 PASS（或 WARN 已評估可接受）
- [ ] Verification Report 已產出
- [ ] 進入 Phase 4（`/code-review`）
