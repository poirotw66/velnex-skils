---
name: vif-ui-spec
description: >-
  UI page/component specification writing. Trigger on: "UI spec", "UISpec",
  "頁面規格", "畫面規格", "UI 設計", "page spec", "寫 UI spec",
  "前端規格", "Figma to spec".
metadata:
  version: 2.5.3
---

# UI Spec — 頁面規格

根據 Figma 畫面（或其他設計稿）撰寫 UI 頁面規格，定義每個頁面的欄位、操作、邏輯。

## Stance

**UI Spec 是前端的施工藍圖，不是 Figma 的文字複述。**

- Figma 告訴你「長什麼樣」，UI Spec 告訴你「怎麼運作」
- 每個互動都要回答：觸發什麼？呼叫哪支 API？成功/失敗怎麼處理？
- 不要假設前端工程師看得到 Figma — 寫到「只看這份文件就能開發」的程度

## 輸入

- **必要**：Figma 畫面（圖片 / MCP / 結構化描述）或 Prototype 確認結果
- **參考**：Spec（`docs/specs/NNN-name/spec.md` — 如有）
- **參考**：ApiSpec（`docs/api-specs/` — 如有，確認可用的 API）
- **參考**：Guideline — 使用 `/vif-guideline`（context = `ui-spec`）取得 UI 設計基礎 + 前端規範

## Workflow

### Step 1: 讀取輸入

1. 讀取 Figma 畫面（圖片或 MCP）或 Prototype 確認結果
2. 讀取相關 Spec 的頁面清單（如有）
3. 讀取已有的 ApiSpec（確認可呼叫的 API）
4. **讀取 Guideline** — 使用 `/vif-guideline`（context = `ui-spec`）取得相關規範，後續撰寫時遵循
5. 讀取 `docs/ui-specs/` 下既有頁面（確認是否有需要修改的）

### Step 2: 撰寫 UI Spec

使用 `references/ui-spec-template.md` 模板，撰寫每個頁面的規格：

- 頁面結構與元件清單
- 每個欄位的資料來源（哪支 API）
- 互動行為（操作 → API 呼叫 → 成功/失敗處理）
- 驗證規則
- 權限控制（哪些角色可見/可操作）
- 響應式設計（如適用）

**新增的頁面** → 建立新檔案
**修改的頁面** → 更新既有檔案，標記變更處

### Step 3: 確認與 Commit

- 呈現給 Human 確認
- 回填 Spec Section 4 的 UISpec 路徑（如有 Spec）
- **commit**（`docs: add/update ui-spec [module]/[page]`）

### Step 4: 設計文件交叉比對（自動）

回填路徑後，檢查 Spec Section 4 是否還有「待展開」項目：

- **還有待展開** → 結束，等其他設計文件完成
- **全部到齊** → 派遣 `spec-auditor`（僅 Pass 3）做交叉比對：
  - api-spec 欄位 vs schema 欄位
  - ui-spec 資料來源 vs api-spec response
  - spec.md 描述 vs 設計文件實際內容
  - 通過 → 報告「設計文件交叉比對通過，所有設計文件已就緒」
  - 有問題 → 列出問題，修正後重跑

**存放位置：** `docs/ui-specs/[module]/[page]/[name].md`

## Exit Criteria

- [ ] 每個頁面的 UI Spec 已撰寫
- [ ] 欄位、互動、API 呼叫都已定義
- [ ] Spec 的 UISpec 欄位已回填（如有 Spec）
- [ ] Human 已確認
- [ ] 已 commit
- [ ] 設計文件交叉比對通過（如為最後一份設計文件）
