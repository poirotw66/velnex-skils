# 現有專案基礎盤點

## Velarch

**專案性質**：local AI 系統的結構控制層（CLI + Web Dashboard）

**技術棧**：Bun + TypeScript + React + Ink

**已有的 SDD 實踐**：

| 項目 | 內容 | 成熟度 |
|------|------|--------|
| Spec 模板 | 10 個必填章節（背景、設計原則、功能範圍、資料結構、影響檔案、AC 等） | 高 |
| AC 分類 | AC-auto（自動化驗證，須轉為 test case）+ AC-manual（人工驗證） | 高 |
| 影響檔案清單 | 每個 spec 列出需修改的檔案 + 變更程度（小/中/大） | 高 |
| Feature Map | 40+ 功能的狀態追蹤 | 高 |
| process.md | 執行紀錄（決策日誌、問題排查），完成後凍結 | 高 |
| Spec 完成 Checklist | 7 項驗收（AC 通過、測試通過、typecheck、文件更新） | 高 |
| Spec 狀態流轉 | draft → approved → in-progress → done | 高 |

**已完成**：14 個 specs（spec-001 ~ spec-014），46+ test passes

**缺少**：PRD 階段、BDD 結構化場景、嚴格 TDD、Agent 分工

## Albedo

**專案性質**：個人自動化工作流程平台（n8n + PostgreSQL + Web Dashboard）

**技術棧**：n8n + PostgreSQL + Bun + React

**已有的 SDD 實踐**：

| 項目 | 內容 | 成熟度 |
|------|------|--------|
| 多種 Spec 模板 | Workflow 型 + Infra 型，各有不同必填章節 | 高 |
| process.md | 詳細的決策日誌 + 問題排查紀錄 + 運維知識累積 | 非常高 |
| Checklist 測試 | 每個 spec 有明確的功能驗收 checklist | 中 |
| 版本管理 | Git Tag 格式：spec-NNN/vX.Y.Z | 高 |

**已完成**：6 個 specs（spec-001 ~ spec-006），8 家銀行帳單分析全通過

**獨特貢獻**：

- Workflow spec 模板（觸發方式、節點流程、外部服務整合）
- process.md 的深度決策紀錄（15 個邊界情況、上線後維運事件）
- n8n Code Node 限制清單（Task Runner VM 陷阱）

**缺少**：PRD 階段、Given-When-Then 格式、Agent 分工

## Proji WhereSpent

**專案性質**：以「專案」為主軸的支出收入追蹤 APP

**技術棧**：Flutter + SQLite + Clean Architecture + Riverpod

**已有的 SDD 實踐**：

| 項目 | 內容 | 成熟度 |
|------|------|--------|
| PRD | 563 行的完整產品規格書（資料模型、金額規則、頁面流程、NFR） | 非常高 |
| Specs Overview | 13 個 specs 的依賴關係圖 + 建議開發順序 + 可平行開發標記 | 高 |
| Spec 模板 | 以使用者為中心（User Story + Given-When-Then）+ MoSCoW 優先級 | 高 |
| Progress 模板 | 14 個區段（進度統計、任務清單、技術決策、障礙、經驗總結） | 高 |
| Testing 模板 | 覆蓋率表 + AC 對應 + 品質指標 | 高 |
| 4 個 Agent | spec-writer、implementer、test-writer、reviewer | 高 |
| 測試規範 | 三層金字塔（Unit + Widget + E2E）+ 覆蓋率目標 | 高 |
| 架構規範 | Clean Architecture 三層 + 依賴規則 + 目錄結構 | 高 |
| DB 規範 | SQLite schema 設計 + 命名規範 + 索引策略 + Migration | 高 |
| Schema 參考 | 單一權威來源（schema-reference.md） | 高 |

**已完成**：12 個 specs done + 1 個進行中，4 套主題系統

**獨特貢獻**：

- 4 Agent 分工模型（spec-writer → reviewer → implementer → test-writer → reviewer）
- 測試金字塔 + 覆蓋率目標表
- Spec 模板以業務語言為主（WHAT + WHY，不含 HOW）
- Reviewer agent 有完整的審查清單（Spec 審查 + Code 審查 + 嚴重性分級）

**缺少**：BDD Example Mapping、嚴格 TDD 先行（測試目前在實作後）

## 三專案最佳實踐對照

| 最佳實踐 | Velarch | Albedo | Proji | 統一流程 |
|---------|---------|--------|-------|---------|
| PRD | --- | --- | v | 採用 Proji |
| .feature 行為規格（獨立檔案） | --- | --- | --- | **新增**（Gherkin 標準格式） |
| Spec 模板（技術設計導向） | v（技術導向） | v（workflow 導向） | v（業務導向） | 合併三者，聚焦 HOW |
| AC-auto 指向 .feature | --- | --- | --- | **新增** |
| AC-manual checklist | v | --- | --- | 採用 Velarch |
| 任務拆解（2-5 min + [P]） | --- | --- | --- | **新增**（參考 Spec Kit/Superpowers） |
| 影響檔案清單 + 變更程度 | v | --- | --- | 採用 Velarch |
| Feature Map | v | --- | v（specs-overview） | 保留兩種 |
| progress.md（進度+決策合併） | v | v（詳細） | --- | 合併 Velarch/Albedo |
| 4+2 Agent 分工 | --- | --- | v（4 agent） | 擴展 Proji（+2 輔助） |
| Agent 編排協議 | --- | --- | --- | **新增**（參考 Superpowers） |
| 測試金字塔 + 覆蓋率 | --- | --- | v | 採用 Proji |
| 設計原則 + 理由 | v | --- | --- | 採用 Velarch |
| Schema 單一權威來源 | --- | --- | v | 採用 Proji |
| Verification Loop | --- | --- | --- | **新增**（參考 ECC） |
| Reviewer 審查清單 | --- | --- | v | 採用 Proji |
