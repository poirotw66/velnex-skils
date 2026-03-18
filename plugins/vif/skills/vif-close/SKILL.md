---
name: vif-close
description: >-
  Phase 5 - Development completion and wrap-up. Trigger on: "close", "完成",
  "收尾", "結案", "wrap up", "finish", "done", "closing checklist",
  "merge ready".
metadata:
  version: 2.5.3
---

# Phase 5 — Close 完成

確認所有工作項目完成，同步設計文件，更新追蹤文件，標記完成。

## Workspace

> Multi-repo 下，所有 `docs/` 路徑透過 workspace 設定解析。見 `/vif-flow` Workspace Mode。

| 操作 | 位置 |
|------|------|
| Design Doc Sync（api-spec、ui-spec、schema） | docs repo |
| 更新 progress.md、specs-overview、feature-map | docs repo |
| 檢查 implementation 偏離 | code repo |
| git commit | 各自的 repo |

## Prerequisites

- [ ] Phase 4 Code Review — Human approved

## Design Doc Sync

開發過程中，設計可能微調。在關閉前確保設計文件反映最終實作：

- [ ] `docs/api-specs/` — API 實作如有偏離原設計，更新 api-spec 和 openapi.yaml
- [ ] `docs/ui-specs/` — UI 實作如有偏離原設計，更新 ui-spec
- [ ] `docs/schema/` — DB 實作如有偏離原設計，更新 schema

> 目標不是讓設計文件完美，而是讓下一個讀到它的人不會被誤導。

## Completion Checklist

### 驗收

- [ ] 所有 .feature scenario 已實現且測試通過
- [ ] AC-manual（如有）已驗證

### 品質

- [ ] 測試覆蓋率達標（整體 ≥ 80%，核心 ≥ 90%）
- [ ] 無 🔴 Critical / 🟡 Major 未解決項目
- [ ] Security review 通過

### 文件更新

- [ ] `progress.md` — 所有任務標記完成，決策已記錄
- [ ] `docs/specs/specs-overview.md` — spec 狀態更新為 ✔️ done
- [ ] `docs/feature-map.md` — 對應功能狀態更新為 ✅
- [ ] 設計文件已同步（見上方 Design Doc Sync）

### 版控

- [ ] 所有變更已 **commit**（`docs: close spec-NNN, update feature-map`）
- [ ] Git tag 已建立（如為重要里程碑）

## Exit Criteria

- [ ] 所有 Checklist 項目完成
- [ ] Spec 狀態更新為 done
- [ ] Feature map 已更新
- [ ] 已 commit
