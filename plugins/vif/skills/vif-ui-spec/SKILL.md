---
name: vif-ui-spec
description: >-
  Phase 1 - UI page/component specification writing. Trigger on: "UI spec", "UISpec",
  "頁面規格", "畫面規格", "UI 設計", "page spec", "寫 UI spec",
  "前端規格", "Figma to spec".
metadata:
  version: 3.5.0
---

# Phase 1 — UI Spec 頁面規格

根據 Figma 畫面（或其他設計稿）撰寫 UI 頁面規格，定義每個頁面的欄位、操作、邏輯。

## Stance

**UI Spec 是前端的施工藍圖，不是 Figma 的文字複述。**

- Figma 告訴你「長什麼樣」，UI Spec 告訴你「怎麼運作」
- 每個互動都要回答：觸發什麼？呼叫哪支 API？成功/失敗怎麼處理？
- 不要假設前端工程師看得到 Figma — 寫到「只看這份文件就能開發」的程度

## Prerequisites

- [ ] Spec 已 approved（`docs/specs/NNN-name/spec.md` 存在且 Meta `狀態: approved`，或 `progress.md` 的 `Phase 1: Spec approved` 已勾選）
- [ ] `progress.md` 存在，且設計文件表已列出本次要撰寫的 UISpec 範圍

> 未滿足時：提示使用者先完成 `/vif-spec`。沒 approved spec 就寫 ui-spec = 偏差偵測失準、frontmatter `spec` 關聯指向未確定的 spec、lifecycle 從源頭錯。

## 輸入

- **必要**：Figma 畫面（圖片 / MCP / 結構化描述）或 Prototype 確認結果（從 spec.md Meta「UI 來源」取得，或使用者直接提供）
- **參考**：Spec（`docs/specs/NNN-name/spec.md` — 如有）
- **參考**：ApiSpec（`docs/api-specs/` — 如有，確認可用的 API）
- **參考**：Guideline — 使用 `/vif-guideline`（context = `ui-spec`）取得 UI 設計基礎 + 前端規範

## Workflow

### Step 1: 讀取輸入

1. **確認工作範圍** — 工作範圍 = `progress.md` 設計文件表中狀態為「待撰寫」的 UISpec 項目。
   - Spec Section 4 標為「參考」的頁面 → 僅作為上下文閱讀，不撰寫
   - 不在 progress.md 中的頁面 → 不主動撰寫
   - 發現需要偏離工作範圍 → 走第 7 步偏差上報
2. **讀取 UI 來源** — 從 spec.md Meta 的「UI 來源」取得 Figma / Prototype / URL，或使用者直接提供。有 UI 來源時，UI Spec 必須與之一致
3. 讀取相關 Spec 的頁面清單（如有）
4. **掃描 ApiSpec 和既有 UISpec**（使用 frontmatter 快速比對）：
   ```
   a. Glob docs/api-specs/**/*.md + docs/ui-specs/**/*.md
   b. 讀取每個檔案的 frontmatter（--- 區塊內的 YAML metadata）
   c. 綜合判斷相關性（不限於同 domain/module，跨域關聯也要納入）
   d. Read 僅載入相關文件全文
   ```
5. **讀取 Guideline** — 使用 `/vif-guideline`（context = `ui-spec`）取得相關規範，後續撰寫時遵循
6. **交叉驗證**：以 Spec Section 4 的規劃為主，用 scan 結果交叉驗證（如 spec 標示新增但 scan 發現同 route 已存在 → 提醒衝突）
7. **偏差偵測與上報** — 將交叉驗證結果與 progress.md 工作範圍比對，識別偏差：

   | 偏差類型 | 定義 |
   |---------|------|
   | 需要取代 | Spec 標「參考/修改」，但實際需要全面重設計 |
   | 計畫外新增 | progress.md 未列出，但分析後發現需要新增頁面 |
   | 參考轉修改 | Spec 標「參考」（僅引用），但分析後發現需調整既有頁面 |
   | 計畫不可行 | progress.md 列出的頁面，但分析後認為不需要或應合併 |

   **無偏差** → 直接進入 Step 2

   **有偏差** → 彙整偏差清單，呈報使用者：

   ```
   > ⚠️ UI Spec 分析發現以下偏差：
   >
   > **需要取代（N 項）：**
   > - [既有頁面] → 建議 [處理方式]。原因：[具體原因]
   >
   > **計畫外新增（M 項）：**
   > - [頁面名稱]。原因：[具體原因]
   >
   > **參考轉修改（K 項）：**
   > - [既有頁面] → 建議調整 [欄位/互動]。原因：[具體原因]
   >
   > **計畫不可行（L 項）：**
   > - [頁面名稱] → 建議取消。原因：[具體原因，如：可合併到 X 頁面]
   >
   > 選擇處理方式：
   >   A. 核准全部偏差 → 依下表更新 Spec Section 4 + progress.md → 繼續
   >   B. 逐項確認
   >   C. 拒絕偏差 → 嚴格按原計畫執行
   ```

   **使用者核准後，依偏差類型分別處理 Spec Section 4 和 progress.md：**

   | 偏差類型 | Spec Section 4 動作 | progress.md 動作 |
   |---------|-------------------|-----------------|
   | 需要取代 | 動作欄改為「取代」，補原因與舊頁面參照 | 對應列動作改為「取代」，狀態=待撰寫，備註=「取代 [舊頁面]」 |
   | 計畫外新增 | 新增列，動作=新增 | 新增列，動作=新增，狀態=待撰寫，備註=「設計階段新增」 |
   | 參考轉修改 | 動作欄從「參考」改為「修改」 | 新增列，動作=修改，狀態=待撰寫，備註=「設計階段參考轉修改」 |
   | 計畫不可行 | 動作欄改為「取消」，補原因 | **從設計文件表移除該列**（若曾列入）；此項 Step 2 不撰寫 |

   使用者拒絕 → 按 progress.md 原計畫執行 Step 2

### Step 2: 撰寫 UI Spec

**檔案路徑約束**：每份 UI Spec 的檔案路徑必須完全按照 Spec Section 4 UISpec 欄 / progress.md 路徑欄建立。
- 禁止自行命名檔案
- 禁止為同一頁面建立第二個檔案
- 禁止同一目錄混用兩種命名風格

使用 UI spec 模板（[模板解析](#模板解析) → `ui-spec`，預設 `references/ui-spec-template.md`），撰寫每個頁面的規格：

- 頁面結構與元件清單
- 每個欄位的資料來源（哪支 API）
- 互動行為（操作 → API 呼叫 → 成功/失敗處理）
- 驗證規則
- 權限控制（哪些角色可見/可操作）
- 響應式設計（如適用）

**新增的頁面** → 建立新檔案
**修改的頁面** → 更新既有檔案，標記變更處
**取代的頁面** → 撰寫新設計文件（依 progress.md 路徑），更新舊檔案 frontmatter：加入 `status: deprecated`、`replaced-by: [新檔案路徑]`、`deprecated-spec: spec-NNN`。舊檔案保留

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

### Step 4: 驗證、確認、更新 Progress 與 Commit

1. **完成驗證** — 比對實際產出與 progress.md：
   - progress.md 中每項「待撰寫」的 UISpec 都已撰寫？
   - 沒有 progress.md 以外的檔案被建立？
   - 檔案名稱與 progress.md 路徑欄一致？
   - 有不一致 → 修正後再繼續
2. 呈現自我審查結果 + 文件內容給 Human 確認
3. 回填 Spec Section 4 的 UISpec 路徑（如有 Spec）
4. **更新 progress.md** — 將對應的 UISpec 列更新：
   - 自審欄：`⬜` → `✓`
   - 狀態欄：`待撰寫` → `完成`
   - 路徑欄：填入實際路徑
   - 備註欄：偏差流程核准的新增項目 → 填「設計階段新增」；取代項目 → 填「取代 [舊頁面名稱]」；正常項目 → 維持「—」
   - **如果是更新既有設計文件**（修改，非首次撰寫）→ 重置 Pass 3 checkbox 為未勾選
5. **更新 frontmatter status** — Human 確認後，將本次撰寫/修改的 ui-spec 檔案 frontmatter 的 `status` 更新為 `approved`（不論原值為 `draft` 或 `implemented`；修改既有 implemented 文件即代表實作已與設計脫鉤，需降回 approved 重新走 close 流程）
6. **commit**（`docs: add/update ui-spec [module]/[page] (spec-NNN)`）

**存放位置：** `docs/ui-specs/[module]/[page]/[name].md`

## God Mode Override

被 `/vif-god` 驅動時，以下行為變更：

| 步驟 | 正常流程 | God Mode |
|------|---------|----------|
| Step 1 偏差上報 | 呈報使用者確認 | 偏差 ≤ 原計畫 50% → 自動核准（記入 Decisions Made）；偏差 > 50% → 暫停 God Mode，呈報使用者 |
| Step 4 確認 | 呈現給 Human 確認 → commit | 自我審查通過 → 自動 commit（不等 Human） |

## Exit Criteria

- [ ] 每個頁面的 UI Spec 已撰寫
- [ ] 欄位、互動、API 呼叫都已定義
- [ ] **自我審查通過（spec-auditor Pass 1+2）**
- [ ] progress.md 已更新（UISpec 列標為完成 + 自審 ✓）
- [ ] Human 已確認（God Mode: 自動放行）
- [ ] 已 commit

## 模板解析

撰寫 UI Spec 前先解析要用哪一份模板：

1. 讀取 CLAUDE.md 的 `Templates` 區塊是否有 `ui-spec → <path>` 設定
   - **Monorepo** → 讀當前 repo 的 `.claude/CLAUDE.md`
   - **Multi-repo** → 讀 **docs repo** 的 `.claude/CLAUDE.md`
2. **有且檔案存在** → 使用該專案模板，但仍需保留本 skill 要求的核心資訊（欄位資料來源、互動行為、驗證規則、權限控制、空/錯誤/Loading 狀態）
3. **指定但檔案不存在** → 警告 Human 後 fallback 到內建模板
4. **未設定** → 使用 plugin 內建 `references/ui-spec-template.md`
