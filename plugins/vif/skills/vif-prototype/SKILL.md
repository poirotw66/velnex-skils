---
name: vif-prototype
description: >-
  Phase 1 - Generate interactive HTML prototypes for UI review. Trigger on: "prototype",
  "原型", "mockup", "wireframe", "畫面原型", "HTML prototype", "頁面原型",
  "先出畫面看看", "做個原型".
metadata:
  version: 2.12.0
---

# Phase 1 — Prototype HTML 原型

根據 PRD / Spec / UI Spec 產出可互動的 HTML 原型，讓 Human 在瀏覽器裡實際看到畫面、操作互動後再進入開發。

> 此 skill 是可選的。適用於需要視覺確認的新頁面或複雜互動。簡單 CRUD 或有 Figma 的專案可跳過。

## Stance

**原型是用來丟棄的，不是用來保留的。**

- 原型的目的是「確認方向」，不是「產出程式碼」
- 快速、粗糙、可互動 — 比完美但靜態的文件更有價值
- 不要在原型上追求完美，那是正式開發的事

> 原型確認後，正式開發根據 UI Spec 重新寫，不是在原型上改。

## 輸入

- **必要**：PRD 或 Spec（知道要做什麼）
- **必要**：Guideline — 使用 `/vif-guideline`（context = `prototype`）取得 UI 設計基礎
- **參考**：UI Spec（`docs/ui-specs/` — 如有，照規格做）

## Workflow

### Step 0: 前置檢查

使用 `/vif-guideline`（context = `prototype`）取得 UI 設計基礎：

- **有結果** → 讀取，套用色系、字型、元件風格
- **無結果**（guideline 不存在） → 引導先執行 `/vif-uiux` 建立設計基礎

```
> 尚未建立 UI/UX 設計基礎。
> 建議先執行 /vif-uiux 定義色系、字型、元件規範，再產出原型。
> 要先建立嗎？
>   A. 是，先執行 /vif-uiux
>   B. 不用，用預設風格產出原型
```

### Step 1: 確認範圍

與 Human 確認要做原型的頁面：

```
> 要為以下頁面產出 HTML 原型嗎？
>   1. 登入頁
>   2. 使用者列表頁
>   3. 使用者編輯頁
> 全部做，還是選擇部分？
```

### Step 2: 產出原型

為每個頁面產出獨立的 HTML 檔案：

- **單一 HTML 檔案** — 內嵌 CSS + JS，不需 build
- **套用 guideline** — 如有，使用定義的色系、字型、元件風格
- **可互動** — 按鈕可點、表單可填、Tab 可切換、Modal 可開關
- **假資料** — 用合理的假資料填充，不是 Lorem ipsum
- **響應式** — 基本的響應式佈局

**不需要做：**
- 不接 API（用假資料）
- 不做完整驗證邏輯
- 不追求 pixel-perfect
- 不做狀態管理

### Step 3: Human 確認

- 在瀏覽器裡打開原型
- Human 看畫面、操作互動
- 收集回饋：佈局對嗎？元素對嗎？互動流程對嗎？
- 修改 → 重新確認（快速迭代）

### Step 4: 產出轉化

原型確認後：
- 如果還沒有 UI Spec → 根據確認的原型撰寫 UI Spec（`/vif-ui-spec`）
- 如果已有 UI Spec → 根據 Human 回饋更新 UI Spec
- 原型檔案**不需要保留**（可選擇存在 `docs/prototypes/` 作為參考）

## 產出

- `docs/prototypes/[name].html` — HTML 原型檔案（可選保留）
- Human 確認的回饋 → 輸入給 `/vif-ui-spec`

## Exit Criteria

- [ ] 原型頁面已產出
- [ ] Human 已確認畫面和互動
- [ ] 回饋已記錄
- [ ] 準備進入 `/vif-ui-spec` 或直接開發
