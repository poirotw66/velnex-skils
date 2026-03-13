---
name: vif-flow
description: >-
  AI-driven development flow orchestration. Trigger on: "dev flow", "開發流程",
  "phase", "階段", "新功能", "new feature", "ai-driven", "AI 開發",
  "哪個階段", "下一步", "flow overview", "流程總覽".
metadata:
  version: 1.0.0
---

# AI-Driven Development Flow

AI 為主力開發、Human 為審查角色的六階段開發流程。

```
Phase 0    Phase 1      Phase 2      Phase 3     Phase 4       Phase 5
 PRD    →   Spec     →  Develop   →  Verify   →  Review    →   Close
產品探索   規格與設計   逐任務 TDD   自動驗證    程式碼審查     完成
```

## Phase Routing

| Phase | Skill | 說明 |
|-------|-------|------|
| 0 | `/prd` | 產品探索、PRD 撰寫 |
| 1 | `/spec` | Example Mapping → .feature → spec.md |
| 2 | `/develop` | 逐任務 TDD（RED → GREEN → REFACTOR） |
| 3 | `/verify` | 六階段自動化驗證 |
| 4 | `/code-review` | 兩階段程式碼審查 |
| 5 | `/close` | 完成檢查清單 |

## Core Principles

1. **行為先於設計** — Discovery → .feature → spec.md（先探索再設計）
2. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
3. **逐任務開發** — 每任務 2-5 分鐘粒度，RED → GREEN → REFACTOR
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **最多重試 3 次** — 超過就 escalate 給 Human

## Human Intervention Points

只有三個點需要 Human 介入，其餘 AI 自主：

| Gate | Human 行為 | 說明 |
|------|-----------|------|
| Phase 0 → 1 | Approve PRD | 確認問題定義與方向 |
| Phase 1 → 2 | Approve Spec | 確認 .feature + spec.md |
| Phase 4 → 5 | Approve Code | 最終審查 |

## Three-Layer Documents

| 層 | 文件 | 問題 |
|----|------|------|
| 需求 | `docs/prd-NNN.md` | WHY + WHAT |
| 行為 | `docs/features/**/*.feature` | HOW it behaves |
| 實作 | `docs/specs/NNN/spec.md` | HOW to build |

features/ 按業務領域組織，specs/ 按實作單元組織，多對多關係。

## Skip Decision

| 情境 | 可跳過 | 不可跳過 |
|------|--------|---------|
| Bug fix (< 1 人天) | Phase 0 | Phase 2 TDD, 3 Verify |
| 技術債 | Phase 0 | Phase 2 TDD, 3 Verify |
| Config 變更 | Phase 0, 1 | Phase 3 Verify |
| 新功能 | — | 全部 |

## Escalation Protocol

1. **失敗 1-2 次**：AI 嘗試替代方案
2. **失敗 3 次**：產出 Escalation Report，交由 Human

```
## Escalation Report
- 問題描述
- 已嘗試方法 (1-3)
- 各次失敗原因
- 建議 Human 介入方式
```

## Model Selection

| 任務 | 建議模型 |
|------|---------|
| 規劃、設計、審查 | Opus |
| 實作、測試 | Sonnet |
| 文件更新 | Haiku |

詳細 Phase Transition Gates 見 `references/phase-gates.md`。
新專案設定見 `references/project-setup.md`。
