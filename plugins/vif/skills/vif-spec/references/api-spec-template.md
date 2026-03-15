# [API 名稱]

## Meta
- Module: [module-name]
- Domain: [domain-name]
- Method: GET / POST / PUT / PATCH / DELETE
- Path: `/api/v1/[resource]`
- 狀態：draft / approved / implemented
- 建立：YYYY-MM-DD
- 更新：YYYY-MM-DD

## 說明

[此 API 的目的和使用情境]

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

| 參數 | 型別 | 必填 | 預設 | 說明 |
|------|------|------|------|------|

### Request Body

```json
{
  "field": "value"
}
```

| 欄位 | 型別 | 必填 | 驗證規則 | 說明 |
|------|------|------|---------|------|

## Response

### 成功回應 (200)

```json
{
  "code": "0000",
  "message": "success",
  "data": {}
}
```

| 欄位 | 型別 | 說明 |
|------|------|------|

### 錯誤回應

| HTTP Status | Code | Message | 觸發條件 |
|-------------|------|---------|---------|
| 400 | | | |
| 401 | | | |
| 404 | | | |

## 業務規則

- [規則 1]
- [規則 2]

## 邊界條件

- [邊界案例 1]
- [邊界案例 2]

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
