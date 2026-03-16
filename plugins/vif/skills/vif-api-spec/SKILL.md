---
name: vif-api-spec
description: >-
  API specification, OpenAPI, and DB schema writing. Trigger on: "API spec",
  "ApiSpec", "API 規格", "openapi", "swagger", "寫 API spec", "dbschema",
  "DB schema", "資料庫設計", "寫 API", "後端規格".
metadata:
  version: 2.1.2
---

# API Spec — API 規格 + OpenAPI + DB Schema

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

## Workflow

### Step 1: 讀取輸入與影響分析

1. 讀取 PRD / Spec 的 API 和 DB 清單
2. 讀取 Figma 畫面（確認需要什麼資料）
3. 掃描現有 `docs/api-specs/[module]/`，判斷新增 vs 修改
4. 掃描現有 `docs/schema/`，判斷新增 vs 修改
5. 列出影響清單：

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

### Step 5: 確認與 Commit

- 呈現給 Human 確認
- 回填 Spec Section 4 的 ApiSpec/Schema 路徑（如有 Spec）
- **commit**（`docs: add/update api-spec [module]/[domain]`）

**存放位置：**
- API Spec：`docs/api-specs/[module]/[domain]/[name].md`
- OpenAPI：`docs/api-specs/[module]/openapi.yaml`
- Schema：`docs/schema/[domain].md`

## Exit Criteria

- [ ] 每支 API 的 API Spec 已撰寫（含錯誤映射表）
- [ ] openapi.yaml 已更新
- [ ] DB Schema 已撰寫/更新
- [ ] 既有 API/Schema 的修改已標記
- [ ] Spec 的 ApiSpec/Schema 欄位已回填（如有 Spec）
- [ ] Human 已確認
- [ ] 已 commit
