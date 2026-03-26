---
name: vif-arch
description: >-
  Architecture decisions and ADR records. Trigger on: "architecture", "架構",
  "tech stack", "技術棧", "ADR", "架構決策", "技術選型", "project setup",
  "專案架構", "architecture decision".
metadata:
  version: 2.9.0
---

# Architecture — 架構決策

專案架構設定與決策記錄。可在專案啟動時使用，也可在開發過程中記錄重大架構決策。

## Stance

**架構決策是給六個月後的自己看的。**

- 記錄「為什麼選 X 而不選 Y」比記錄「我們選了 X」更重要
- 決策記錄不是文件負擔，是防止重複討論的投資
- 推薦先行 — 「做 B。原因是：」而非「有 A/B/C 三個選項」

## Pre-check

1. 檢查 `docs/` 是否已有 PRD（`prd-*.md`）
2. **有 PRD** → 讀取作為架構決策的需求依據，技術選型應對齊 PRD 定義的問題、範圍與約束
3. **沒有 PRD** → 直接與 Human 討論（PRD 可能在架構之後才寫）

> 不論 PRD 是否存在，架構決策都需要與 Human 確認。PRD 是輸入參考，不是自動決策依據。

## 使用情境

### A. 專案啟動（首次）

與 Human 討論並記錄：

1. **技術棧** — 語言、框架、資料庫、CI/CD
2. **專案架構** — Monolith / Microservice / Modular Monolith
3. **共用規範** — API style、error handling、auth 策略、命名慣例
4. **測試策略** — 預設測試層級（Unit / Integration / E2E）
5. **目錄結構** — src/ 的組織方式

如有 PRD，以上討論應參考 PRD 中的需求範圍、技術約束與成功指標，確保技術選型能支撐產品目標。

產出：
- `docs/architecture/adr-001-[名稱].md`（使用 `references/adr-template.md`）
- 更新 `.claude/CLAUDE.md`（技術棧、專案指令）
- 更新 `guideline/`（如需要）

### B. 架構決策（持續）

開發過程中遇到需要架構決策的時機：

- 引入新技術 / 套件
- 改變模組結構
- 效能瓶頸需要架構調整
- 安全性策略變更

流程：
1. 描述問題與背景
2. 列出 2-3 個方案（含比較表）
3. **推薦一個方案並說明理由**
4. 與 Human 確認
5. 記錄為 ADR → `docs/architecture/adr-NNN-[名稱].md`
6. **commit**

## ADR 編號規則

- `adr-001` 起跳，依序遞增
- 檔名：`adr-NNN-kebab-case-名稱.md`
- 存放位置：`docs/architecture/`

## Exit Criteria

- [ ] 決策已記錄為 ADR
- [ ] 相關的 CLAUDE.md / guideline 已更新（如需要）
- [ ] 已 commit
