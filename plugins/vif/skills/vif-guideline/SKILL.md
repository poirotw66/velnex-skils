---
name: vif-guideline
description: >-
  Resolve and inject project guidelines based on task context. Trigger on:
  "guideline", "規範", "開發規範", "coding standard", "convention",
  "resolve guideline", "讀取規範".
metadata:
  version: 2.5.0
---

# Guideline — 專案規範解析

根據當前 task 的 context，找到並回傳相關的 guideline 內容。

## 用途

被其他 skill 引用，提供對應的 guideline：

| 呼叫方 | 用途 |
|--------|------|
| `/vif-api-spec` | 撰寫 API 規格時遵循後端設計慣例 |
| `/vif-ui-spec` | 撰寫 UI 規格時遵循設計基礎和前端慣例 |
| `/vif-develop` | dispatch test-writer / implementer 時注入 |
| `/vif-review` | dispatch reviewer 時注入 |
| `/vif-prototype` | 產出原型時套用 UI 設計基礎 |

## 解析流程

```
1. 讀取 CLAUDE.md 的「Guideline 映射」設定
   ├── 有映射 → 依映射取得對應路徑
   └── 無映射 → 進入目錄慣例
2. 掃描 guideline/ 目錄結構
3. 根據 context 匹配相關 guideline
4. 讀取匹配到的檔案內容
5. 回傳內容（供呼叫方注入或直接遵循）
```

## 解析順序

1. **CLAUDE.md 映射優先** — 如果有設定，依照映射
2. **目錄慣例 fallback** — 如果沒有映射，依目錄結構匹配

## 目錄慣例

```
guideline/
├── frontend/        ← 前端開發規範
├── backend/         ← 後端開發規範
├── ui/              ← UI/UX 設計基礎（vif-uiux 產出）
├── database/        ← 資料庫規範
└── testing/         ← 測試規範
```

> 目錄名稱是慣例，不是強制。有什麼就匹配什麼。

## Context 匹配規則

| Context | 匹配的 guideline |
|---------|-----------------|
| `api-spec` | `backend/` |
| `ui-spec` | `frontend/` + `ui/` |
| `schema` | `database/` |
| `testing` | `testing/` |
| `prototype` | `ui/` |

> 一個 context 可能匹配多個目錄。

## CLAUDE.md 映射格式

覆蓋目錄慣例。支援檔案和資料夾，資料夾會讀取底下所有 `.md` 檔案：

```markdown
### Guideline 映射
- api-spec → guideline/backend/
- ui-spec → guideline/frontend/, guideline/ui/
- schema → guideline/database/naming.md
- testing → guideline/testing/
- prototype → guideline/ui/
```

## 輸出格式

當被其他 skill 調用時，回傳格式：

```
--- guideline/backend/api-design.md ---
[檔案內容]

--- guideline/backend/error-format.md ---
[檔案內容]
```

用於 agent dispatch 時注入：

```
以下是本專案的開發規範，請遵循：
[上述 guideline 內容]
```

## 直接使用

也可以直接執行 `/vif-guideline` 查看專案有哪些 guideline：

```
> 掃描 guideline/ 目錄：
>
> guideline/
> ├── backend/
> │   ├── api-design.md
> │   └── error-format.md
> ├── frontend/
> │   └── svelte-convention.md
> ├── ui/
> │   └── ui-guideline.md
> └── testing/
>     └── testing-guideline.md
>
> CLAUDE.md 映射：（無 / 有，列出內容）
```
