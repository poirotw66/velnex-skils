---
name: vif-close
description: >-
  Phase 5 - Development completion and wrap-up. Trigger on: "close", "完成",
  "收尾", "結案", "wrap up", "finish", "done", "closing checklist",
  "merge ready".
metadata:
  version: 1.0.0
---

# Phase 5 — Close 完成

確認所有工作項目完成，更新追蹤文件，標記完成。

## Prerequisites

- [ ] Phase 4 Code Review — Human approved

## Verification Before Completion Gate

在宣告完成之前，**必須獨立驗證以下 5 點**。
不可跳過任何一項。不可依賴先前的驗證結果。**親自重新確認。**

1. **Tests pass** — 執行完整測試套件，確認全部通過
2. **Build succeeds** — 執行 build，確認成功
3. **Spec fulfilled** — 逐條對照 .feature scenario，確認全部實現
4. **No regressions** — 確認既有功能未受影響
5. **Clean state** — 無遺留 debug 程式碼、無 TODO hack、無註解掉的程式碼

## Completion Checklist

### 驗收

- [ ] 所有 .feature scenario 已實現且測試通過
- [ ] AC-manual（如有）已驗證
- [ ] Verification Report 最新且為 PASS

### 品質

- [ ] 測試覆蓋率達標（整體 ≥ 80%，核心 ≥ 90%）
- [ ] 無 🔴 Critical / 🟡 Major 未解決項目
- [ ] Security review 通過

### 文件更新

- [ ] `progress.md` — 所有任務標記完成，決策已記錄
- [ ] `docs/specs/specs-overview.md` — spec 狀態更新為 ✔️ done
- [ ] `docs/feature-map.md` — 對應功能狀態更新為 ✅

### 版控

- [ ] 所有變更已 commit（遵循 Conventional Commits）
- [ ] Git tag 已建立（如為重要里程碑）

## Execution

1. 執行 Verification Before Completion Gate（5 點）
2. 逐項完成 Checklist
3. 更新追蹤文件
4. 向 Human 報告完成狀態

## Exit Criteria

- [ ] 所有 Checklist 項目完成
- [ ] Spec 狀態更新為 done
- [ ] Feature map 已更新
