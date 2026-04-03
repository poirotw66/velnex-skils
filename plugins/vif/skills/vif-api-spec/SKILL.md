---
name: vif-api-spec
description: >-
  Phase 1 - API specification, OpenAPI, and DB schema writing. Trigger on: "API spec",
  "ApiSpec", "API 規格", "openapi", "swagger", "寫 API spec", "dbschema",
  "DB schema", "資料庫設計", "寫 API", "後端規格".
metadata:
  version: 2.12.0
---

# Phase 1 — API Spec 規格 + OpenAPI + DB Schema

撰寫 API 完整規格（Request/Response/檢核/商業邏輯），維護 openapi.yaml，設計 DB Schema。

## Stance

**API Spec 不是 endpoint 清單，是後端的完整施工藍圖。**

- 每支 API 都要回答：什麼情況下會失敗？失敗時使用者看到什麼？
- DB Schema 要回答：這張 table 六個月後會長怎樣？索引夠嗎？
- openapi.yaml 是機器可讀的 source of truth — API Spec 的 markdown 是給人看的補充

> **每個錯誤都有名字。** `rescue StandardError` 永遠是壞味道。列出每支 API 可能的具體錯誤。

## 輸入

- **必要**：PRD + Figma 畫面（或 Spec 的 API/DB 清單）
- **參考**：Spec（`docs/specs/NNN-name/spec.md` — 如有）
- **參考**：.feature（`docs/features/` — 如有，對應行為規格）
- **參考**：既有 openapi.yaml 和 schema（確認不 breaking）
- **參考**：Guideline — 使用 `/vif-guideline`（context = `api-spec`）取得後端設計規範

## Workflow

### Step 1: 讀取輸入與影響分析

1. 讀取 PRD / Spec 的 API 和 DB 清單
2. 讀取 Figma 畫面（確認需要什麼資料）
3. **讀取 Guideline** — 使用 `/vif-guideline`（context = `api-spec`）取得相關規範，後續撰寫時遵循
4. **掃描現有設計文件**（使用 frontmatter 快速比對）：
   ```
   a. Glob docs/api-specs/**/*.md + docs/schema/**/*.md
   b. 讀取每個檔案的 frontmatter（--- 區塊內的 YAML metadata）
   c. 綜合判斷相關性（不限於同 domain/module，跨域關聯也要納入）
   d. Read 僅載入相關文件全文
   ```
5. **確認新增 vs 修改**：以 Spec Section 4 的規劃為主，用 scan 結果交叉驗證（如 spec 標示新增但 scan 發現同 path 已存在 → 提醒衝突）
6. 列出影響清單：

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

### Step 2: 撰寫 API Spec

使用 `references/api-spec-template.md` 模板，每支 API 包含：

- Method、Path、說明
- Request（Headers、Parameters、Body + 驗證規則）
- Response（成功 + 各種錯誤）
- 業務規則
- 邊界條件
- 範例（curl + response）

**錯誤映射表（每支 API 必須）：**

| 情境 | HTTP Status | Error Code | 使用者看到 |
|------|-------------|------------|-----------|
| 帳號不存在 | 401 | AUTH_INVALID | 帳號或密碼錯誤 |
| 密碼錯誤 | 401 | AUTH_INVALID | 帳號或密碼錯誤 |
| 帳號被鎖定 | 403 | AUTH_LOCKED | 帳號已鎖定，請稍後再試 |

### Step 3: 更新 openapi.yaml

- 新增的 API → 加入 paths
- 修改的 API → 更新對應 path
- 新增的 schema → 加入 components/schemas
- 確認不破壞既有 API（breaking change 需在 Spec 中標註）

### Step 4: 撰寫 DB Schema

使用 `references/schema-template.md` 模板，每個 domain 包含：

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

**結果處理：**
- APPROVED → 進入 AI Cross-Review（如啟用）或 Step 6
- NEEDS_REVISION → 依報告修正 → 重跑 spec-auditor（最多 3 次迭代）

**AI Cross-Review（可選，team mode only）：**

讀取 CLAUDE.md `AI Cross-Review` 設定，`design` 已啟用且 mode 為 team 時觸發。傳入本次撰寫的 api-spec + schema + openapi.yaml。

執行：呼叫設定的 AI CLI → 比對 spec-auditor 結果 → 有新發現則修正後重跑 spec-auditor。

> solo mode 的設計文件 Cross-Review 在 Pass 3 完成後統一觸發（見 `/vif-spec`）。

### Step 6: 確認、更新 Progress 與 Commit

1. 呈現自我審查結果 + 文件內容給 Human 確認
2. 回填 Spec Section 4 的 ApiSpec/Schema 路徑（如有 Spec）
3. **更新 progress.md** — 將對應的 ApiSpec / Schema 列更新：
   - 自審欄：`⬜` → `✓`
   - 狀態欄：`待撰寫` → `完成`
   - 路徑欄：填入實際路徑
   - **如果是更新既有設計文件**（修改，非首次撰寫）→ 重置 Pass 3 checkbox 為未勾選
4. **commit**（`docs: add/update api-spec [module]/[domain]`）

**存放位置：**
- API Spec：`docs/api-specs/[module]/[domain]/[name].md`
- OpenAPI：`docs/api-specs/[module]/openapi.yaml`
- Schema：`docs/schema/[domain].md`

## Exit Criteria

- [ ] 每支 API 的 API Spec 已撰寫（含錯誤映射表）
- [ ] openapi.yaml 已更新
- [ ] DB Schema 已撰寫/更新
- [ ] 既有 API/Schema 的修改已標記
- [ ] **自我審查通過（spec-auditor Pass 1+2）**
- [ ] progress.md 已更新（ApiSpec / Schema 列標為完成 + 自審 ✓）
- [ ] Human 已確認
- [ ] 已 commit
