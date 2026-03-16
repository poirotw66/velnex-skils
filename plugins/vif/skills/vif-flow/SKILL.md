---
name: vif-flow
description: >-
  AI-driven development flow orchestration. Trigger on: "dev flow", "開發流程",
  "phase", "階段", "新功能", "new feature", "ai-driven", "AI 開發",
  "哪個階段", "下一步", "flow overview", "流程總覽".
metadata:
  version: 2.1.3
---

# vif — AI-Driven Development Flow

## Philosophy

> **規格不服務程式碼，程式碼服務規格。** — Spec Kit
> **「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。** — Superpowers
> **探索是思考時間，不是任務時間。** — OpenSpec
> **沒有新鮮的驗證證據，就不能做出任何完成聲明。** — Superpowers

## 兩種模式

### 模式一：完全自動化（Solo / 小團隊）

AI 為主力開發，Human 為審查角色。一人驅動完整流程。

```
/vif-arch + /vif-uiux → /vif-prd → /vif-bdd → /vif-spec → /vif-prototype(可選) → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

### 模式二：輔助自動化（企業團隊）

各角色各自驅動 AI 完成自己負責的工作。

```
Architect:  /vif-arch（專案啟動 + 決策記錄）
PD/PM:      /vif-prd → /vif-bdd（可選）
Designer:   /vif-uiux（設計基礎）→ Figma（手動）或 /vif-prototype（AI 產出原型）
SA/SD:      /vif-spec（PRD + Figma/Prototype → 規劃範圍）
Frontend:   /vif-ui-spec（Figma/Prototype + Spec → 頁面規格）
Backend:    /vif-api-spec（PRD + Figma + Spec → API + openapi + dbschema）
PGs:        /vif-develop → /vif-verify → /vif-review
All:        /vif-close
```

## Skill Routing

| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | `/vif-arch` | 架構決策 + ADR 記錄 |
| 設計基礎 | `/vif-uiux` | UI/UX 設計基礎（色系、字型、元件規範） |
| 需求 | `/vif-prd` | PRD 撰寫 |
| 行為 | `/vif-bdd` | BDD Discovery → .feature（可選） |
| 規劃 | `/vif-spec` | 影響分析 + 技術規劃 |
| 原型 | `/vif-prototype` | HTML 原型（可選，無 Figma 時使用） |
| 設計 | `/vif-ui-spec` | UI 頁面規格 |
| 設計 | `/vif-api-spec` | API 規格 + openapi.yaml + dbschema |
| 開發 | `/vif-develop` | TDD 開發（含測試策略選擇） |
| 驗證 | `/vif-verify` | 自動化驗證（Core + Optional） |
| 審查 | `/vif-review` | 程式碼審查（合規 + 品質） |
| 收尾 | `/vif-close` | 文件同步 + 完成檢查清單 |

## Core Principles

1. **行為先於設計** — 先理解「系統該做什麼」再設計「怎麼做到」
2. **影響分析是核心** — 判斷新增 vs 修改既有，修改比新增更危險
3. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **驗證即誠實** — 每一個聲明都要有新鮮的證據支撐
6. **最多重試 3 次** — 超過就 escalate 給 Human

## Human Intervention Points

| Gate | Human 行為 | 說明 |
|------|-----------|------|
| PRD → Spec | Approve PRD | 確認問題定義與方向 |
| Spec → Develop | Approve Spec | 確認涉及範圍 + 設計文件 |
| Review → Close | Approve Code | 最終審查 |

## Documents

### 三層文件

| 層 | 文件 | 問題 |
|----|------|------|
| 需求 | `docs/prd-NNN.md` | WHY + WHAT |
| 行為 | `docs/features/**/*.feature` | HOW it behaves（可選） |
| 規劃 | `docs/specs/NNN/spec.md` | WHAT to build |

### 累積型設計文件

| 文件 | 說明 |
|------|------|
| `docs/api-specs/[module]/` | API 設計 + openapi.yaml |
| `docs/ui-specs/[module]/` | UI 頁面/元件設計 |
| `docs/schema/` | DB Schema |
| `docs/architecture/` | ADR 架構決策記錄 |

### 追蹤文件

| 文件 | 說明 |
|------|------|
| `docs/specs/specs-overview.md` | Spec 索引 |
| `docs/feature-map.md` | 功能追蹤 |

## Commit Points

| 時機 | 內容 | Message 範例 |
|------|------|-------------|
| PRD approved | PRD 文件 | `docs: add prd-001 user-login` |
| BDD 完成 | .feature 文件 | `docs: add feature iam/user-login` |
| Spec approved | spec.md + progress.md | `docs: add spec-001 user-login` |
| 設計文件完成 | api-spec / ui-spec / schema | `docs: add api-spec iam/auth/login` |
| 開發 per-scenario | test + implementation | `feat: implement login API (spec-001)` |
| Review 修復 | review 修正 | `fix: address review feedback (spec-001)` |
| 收尾 | 追蹤文件更新 | `docs: close spec-001, update feature-map` |

## Skip Decision

| 情境 | 可跳過 | 不可跳過 |
|------|--------|---------|
| Bug fix (< 1 人天) | PRD, BDD | Develop(TDD), Verify |
| 技術債 | PRD, BDD | Develop(TDD), Verify |
| Config 變更 | PRD, BDD, Spec | Verify |
| 新功能 | BDD（可選） | 其餘全部 |

## Escalation Protocol

1. **失敗 1-2 次**：AI 嘗試替代方案
2. **失敗 3 次**：產出 Escalation Report，交由 Human

## Model Selection

| 任務 | 建議模型 |
|------|---------|
| 規劃、設計、審查 | Opus |
| 實作、測試 | Sonnet |
| 文件更新 | Haiku |

詳細 Phase Transition Gates 見 `references/phase-gates.md`。
新專案設定見 `references/project-setup.md`。
