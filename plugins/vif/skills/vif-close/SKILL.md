---
name: vif-close
description: >-
  Phase 5 - Development completion and wrap-up. Trigger on: "close", "完成",
  "收尾", "結案", "wrap up", "finish", "done", "closing checklist",
  "merge ready".
metadata:
  version: 3.3.0
---

# Phase 5 — Close 完成

確認所有工作項目完成，同步設計文件，更新追蹤文件，標記完成。

## Workspace

> Multi-repo 下，所有 `docs/` 路徑透過 workspace 設定解析。見 `/vif-flow` Workspace Mode。

| 操作 | 位置 |
|------|------|
| Design Doc Sync（api-spec、ui-spec、schema） | docs repo |
| 更新 progress.md、specs-overview | docs repo |
| 檢查 implementation 偏離 | code repo |
| git commit | 各自的 repo |

## Prerequisites

- [ ] Phase 4 Code Review — Human approved

## Design Doc Sync

開發過程中，設計可能微調。在關閉前確保設計文件反映最終實作：

- [ ] `docs/api-specs/` — API 實作如有偏離原設計，更新 api-spec 和 openapi.yaml
- [ ] `docs/ui-specs/` — UI 實作如有偏離原設計，更新 ui-spec
- [ ] `docs/schema/` — DB 實作如有偏離原設計，更新 schema
- [ ] 「取代」項目的舊設計文件已標記 `status: deprecated`（如未在設計階段完成）
- [ ] 本 spec 範圍內的設計文件 frontmatter `status` 從 `approved` 更新為 `implemented` — 範圍 = progress.md 設計文件表列出且狀態為「完成」的 ApiSpec / UISpec / Schema

> 目標不是讓設計文件完美，而是讓下一個讀到它的人不會被誤導。
>
> **若 Design Doc Sync 修改了設計文件內容**（非純格式/typo 修正），必須重跑 spec-auditor Pass 1+2 + Pass 3，確保一致性未被破壞。

## Completion Checklist

### 驗收

- [ ] 所有 .feature scenario 已實現且測試通過
- [ ] reviewer 的 Manual Testing Checklist 已由 Human 驗證（如有）

### 品質

- [ ] 測試覆蓋率達標（整體 ≥ 80%，核心 ≥ 90%）
- [ ] 無 🔴🟠 未解決項目
- [ ] Security review 通過

### 文件更新

- [ ] `progress.md` — 全部項目已完成：
  - 設計文件表：所有狀態為「完成」、自審全部 ✓、Pass 3 ✓
  - Phase 1-5：全部 `[x]`
  - 決策紀錄已記錄
- [ ] `docs/specs/specs-overview.md` — spec 狀態更新為 ✔️ done，領域正確
- [ ] 設計文件已同步（見上方 Design Doc Sync）
- [ ] 設計文件 frontmatter 一致性：每份設計文件的 `spec` 欄位指向正確的 spec

### 版控

- [ ] 所有變更已 **commit**（`docs: close spec-NNN`）
- [ ] Git tag 已建立（如為重要里程碑）

## Exit Criteria

- [ ] 所有 Checklist 項目完成
- [ ] Spec 狀態更新為 done
- [ ] 已 commit
