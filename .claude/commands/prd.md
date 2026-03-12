# Phase 0: PRD — 產品探索

引導使用者建立 PRD（Product Requirements Document）。

## 前置檢查

1. 讀取 `docs/specs/specs-overview.md` 確認現有 spec 清單
2. 確認新需求沒有與現有 spec 重複

## 流程

### 1. 釐清問題

向使用者提問：

- **誰** 遇到這個問題？（使用者角色）
- **什麼** 問題？（一句話描述）
- **為什麼** 知道這是問題？（數據、回饋、觀察）
- 成功的話 **長什麼樣**？（可衡量的指標）

### 2. 草擬 PRD

使用 `docs/specs/templates/prd-template.md` 模板，草擬 PRD：

- 至少提供 2 個方案做比較
- 明確列出「不在範圍內」
- 拆解為 feature / spec 清單

### 3. 交付

- 將 PRD 存為 `docs/prd-NNN.md`（NNN 為遞增編號）
- 請使用者 review 並 approve

## 退出條件

- PRD 已寫入檔案
- 使用者已 approve
- 已拆解為 feature / spec 清單

## 可跳過條件

以下情境可跳過 PRD，直接進入 `/spec`：
- Bug fix
- < 1 人天的小需求
- 技術債清理
- Config 變更
