# [Domain] Schema

## Meta
- Database: [database-name]
- 狀態：draft / approved / implemented
- 建立：YYYY-MM-DD
- 更新：YYYY-MM-DD

## ER Diagram

[文字描述或連結到 .svg / .png]

## Tables

### [table_name]

[用途說明]

| 欄位 | 型別 | Nullable | Default | 說明 |
|------|------|----------|---------|------|
| id | UUID / BIGINT | N | auto | PK |
| created_at | TIMESTAMP | N | NOW() | 建立時間 |
| updated_at | TIMESTAMP | N | NOW() | 更新時間 |

**索引：**

| 名稱 | 欄位 | 類型 | 說明 |
|------|------|------|------|
| pk_[table] | id | PRIMARY | |
| idx_[table]_[field] | [field] | INDEX | [查詢情境] |
| uq_[table]_[field] | [field] | UNIQUE | [唯一性約束] |

**關聯：**

| FK 欄位 | 參照 | 類型 | ON DELETE |
|---------|------|------|-----------|
| [fk_field] | [ref_table].id | N:1 | CASCADE / SET NULL |

### [table_name_2]

...

## Enums / 代碼表

| 名稱 | 值 | 說明 |
|------|---|------|

## Migration 紀錄

| 版本 | 日期 | 變更 | 對應 Spec |
|------|------|------|----------|
| v1 | YYYY-MM-DD | 初始建立 | spec-001 |
