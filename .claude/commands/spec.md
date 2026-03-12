# Phase 1: Spec — 規格與設計

執行 Phase 1 的完整流程：Example Mapping → .feature → spec.md → Review。

使用 `spec-writer` agent 的指引來執行每個步驟。

## 前置檢查

1. 確認是否有對應的 PRD（中大需求應有 PRD）
2. 讀取 `docs/specs/specs-overview.md` 確認 spec 編號
3. 讀取 `docs/feature-map.md` 了解功能全貌

## 流程

### Step 1: Example Mapping

與使用者一起探索需求，使用四色卡片法：

- 🟡 **Story**：要實作的功能是什麼？
- 🔵 **Rule**：有哪些業務規則？（逐一列出）
- 🟢 **Example**：每條 Rule 舉出正面和反面的具體情境
- 🔴 **Question**：有什麼不確定的？

**不要跳過這個步驟。** 即使需求看起來簡單，至少列出 happy path + 主要 error path。

持續探索直到 🔴 Question = 0。

### Step 2: 撰寫 .feature

將 Example Mapping 成果轉化為 `.feature` 檔案：

- 確定業務領域分類（如 auth/, payment/, user/）
- 寫成 Gherkin 格式（Feature → Rule → Example → Given/When/Then）
- 存放在 `docs/features/[domain]/[name].feature`
- 每條 Rule 至少一個正面 + 一個反面 Example

### Step 3: 撰寫 spec.md

建立技術設計文件：

- 建立 `docs/specs/NNN-feature-name/` 目錄
- 使用 `docs/specs/templates/spec-template.md` 模板
- 聚焦 HOW（架構、資料結構、API、影響檔案）
- **撰寫實作任務清單**：
  - 每個任務 2-5 分鐘
  - 標記 `[P]` 可平行任務
  - 標明依賴關係
  - 有行為的任務標明 `feature ref`
- 建立 `progress.md`（使用 progress-template.md）

### Step 4: Review

呈現 `.feature` + `spec.md` 給使用者審查：

- 摘要：這個 spec 要做什麼、為什麼、怎麼做
- 列出所有 .feature scenario 數量
- 列出任務總數和預估總時間
- 請使用者 approve 或提出修改

## 退出條件

- [ ] 🔴 Question = 0
- [ ] .feature 覆蓋每條 Rule 的正反面
- [ ] spec.md 任務清單完整
- [ ] specs-overview.md 已更新
- [ ] 使用者已 approve

## 完成後

告知使用者：「Spec 已 approve，可以執行 `/develop` 開始開發。」
