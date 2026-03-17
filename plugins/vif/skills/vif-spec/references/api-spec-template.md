# [API 名稱]

## Meta

- Module: [module-name]
- Domain: [domain-name]
- Method: GET / POST / PUT / PATCH / DELETE
- Path: `/api/v1/[resource]`
- 狀態：draft / approved / implemented
- 建立：YYYY-MM-DD
- 更新：YYYY-MM-DD

## 版本歷程

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | YYYY-MM-DD | 初始建立 |

## 說明

[此 API 的目的和使用情境]

## 權限

| 類型 | 權限 | 說明 |
|------|------|------|
| 角色權限 | [ROLE_NAME] | [哪些角色可存取] |
| 功能權限 | [PERMISSION_CODE] | [需要的功能權限] |
| 資料範圍 | [SCOPE] | [可存取的資料範圍] |

## Request

### Headers

| Header | 必填 | 說明 |
|--------|------|------|
| Authorization | Y | Bearer token |
| Content-Type | Y | application/json |

### Path Parameters

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|

### Query Parameters

| 參數 | 型別 | 必填 | 預設 | 最大長度 | 說明 |
|------|------|------|------|---------|------|

> 如為分頁 API，加入以下標準參數：
>
> | 參數 | 型別 | 必填 | 預設 | 說明 |
> |------|------|------|------|------|
> | page | number | N | 1 | 頁數（從 1 開始） |
> | pageSize | number | N | 20 | 每頁筆數 |
> | sortBy | string | N | — | 排序欄位 |
> | sortOrder | string | N | desc | 排序方向（asc / desc） |

### Request Body

```json
{
  "field": "value"
}
```

| 欄位 | 型別 | 必填 | 最大長度 | 驗證規則 | 說明 |
|------|------|------|---------|---------|------|

## Response

### 成功回應 (200 / 201)

```json
{
  "code": "0000",
  "message": "success",
  "data": {}
}
```

| 欄位 | 型別 | 說明 |
|------|------|------|

> 如為分頁回應，加入 pagination：
>
> ```json
> {
>   "code": "0000",
>   "message": "success",
>   "data": [],
>   "pagination": { "total": 150, "page": 1, "pageSize": 20, "totalPages": 8 }
> }
> ```

## 錯誤處理

### 錯誤回應

| HTTP Status | Code | Message | 觸發條件 | 前端處理建議 |
|-------------|------|---------|---------|-------------|
| 400 | | | | |
| 401 | | | | |
| 403 | | | | |
| 404 | | | | |

### 錯誤映射表

| 操作 | 錯誤情境 | Exception / Code | 使用者看到 |
|------|---------|-----------------|-----------|

> `catch all` 永遠是壞味道。列出每個具體的錯誤情境。

## 業務邏輯

### 流程

主流程用編號步驟，每步一行。分支用縮排（最多 2 層）：

1. **權限驗證** — [驗證規則]
2. **參數驗證** — [驗證項目]
3. **資料查詢** — [查詢條件，涉及哪些 table]
4. **核心處理** — [一句話描述]
   - 條件 A → [處理方式]
   - 條件 B → [處理方式]
     - B-1 情況 → [處理方式]
     - B-2 情況 → [處理方式]
5. **資料寫入** — [寫入哪些 table，欄位對應]
6. **後續處理** — [通知、快取清除、事件觸發等]

> **格式原則：**
> - 主流程保持線性，一步一行
> - 分支縮排最多 2 層。超過 2 層 → 拆成獨立的「詳細流程」小節
> - 失敗處理不寫在這裡（寫在「錯誤處理」section）

如有複雜分支，拆成獨立小節並用流程圖說明：

### [步驟名稱] 詳細流程

```
[判斷條件]？
  ├─ N → [結果]
  └─ Y → [下一個判斷]？
           ├─ Y → [結果]
           └─ N → [下一個判斷]？
                    ├─ Y → [結果]
                    └─ N → [結果]
```

### 規則

- [規則 1]
- [規則 2]

### 邊界條件

- [邊界案例 1 — 發生時如何處理]
- [邊界案例 2 — 發生時如何處理]

## 相關 API

| API | Method + Path | 關係 |
|-----|--------------|------|

## 範例

### 正常情境

**Request:**
```bash
curl -X POST /api/v1/[resource] \
  -H "Authorization: Bearer xxx" \
  -d '{"field": "value"}'
```

**Response:**
```json
{
  "code": "0000",
  "message": "success",
  "data": {}
}
```

### 錯誤情境

**Request:**
```bash
curl -X POST /api/v1/[resource] \
  -H "Authorization: Bearer xxx" \
  -d '{"field": ""}'
```

**Response:**
```json
{
  "code": "E0001",
  "message": "參數錯誤",
  "errors": [
    { "field": "field", "message": "欄位為必填" }
  ]
}
```

## 備註

- [特殊需求或限制]
