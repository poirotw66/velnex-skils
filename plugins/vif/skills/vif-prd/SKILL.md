---
name: vif-prd
description: >-
  Phase 0 - Product Requirements Document. Trigger on: "PRD", "產品需求",
  "product requirement", "問題定義", "需求文件", "要做什麼", "why build",
  "寫 PRD", "新需求".
metadata:
  version: 3.0.0
---

# Phase 0 — PRD 產品探索

釐清「解決什麼問題」與「為什麼值得解決」，產出 PRD 文件。

## Hard Gate

**PRD 未 approved，不進入 Phase 1。**

> 每個專案都需要問題定義。Todo list、單一函式工具、config 變更 — 全部。
> 「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。

## Stance

**你是思考夥伴，不是問卷機器。**

探索階段沒有固定腳本、沒有必須的順序、沒有強制的產出。你的角色是幫助 Human 把模糊的想法變清晰。

- **好奇而非指導** — 問自然浮現的問題，不要照清單念
- **展開而非審問** — 展開多個有趣的方向，讓 Human 選擇共鳴的
- **耐心而非急躁** — 不急著下結論，讓問題的輪廓自然顯現
- **落地而非空想** — 去看實際的 codebase，不要光靠理論
- **質疑假設** — 包括 Human 的，也包括你自己的

## Workflow

### Step 1: Pre-check

- 檢查 `docs/` 是否已有相關 PRD 或 spec
- 瀏覽 codebase 了解現狀，把討論建立在現實基礎上
- 避免重複工作

### Step 2: Problem Exploration

與 Human 對話釐清。以下是四個核心面向，但**不要機械式地逐條問**——根據對話自然展開：

1. **問題是什麼？** — 一句話描述痛點
2. **影響誰？** — 使用者角色與場景
3. **為什麼現在做？** — 優先級理由
4. **成功長什麼樣？** — 可衡量的預期成果

**探索指南：**

- 一次聚焦一個面向，等 Human 回答後再延伸
- 如果 Human 的回答揭示了新的方向，跟隨它
- 用 ASCII 圖表視覺化複雜的關係 — 一個好的圖表抵得上許多段落
- 如果不清楚，深入挖掘。**不要假裝理解。**
- 探索是思考時間，不是任務時間

### Step 3: Draft PRD

使用 PRD 模板（`references/prd-template.md`），撰寫至 `docs/prd-NNN.md`：

- 問題描述與證據
- 預期成果（可衡量）
- 方案選項（2-3 個，含比較表）
- 不在範圍內
- Feature/Spec 拆解建議

### Step 4: Deliver & Approve

- 呈現 PRD 給 Human 審查
- Human 要求修改 → 修改後重新呈現
- Human approve → 更新狀態為 `approved`

### Step 5: 展開 Spec 清單

PRD approved 後，從 Section 6 的拆解建議展開 specs-overview：

1. 讀取 PRD Section 6 的 spec 清單與依賴關係
2. 將所有 spec 以 — (not-started)狀態寫入 `docs/specs/specs-overview.md`
3. 呈現 specs-overview 給 Human 確認：

```
> PRD 已 approved。以下是拆解的 Spec 清單：
>
> | # | 名稱 | 領域 | 狀態 | PRD | 依賴 | 備註 |
> |---|------|------|------|-----|------|------|
> | 001 | [名稱] | [領域] | — | prd-NNN | — | [摘要] |
> | 002 | [名稱] | [領域] | — | prd-NNN | 001 | [摘要] |
>
> 請確認：
>   1. Spec 拆分是否合理？
>   2. 依賴關係是否正確？
>   3. 命名與領域分類是否恰當？
```

4. Human 確認（可調整後再確認）

> 如果 `specs-overview.md` 尚未建立（未執行 `/vif-flow` init），在此步驟一併建立。

### Step 6: Commit & Next

- **commit**（`docs: add prd-NNN [名稱]`）
- 進入 Phase 1（`/vif-spec`）

## Skip Conditions

以下情境可跳過 Phase 0：

- Bug fix（< 1 人天）
- 技術債清理
- Config 變更
- Human 已提供完整需求文件

## Exit Criteria

- [ ] PRD 文件已建立（`docs/prd-NNN.md`）
- [ ] 問題定義明確
- [ ] Human 已 approve PRD
- [ ] specs-overview.md 已展開（Section 6 → — (not-started)條目）
- [ ] Human 已確認 specs-overview
- [ ] 已 commit
