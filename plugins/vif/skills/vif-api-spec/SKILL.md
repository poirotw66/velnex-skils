---
name: vif-api-spec
description: >-
  Phase 1 - API specification, OpenAPI, and DB schema writing. Trigger on: "API spec",
  "ApiSpec", "API 規格", "openapi", "swagger", "寫 API spec", "dbschema",
  "DB schema", "資料庫設計", "寫 API", "後端規格".
metadata:
  version: 3.5.0
---

# Phase 1 — API Spec 規格 + OpenAPI + DB Schema

撰寫 API 完整規格（Request/Response/檢核/商業邏輯），維護 openapi.yaml，設計 DB Schema。

## Agent Dispatch (Cursor & Codex)

Dispatch `spec-auditor` (`design-review`) via Task (Cursor) or spawn custom agent (Codex).

## Stance

**API Spec 不是 endpoint 清單，是後端的完整施工藍圖。**

- 每支 API 都要回答：什麼情況下會失敗？失敗時使用者看到什麼？
- DB Schema 要回答：這張 table 六個月後會長怎樣？索引夠嗎？
- openapi.yaml 是機器可讀的 source of truth — API Spec 的 markdown 是給人看的補充

> **每個錯誤都有名字。** `rescue StandardError` 永遠是壞味道。列出每支 API 可能的具體錯誤。

## Prerequisites

- [ ] Spec 已 approved（`docs/specs/NNN-name/spec.md` 存在且 Meta `狀態: approved`，或 `progress.md` 的 `Phase 1: Spec approved` 已勾選）
- [ ] `progress.md` 存在，且設計文件表已列出本次要撰寫的 ApiSpec / Schema 範圍

> 未滿足時：提示使用者先完成 `/vif-spec`。沒 approved spec 就寫 api-spec = 偏差偵測失準、frontmatter `spec` 關聯指向未確定的 spec、lifecycle 從源頭錯。

## 輸入

- **必要**：PRD（或 Spec 的 API/DB 清單）
- **參考**：Spec（`docs/specs/NNN-name/spec.md` — 如有，含 UI 來源）
- **參考**：.feature（`docs/features/` — 如有，對應行為規格）
- **參考**：既有 openapi.yaml 和 schema（確認不 breaking）
- **參考**：Guideline — 使用 `/vif-guideline`（context = `api-spec`）取得後端設計規範

## Workflow

### Step 1: 讀取輸入與影響分析

1. **確認工作範圍** — 工作範圍 = `progress.md` 設計文件表中狀態為「待撰寫」的 ApiSpec + Schema 項目。
   - Spec Section 4 標為「參考」的 API → 僅作為上下文閱讀，不撰寫、不修改、不取代
   - 不在 progress.md 中的 API → 不主動撰寫
   - 發現需要偏離工作範圍 → 走第 8 步偏差上報
2. 讀取 PRD / Spec 的 API 和 DB 清單
3. **讀取 UI 來源** — 從 spec.md Meta 的「UI 來源」取得 Figma / Prototype / URL（如有）。有 UI 來源時，API 的 request/response 必須能支撐畫面所需的所有資料與互動
4. **讀取 Guideline** — 使用 `/vif-guideline`（context = `api-spec`）取得相關規範，後續撰寫時遵循
5. **掃描現有設計文件**（使用 frontmatter 快速比對）：
   ```
   a. Glob docs/api-specs/**/*.md + docs/schema/**/*.md
   b. 讀取每個檔案的 frontmatter（--- 區塊內的 YAML metadata）
   c. 綜合判斷相關性（不限於同 domain/module，跨域關聯也要納入）
   d. Read 僅載入相關文件全文
   ```
6. **交叉驗證**：以 Spec Section 4 的規劃為主，用 scan 結果交叉驗證（如 spec 標示新增但 scan 發現同 path 已存在 → 提醒衝突）
7. 列出影響清單：

```
### API
| 動作 | API | Path | 現有檔案 |
|------|-----|------|---------|
| 新增 | 登入 | POST /auth/login | — |
| 修改 | 取得使用者 | GET /users/:id | docs/api-specs/iam/user/get-user.md |

### DB
| 動作 | Table | 現有檔案 |
|------|-------|---------|
| 新增 | login_attempts | — |
| 修改 | users（加欄位）| docs/schema/iam-auth.md |
```

8. **偏差偵測與上報** — 將交叉驗證結果與 progress.md 工作範圍比對，識別偏差：

   | 偏差類型 | 定義 |
   |---------|------|
   | 需要取代 | Spec 標「參考/修改」，但實際需要全面重設計 |
   | 計畫外新增 | progress.md 未列出，但業務邏輯分析後發現需要 |
   | 參考轉修改 | Spec 標「參考」（僅引用），但分析後發現需調整既有設計 |
   | 計畫不可行 | progress.md 列出的 API，但分析後認為不需要或應合併 |

   **無偏差** → 直接進入 Step 2

   **有偏差** → 彙整偏差清單，呈報使用者：

   ```
   > ⚠️ API Spec 影響分析發現以下偏差：
   >
   > **需要取代（N 項）：**
   > - [既有 API] → 建議 [處理方式]。原因：[具體原因]
   >
   > **計畫外新增（M 項）：**
   > - [API 名稱]。原因：[具體原因]
   >
   > **參考轉修改（K 項）：**
   > - [既有 API] → 建議調整 [欄位/邏輯]。原因：[具體原因]
   >
   > **計畫不可行（L 項）：**
   > - [API 名稱] → 建議取消。原因：[具體原因，如：可用既有 X 達成]
   >
   > 選擇處理方式：
   >   A. 核准全部偏差 → 依下表更新 Spec Section 4 + progress.md → 繼續
   >   B. 逐項確認
   >   C. 拒絕偏差 → 嚴格按原計畫執行
   ```

   **使用者核准後，依偏差類型分別處理 Spec Section 4 和 progress.md：**

   | 偏差類型 | Spec Section 4 動作 | progress.md 動作 |
   |---------|-------------------|-----------------|
   | 需要取代 | 動作欄改為「取代」，補原因與舊檔案參照 | 對應列動作改為「取代」，狀態=待撰寫，備註=「取代 [舊檔]」 |
   | 計畫外新增 | 新增列，動作=新增 | 新增列，動作=新增，狀態=待撰寫，備註=「設計階段新增」 |
   | 參考轉修改 | 動作欄從「參考」改為「修改」 | 新增列，動作=修改，狀態=待撰寫，備註=「設計階段參考轉修改」 |
   | 計畫不可行 | 動作欄改為「取消」，補原因 | **從設計文件表移除該列**（若曾列入）；此項 Step 2 不撰寫 |

   使用者拒絕 → 按 progress.md 原計畫執行 Step 2

### Step 2: 撰寫 API Spec

**檔案路徑約束**：每支 API Spec 的檔案路徑必須完全按照 Spec Section 4 ApiSpec 欄 / progress.md 路徑欄建立。
- 禁止自行命名檔案
- 禁止為同一 API 建立第二個檔案
- 禁止同一目錄混用兩種命名風格

使用 API spec 模板（[模板解析](#模板解析) → `api-spec`，預設 `references/api-spec-template.md`），每支 API 包含：

- Method、Path、說明
- Request（Headers、Parameters、Body + 驗證規則）
- Response（成功 + 各種錯誤）
- 業務規則
- 邊界條件
- 範例（curl + response）

**取代項目處理**：當處理 Spec 標為「取代」的項目時：
1. 撰寫新設計文件（依 progress.md 路徑）
2. 更新舊設計文件的 frontmatter：加入 `status: deprecated`、`replaced-by: [新檔案路徑]`、`deprecated-spec: spec-NNN`
3. 舊檔案不刪除，保留作為歷史參考

**錯誤映射表（每支 API 必須）：**

| 情境 | HTTP Status | Error Code | 使用者看到 |
|------|-------------|------------|-----------|
| 帳號不存在 | 401 | AUTH_INVALID | 帳號或密碼錯誤 |
| 密碼錯誤 | 401 | AUTH_INVALID | 帳號或密碼錯誤 |
| 帳號被鎖定 | 403 | AUTH_LOCKED | 帳號已鎖定，請稍後再試 |

### Step 3: 更新 openapi.yaml

- 使用 **OpenAPI 3.0.3**（工具生態相容性最佳，Swagger UI / codegen / VS Code 擴充套件皆支援）
- 新增的 API → 加入 paths
- 修改的 API → 更新對應 path
- 取代的 API → 舊 path 標記 `deprecated: true`，加入新 path
- 新增的 schema → 加入 components/schemas
- 確認不破壞既有 API（breaking change 需在 Spec 中標註）

> **這是 develop 階段的必讀 contract。** `vif-develop` 會自動載入 `docs/api-specs/**/openapi.yaml`，作為 test-writer 寫 contract test、implementer 生成 types/client 時的契約來源。openapi.yaml 與 api-spec markdown 若不同步，develop 會被 block（`BLOCKED_BY_SPEC`）。Step 5 的 spec-auditor 審查必須比對兩者一致性。

### Step 4: 撰寫 DB Schema

使用 schema 模板（[模板解析](#模板解析) → `schema`，預設 `references/schema-template.md`），每個 domain 包含：

- Table 定義（欄位、型別、nullable、default）
- 索引（PK、UNIQUE、INDEX — 含查詢情境說明）
- 關聯（FK、ON DELETE 策略）
- Enum / 代碼表
- Migration 紀錄

### Step 5: 自我審查（Self-Review）

撰寫完成後，**commit 之前**，派遣 `spec-auditor` 進行自我審查：

**Dispatch Parameters:**
- scope: `design-review`
- targets: 本次撰寫/修改的 api-spec + schema + openapi.yaml 檔案路徑

**審查項目（Pass 1 + Pass 2）：**
- 內部一致性：命名、值、描述 vs 表格
- 完整性：欄位定義、錯誤映射、邊界條件
- API 專屬 checklist：HTTP Status 合理性、Request/Response schema 完整性、命名慣例一致性
- **OpenAPI 同步檢查**：openapi.yaml 與 api-spec markdown 的 path / method / request / response / 錯誤碼逐項比對，不一致視為 Blocker

**結果處理：**
- APPROVED → Step 6（AI Cross-Review 如啟用，已與 spec-auditor 平行完成）
- NEEDS_REVISION → 所有 findings（含 Low）一律修正 → 重跑 spec-auditor（最多 3 次迭代）

> Spec 是施工藍圖，修文字成本極低，不留小問題到開發階段放大。

**AI Cross-Review（可選，team mode only）：**

讀取 CLAUDE.md `AI Cross-Review` 設定，`design` 已啟用且 mode 為 team 時，與 spec-auditor 同時平行觸發。傳入本次撰寫的 api-spec + schema + openapi.yaml。

執行：spec-auditor 與設定的 AI CLI 平行進行獨立審查 → 兩方完成後比對結果 → 有新發現則修正後重跑 spec-auditor。

> solo mode 的設計文件 Cross-Review 在 Pass 3 完成後統一觸發（見 `/vif-spec`）。

### Step 6: 驗證、確認、更新 Progress 與 Commit

1. **完成驗證** — 比對實際產出與 progress.md：
   - progress.md 中每項「待撰寫」的 ApiSpec/Schema 都已撰寫？
   - 沒有 progress.md 以外的檔案被建立？
   - 檔案名稱與 progress.md 路徑欄一致？
   - 有不一致 → 修正後再繼續
2. 呈現自我審查結果 + 文件內容給 Human 確認
3. 回填 Spec Section 4 的 ApiSpec/Schema 路徑（如有 Spec）
4. **更新 progress.md** — 將對應的 ApiSpec / Schema 列更新：
   - 自審欄：`⬜` → `✓`
   - 狀態欄：`待撰寫` → `完成`
   - 路徑欄：填入實際路徑
   - 備註欄：偏差流程核准的新增項目 → 填「設計階段新增」；取代項目 → 填「取代 [舊檔案名稱]」；正常項目 → 維持「—」
   - **如果是更新既有設計文件**（修改，非首次撰寫）→ 重置 Pass 3 checkbox 為未勾選
5. **更新 frontmatter status** — Human 確認後，將本次撰寫/修改的 api-spec + schema 檔案 frontmatter 的 `status` 更新為 `approved`（不論原值為 `draft` 或 `implemented`；修改既有 implemented 文件即代表實作已與設計脫鉤，需降回 approved 重新走 close 流程）
6. **commit**（`docs: add/update api-spec [module]/[domain] (spec-NNN)`）

**存放位置：**
- API Spec：`docs/api-specs/[module]/[domain]/[name].md`
- OpenAPI：`docs/api-specs/[module]/openapi.yaml`
- Schema：`docs/schema/[domain].md`

## God Mode Override

被 `/vif-god` 驅動時，以下行為變更：

| 步驟 | 正常流程 | God Mode |
|------|---------|----------|
| Step 1 偏差上報 | 呈報使用者確認 | 偏差 ≤ 原計畫 50% → 自動核准（記入 Decisions Made）；偏差 > 50% → 暫停 God Mode，呈報使用者 |
| Step 6 確認 | 呈現給 Human 確認 → commit | 自我審查通過 → 自動 commit（不等 Human） |

## Exit Criteria

- [ ] 每支 API 的 API Spec 已撰寫（含錯誤映射表）
- [ ] openapi.yaml 已更新（paths / schemas / deprecated 標記）
- [ ] **openapi.yaml 與新增/修改的 api-spec markdown 內容一致**（path、method、request/response schema、錯誤碼）
- [ ] DB Schema 已撰寫/更新
- [ ] 既有 API/Schema 的修改已標記
- [ ] **自我審查通過（spec-auditor Pass 1+2）**
- [ ] progress.md 已更新（ApiSpec / Schema 列標為完成 + 自審 ✓）
- [ ] Human 已確認（God Mode: 自動放行）
- [ ] 已 commit

## 模板解析

撰寫 API Spec 與 Schema 前先解析要用哪一份模板：

1. 讀取 CLAUDE.md 的 `Templates` 區塊是否有 `api-spec → <path>` 或 `schema → <path>` 設定
   - **Monorepo** → 讀當前 repo 的 `.claude/CLAUDE.md`
   - **Multi-repo** → 讀 **docs repo** 的 `.claude/CLAUDE.md`
2. **有且檔案存在** → 使用該專案模板，但仍需保留本 skill 要求的核心資訊（API: Method/Path/Request/Response/錯誤映射表；Schema: Table/索引/關聯/Migration）
3. **指定但檔案不存在** → 警告 Human 後 fallback 到內建模板
4. **未設定** → 使用 plugin 內建 `references/api-spec-template.md` / `references/schema-template.md`
