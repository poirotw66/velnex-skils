---
name: vif-flow
description: >-
  AI-driven development flow orchestration. Trigger on: "dev flow", "開發流程",
  "phase", "階段", "新功能", "new feature", "ai-driven", "AI 開發",
  "哪個階段", "下一步", "flow overview", "流程總覽", "init", "初始化",
  "setup", "專案設定", "對齊結構", "align structure".
metadata:
  version: 2.7.0
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
/vif-arch + /vif-uiux → /vif-prd → /vif-prototype(可選) → /vif-bdd → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

> `/vif-prototype` 可在 PRD 後或 Spec 後使用：
> - PRD 後：探索視覺概念，幫助釐清需求再進入 Spec
> - Spec 後：確認規格的畫面呈現，再進入 api-spec / ui-spec

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

## Workspace Mode

vif 支援兩種 workspace 模式。沒有設定時預設為 monorepo。

### Monorepo（預設）

`docs/` 和 `src/` 在同一個 repo，所有路徑從 repo 根目錄解析。不需要額外設定。

### Multi-Repo

多個 repo 組成一個 workspace，透過 CLAUDE.md 設定互相指向。

**每個 repo 的 `.claude/CLAUDE.md` 都要有 workspace 設定：**

```markdown
## vif Workspace

| 角色 | 路徑 | 包含 |
|------|------|------|
| docs | ../project-docs | docs/, guideline/ |
| frontend | . | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: frontend
```

> 路徑使用相對路徑（相對於當前 repo 根目錄）。每個 repo 的表格內容相同，只有路徑因 cwd 不同而不同。

### 路徑解析規則

所有 skill 中的 `docs/` 路徑為**語義路徑**，實際位置依 workspace 模式解析：

| 語義路徑 | Monorepo | Multi-Repo |
|---------|----------|------------|
| `docs/specs/` | `./docs/specs/` | `{docs-repo}/docs/specs/` |
| `docs/api-specs/` | `./docs/api-specs/` | `{docs-repo}/docs/api-specs/` |
| `guideline/` | `./guideline/` | `{docs-repo}/guideline/` |
| `src/` | `./src/` | 當前 code repo 的 `src/` |

### 操作分界

Multi-repo 下，每個操作明確歸屬到一個 repo：

| 操作 | 在哪個 repo |
|------|-----------|
| 讀/寫 PRD、spec、api-spec、ui-spec、schema、.feature | docs repo |
| 讀/寫 guideline、architecture (ADR) | docs repo |
| 讀/寫 progress.md、specs-overview、feature-map | docs repo |
| 讀/寫 test、src | code repo |
| 執行 build、test、lint、type check | code repo |
| git diff、git commit | **各自的 repo，不跨 repo** |

### 多個 Code Repo 的處理

如果 workspace 有多個 code repo（frontend + backend）：

- **vif-develop**：根據 task 的 `spec ref` 判斷目標 repo（api-spec → backend，ui-spec → frontend）
- **vif-verify**：每個 code repo 各跑一次完整 pipeline
- **vif-review**：每個 code repo 各做一次 review

### Commit 規則

Multi-repo 下 commit 無法跨 repo 原子化，需各自 commit：

```
> 以下 repo 有變更需要 commit：
>   - docs repo: spec.md + api-spec（docs: add spec-001 user-login）
>   - frontend repo: UI 實作（feat: implement login page (spec-001)）
>   - backend repo: API 實作（feat: implement login API (spec-001)）
>
> 依序 commit？
```

### Branch 建議

所有相關 repo 使用相同 branch name 以便追蹤：

```
feat/spec-NNN-[name]
```

開始新 spec 時提示使用者在所有 repo 建立對應 branch。

### Agent Dispatch

Multi-repo 下 dispatch agent 時，需在 prompt 中注入 workspace 路徑：

```
docs repo 路徑: /absolute/path/to/project-docs
code repo 路徑: /absolute/path/to/project-frontend
```

讓 agent 知道去哪裡讀設計文件、去哪裡讀/寫程式碼。

## Project Init

安裝 vif plugin 後的第一步：分析專案現況並對齊 VIF 結構。

### 判斷專案類型

```
> 偵測到本專案尚未設定 vif。
>   A. 全新專案（從零建立 VIF 結構）
>   B. 既有專案（分析現有結構，對齊 VIF 規範）
```

### A. 全新專案

按照 `references/project-setup.md` 建立完整結構。

### B. 既有專案

1. **掃描現有結構** — 讀取專案目錄，對照 VIF 預期結構
2. **產出差異報告** — 列出需要的調整（見下方格式）
3. **Human 確認** — 讓使用者決定哪些要調整、哪些保留
4. **執行調整** — 建立缺少的目錄/檔案、搬移既有文件
5. **設定 CLAUDE.md** — 補上 vif 設定區塊

**差異報告格式：**

```
> 專案結構分析：
>
> ✅ 已符合：
>   - docs/specs/ 結構正確
>
> 📁 需建立：
>   - docs/specs/specs-overview.md（追蹤文件）
>   - docs/feature-map.md（功能追蹤）
>
> 📦 建議搬移：
>   - guideline/db-schema.md → docs/schema/（VIF 累積型設計文件）
>   - docs/PRD.md → docs/prd-001.md（VIF 命名規範）
>
> ⏭ 視需要建立（目前不需要）：
>   - docs/api-specs/（使用 /vif-api-spec 時自動建立）
>   - docs/ui-specs/（使用 /vif-ui-spec 時自動建立）
>   - docs/architecture/（使用 /vif-arch 時自動建立）
>   - docs/features/（使用 /vif-bdd 時自動建立）
>
> 要執行這些調整嗎？可逐項確認。
```

### 判斷方式

如何知道專案是否已設定 vif：

1. 檢查 `.claude/CLAUDE.md` 是否有 `vif` 相關設定區塊
2. 如有 `vif Workspace` 區塊 → 依 workspace 設定解析 docs 路徑
3. 檢查 docs 位置的 `specs/specs-overview.md` 是否存在
4. 檢查 docs 位置的 `feature-map.md` 是否存在

> 全部存在 → 已設定，跳過 init。缺任一項 → 提示 init。
>
> Multi-repo 下，init 時額外詢問 workspace 角色配置。

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
| 規範 | `/vif-guideline` | 專案規範解析（被其他 skill 引用） |

## Core Principles

1. **行為先於設計** — 先理解「系統該做什麼」再設計「怎麼做到」
2. **影響分析是核心** — 判斷新增 vs 修改既有，修改比新增更危險
3. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **驗證即誠實** — 每一個聲明都要有新鮮的證據支撐
6. **最多重試 3 次** — 超過就 escalate 給 Human

## Human Intervention Points

### Approval Gates（必須 approve 才能進入下一階段）

| Gate | Skill | Human 行為 |
|------|-------|-----------|
| PRD → Spec | `/vif-prd` | Approve PRD |
| Spec → Develop | `/vif-spec` | Approve Spec |
| Review → Close | `/vif-review` | Approve Code |

### 互動點（需要 Human 回應）

| # | 時機 | Skill | 內容 |
|---|------|-------|------|
| 1 | 架構討論 | `/vif-arch` | 討論技術選型 |
| 2 | 設計基礎 | `/vif-uiux` | 逐項討論色系、字型等 |
| 3 | BDD Discovery | `/vif-bdd` | 解決 Question、確認 Example |
| 4 | Spec 展開選擇 | `/vif-spec` | 選擇展開哪些設計文件 |
| 5 | 原型範圍 | `/vif-prototype` | 確認要做原型的頁面 |
| 6 | 原型確認 | `/vif-prototype` | 看畫面、給回饋 |
| 7 | API Spec 確認 | `/vif-api-spec` | 確認 API 規格 |
| 8 | UI Spec 確認 | `/vif-ui-spec` | 確認頁面規格 |
| 9 | 測試策略 | `/vif-develop` | 確認測試策略 |
| 10 | WARN 評估 | `/vif-verify` | 評估 WARN 要修還是記錄理由 |
| 11 | TDD 例外 | `/vif-develop` | 確認是否可不走 TDD |
| 12 | Escalation | `/vif-develop` | 3 次失敗後 Human 決定 |

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

所有 skill 統一的 escalation 規則：

### 方案性失敗（`BLOCKED`）

- 第 1-2 次失敗：AI 嘗試替代方案
- 第 3 次失敗：產出 Escalation Report，交由 Human

### 系統性失敗（`BLOCKED_BY_ENV` / `BLOCKED_BY_SPEC`）

- 立即 escalate，不重試
- 環境問題（缺少 dependency / 工具未安裝）或規格問題（spec 自相矛盾 / 不可能的需求）重試也不會解決

### 迭代改善（spec-auditor）

- spec-auditor 審查 → AI 修正 → 重新審查，最多 5 次迭代
- 這是改善 loop，不是失敗重試，性質不同

### Escalation Report 格式

```
# Escalation Report

## 問題描述
[具體問題，不是「卡住了」]

## 已嘗試方案
1. [方案 A] → [結果]
2. [方案 B] → [結果]
3. [方案 C] → [結果]

## 建議選項
- a. [提示讓 AI 重試]
- b. [Human 手動處理]
- c. [調整 spec / task]
- d. [標記 blocked，跳過]
```

## Model Selection

| 任務 | 建議模型 |
|------|---------|
| 規劃、設計、審查 | Opus |
| 實作、測試 | Sonnet |
| 文件更新 | Haiku |

詳細 Phase Transition Gates 見 `references/phase-gates.md`。
專案設定（新專案 / 既有專案對齊）見 `references/project-setup.md`。
Agent Dispatch 標準格式見 `references/dispatch-contract.md`。
