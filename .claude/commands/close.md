# Phase 5: Close — 完成

執行 spec 完成的 Checklist，確保所有文件和版控都到位。

## 前置檢查

1. 確認 Phase 4 已完成：使用者已 approve review
2. 讀取 spec.md 和 progress.md

## Checklist

逐項檢查並標記：

### 驗收
- [ ] `.feature` 的每個 scenario 都有對應測試且通過
- [ ] AC-manual 全數驗證（請使用者確認）

### 品質
- [ ] Verification Report 全部 PASS
- [ ] 覆蓋率達標（整體 ≥ 80%）

### 文件更新
- [ ] `progress.md` 已更新至最終狀態
- [ ] `docs/specs/specs-overview.md` 已同步（spec 狀態改為 done）
- [ ] `docs/feature-map.md` 已同步（如適用）
- [ ] 若有架構變更 → architecture 文件已更新
- [ ] 若有 Schema 變更 → schema reference 已更新

### 版控
- [ ] 所有變更已 commit
- [ ] Git tag 已標記（如適用，格式：`spec-NNN/vX.Y.Z`）

## 執行

1. 自動檢查可自動驗證的項目（測試、coverage、lint）
2. 列出需要使用者手動確認的項目（AC-manual）
3. 更新 spec.md 狀態為 `done`
4. 更新 specs-overview.md
5. 請使用者確認是否需要 git tag

## 退出條件

- [ ] Checklist 全部完成
- [ ] spec.md 狀態 = `done`

## 完成後

呈現完成摘要：
- Spec 名稱和編號
- 涉及的 .feature 數量和 scenario 數量
- 測試數量和覆蓋率
- 變更的檔案數量
