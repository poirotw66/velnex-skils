---
name: vif-bdd
description: >-
  BDD Discovery — Three perspectives exploration, Example Mapping, and Gherkin
  feature writing. Trigger on: "BDD", "行為驅動", "feature file", ".feature",
  "Example Mapping", "三視角", "discovery", "Gherkin", "寫 feature",
  "行為規格".
metadata:
  version: 2.4.0
---

# BDD Discovery — 行為驅動探索

從需求出發，透過三視角探索與 Example Mapping 建立行為共識，產出 .feature 行為規格。

> 此 skill 是可選的。在團隊模式下，PD/PM 可選擇使用 BDD 來釐清行為，也可以直接用 PRD + Figma 進入 `/vif-spec`。

## Stance

**用範例說話，不用抽象描述。**

- 抽象描述讓人點頭卻沒共識，具體範例才能暴露分歧
- 「這很明顯」往往是尚未被檢驗的假設 — 用具體範例驗證它
- 不要急著結構化 — 讓模式從具體範例中自然浮現

## Workflow

```
Step 0          Step 1           Step 2
三視角      →   Example      →   Write
探索             Mapping          .feature
```

### Step 0: 三視角探索

在 Example Mapping 之前，先從三個角度檢視功能，確保不遺漏：

| 視角 | 核心問題 |
|------|----------|
| **業務** | 解決什麼問題？價值是什麼？業務規則？ |
| **開發** | 怎麼實作？技術限制？邊界案例？ |
| **測試** | 什麼會出錯？遺漏了什麼？怎麼驗證？ |

流程：業務方描述需求 → 三視角輪流提問、挑戰假設 → 用具體範例回答 → 記錄範例和疑問

> **質疑每一個假設** — 包括 Human 的，也包括你自己的。

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

> **耐心** — 不急著結束 mapping 進入撰寫。少一張紅色卡片，就少一個開發時才發現的意外。

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

## Exit Criteria

- [ ] Example Mapping 完成（🔴 = 0）
- [ ] .feature 檔案已建立
- [ ] Human 已確認 .feature 內容
- [ ] 已 commit（`docs: add feature [domain]/[name]`）
