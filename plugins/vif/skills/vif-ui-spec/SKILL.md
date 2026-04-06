---
name: vif-ui-spec
description: >-
  Phase 1 - UI page/component specification writing. Trigger on: "UI spec", "UISpec",
  "頁面規格", "畫面規格", "UI 設計", "page spec", "寫 UI spec",
  "前端規格", "Figma to spec".
metadata:
  version: 2.15.0
---

# Phase 1 — UI Spec 頁面規格

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
3. **掃描 ApiSpec 和既有 UISpec**（使用 frontmatter 快速比對）：
   ```
   a. Glob docs/api-specs/**/*.md + docs/ui-specs/**/*.md
   b. 讀取每個檔案的 frontmatter（--- 區塊內的 YAML metadata）
   c. 綜合判斷相關性（不限於同 domain/module，跨域關聯也要納入）
   d. Read 僅載入相關文件全文
   ```
4. **讀取 Guideline** — 使用 `/vif-guideline`（context = `ui-spec`）取得相關規範，後續撰寫時遵循
5. **確認新增 vs 修改**：以 Spec Section 4 的規劃為主，用 scan 結果交叉驗證（如 spec 標示新增但 scan 發現同 route 已存在 → 提醒衝突）

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

### Step 3: 自我審查（Self-Review）

撰寫完成後，**commit 之前**，派遣 `spec-auditor` 進行自我審查：

**Dispatch Parameters:**
- scope: `design-review`
- targets: 本次撰寫/修改的 ui-spec 檔案路徑

**審查項目（Pass 1 + Pass 2）：**
- 內部一致性：命名、值、描述 vs 表格
- 完整性：欄位定義、操作流程、生命週期
- UI 專屬 checklist：每個欄位有資料來源？空狀態？錯誤狀態？Loading 狀態？權限控制？

**結果處理：**
- APPROVED → Step 4（AI Cross-Review 如啟用，已與 spec-auditor 平行完成）
- NEEDS_REVISION → 所有 findings（含 Low）一律修正 → 重跑 spec-auditor（最多 3 次迭代）

> Spec 是施工藍圖，修文字成本極低，不留小問題到開發階段放大。

**AI Cross-Review（可選，team mode only）：**

讀取 CLAUDE.md `AI Cross-Review` 設定，`design` 已啟用且 mode 為 team 時，與 spec-auditor 同時平行觸發。傳入本次撰寫的 ui-spec 檔案。

執行：spec-auditor 與設定的 AI CLI 平行進行獨立審查 → 兩方完成後比對結果 → 有新發現則修正後重跑 spec-auditor。

> solo mode 的設計文件 Cross-Review 在 Pass 3 完成後統一觸發（見 `/vif-spec`）。

### Step 4: 確認、更新 Progress 與 Commit

1. 呈現自我審查結果 + 文件內容給 Human 確認
2. 回填 Spec Section 4 的 UISpec 路徑（如有 Spec）
3. **更新 progress.md** — 將對應的 UISpec 列更新：
   - 自審欄：`⬜` → `✓`
   - 狀態欄：`待撰寫` → `完成`
   - 路徑欄：填入實際路徑
   - **如果是更新既有設計文件**（修改，非首次撰寫）→ 重置 Pass 3 checkbox 為未勾選
4. **commit**（`docs: add/update ui-spec [module]/[page]`）

**存放位置：** `docs/ui-specs/[module]/[page]/[name].md`

## Exit Criteria

- [ ] 每個頁面的 UI Spec 已撰寫
- [ ] 欄位、互動、API 呼叫都已定義
- [ ] **自我審查通過（spec-auditor Pass 1+2）**
- [ ] progress.md 已更新（UISpec 列標為完成 + 自審 ✓）
- [ ] Human 已確認
- [ ] 已 commit
