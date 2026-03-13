---
name: vif-spec
description: >-
  Phase 1 - Specification and design. Covers Example Mapping, Gherkin feature
  writing, and technical spec creation. Trigger on: "spec", "規格", "設計",
  "寫規格", "spec design", "技術設計", "行為規格", "spec review",
  "Example Mapping", "寫 feature".
metadata:
  version: 1.0.0
---

# Phase 1 — Spec 規格與設計

從需求出發，透過三視角探索與 BDD Discovery 建立共識，產出 .feature 行為規格與 spec.md 技術設計。

## Hard Gate

**Spec 未 approved，不進入 Phase 2 開發。** 所有專案都需要 spec，不論看起來多簡單。
簡單專案往往是浪費最多的地方。

## Workflow

```
Step 0          Step 1           Step 2          Step 3          Step 4
三視角      →   Example      →   Write       →   Write       →   Review
探索             Mapping          .feature         spec.md         (Auto + Human)
```

### Step 0: 三視角探索

在 Example Mapping 之前，先從三個角度檢視功能，確保不遺漏：

| 視角 | 核心問題 |
|------|----------|
| **業務** | 解決什麼問題？價值是什麼？業務規則？ |
| **開發** | 怎麼實作？技術限制？邊界案例？ |
| **測試** | 什麼會出錯？遺漏了什麼？怎麼驗證？ |

流程：業務方描述需求 → 三視角輪流提問、挑戰假設 → 用具體範例回答 → 記錄範例和疑問

三視角探索的產出直接輸入 Example Mapping。

### Step 1: Example Mapping

使用四色卡片法將探索結果結構化：

| 顏色 | 代表 | 說明 |
|------|------|------|
| 🟡 黃色 | Story | 要實作的功能 |
| 🔵 藍色 | Rule | 業務規則 / 驗收條件 |
| 🟢 綠色 | Example | 具體情境 → 成為 Scenario |
| 🔴 紅色 | Question | 未解決的疑問 |

**操作步驟：**

1. 頂部放一張 🟡 Story 卡片
2. 列出已知的 🔵 Rule
3. 每條 Rule 下列出 🟢 Example（正面 + 反面）
4. 不確定的用 🔴 標記
5. 與 Human 逐一解決 🔴 Question

**完成判定：**

- 🔴 紅色卡片為零或已有明確處理方式
- 每條 Rule 至少一個正面和一個反面 Example
- 與 Human 確認 Example 充分

### Step 2: Write .feature

將 Example Mapping 結果轉化為 Gherkin 格式：

```gherkin
Feature: [功能名稱]
  [一句話描述功能目的]

  Rule: [規則描述]（對應 🔵 卡片）
    Example: [正面範例]（對應 🟢 卡片）
      Given [前置條件]
      When [動作]
      Then [預期結果]

    Example: [反面範例]
      Given [前置條件]
      When [動作]
      Then [預期結果]
```

**撰寫原則：**

- **一個 Scenario 一個行為** — 不要在一個 scenario 塞多個邏輯
- **使用業務語言** — 不用技術術語
- **聲明式而非命令式** — 描述「什麼」而非「怎麼做」
- **具體範例值** — `"user@example.com"` 而非 `"a valid email"`
- **場景獨立** — 不依賴執行順序

**存放位置：** `docs/features/[domain]/[name].feature`

### Step 3: Write spec.md

使用 spec 模板（`references/spec-template.md`），撰寫技術設計。

spec.md 回答 **HOW to build**（技術上怎麼做到），不是需求：

- 架構設計（模組劃分、依賴關係）
- 資料結構（Interface / Schema）
- API / 介面設計
- 影響檔案分析
- **任務拆解**（核心）

**任務拆解規範：**

- 粒度 2-5 分鐘（bite-sized）
- `[P]` 標記可平行執行的任務
- 每個行為相關任務標註 `feature ref:` 連結對應 .feature scenario
- 標註預估時間和影響檔案
- 明確標示依賴關係
- 任務描述要讓零上下文的 agent 也能理解執行

同時建立 `progress.md`（`references/progress-template.md`）。

**存放位置：** `docs/specs/NNN-name/spec.md`

### Step 4: Review

**Stage A — 自動審查（Spec Reviewer subagent）：**

派遣 `spec-reviewer` agent：

1. 審查 .feature 完整性
2. 審查 spec.md 技術可行性
3. 產出審查報告
4. 如有問題，修改後重新審查
5. 最多 5 次自動迭代

**Stage B — Human 審查：**

自動審查通過後，呈現給 Human：
- .feature 檔案（行為規格）
- spec.md（技術設計 + 任務清單）

Human approve → 進入 Phase 2（`/develop`）

## Exit Criteria

- [ ] Example Mapping 完成（🔴 = 0）
- [ ] .feature 檔案已建立
- [ ] spec.md 已建立（含任務拆解）
- [ ] progress.md 已建立
- [ ] specs-overview.md 已更新
- [ ] 自動審查通過
- [ ] Human 已 approve
