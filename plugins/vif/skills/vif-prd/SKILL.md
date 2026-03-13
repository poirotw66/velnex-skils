---
name: vif-prd
description: >-
  Phase 0 - Product Requirements Document. Trigger on: "PRD", "產品需求",
  "product requirement", "問題定義", "需求文件", "要做什麼", "why build",
  "寫 PRD", "新需求".
metadata:
  version: 1.0.0
---

# Phase 0 — PRD 產品探索

釐清「解決什麼問題」與「為什麼值得解決」，產出 PRD 文件。

## Hard Gate

**PRD 未 approved，不進入 Phase 1。** 即使需求看起來很簡單，也要先確認問題定義。

## Workflow

### Step 1: Pre-check

- 檢查 `docs/` 是否已有相關 PRD 或 spec
- 避免重複工作

### Step 2: Problem Exploration

與 Human 對話釐清：

1. **問題是什麼？** — 一句話描述痛點
2. **影響誰？** — 使用者角色與場景
3. **為什麼現在做？** — 優先級理由
4. **成功長什麼樣？** — 可衡量的預期成果

一次問一個問題，等 Human 回答後再問下一個。不要一次丟出所有問題。

### Step 3: Draft PRD

使用 PRD 模板（`references/prd-template.md`），撰寫至 `docs/prd-NNN.md`：

- 問題描述與證據
- 預期成果（可衡量）
- 方案選項（2-3 個，含比較表）
- 不在範圍內
- Feature/Spec 拆解建議

### Step 4: Deliver

- 呈現 PRD 給 Human 審查
- Human approve → 進入 Phase 1（`/spec`）
- Human reject → 修改後重新呈現

## Skip Conditions

以下情境可跳過 Phase 0：

- Bug fix（< 1 人天）
- 技術債清理
- Config 變更
- Human 已提供完整需求文件

## Exit Criteria

- [ ] PRD 文件已建立（`docs/prd-NNN.md`）
- [ ] 問題定義明確
- [ ] Human 已 approve
