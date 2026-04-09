---
name: vif-flow
description: >-
  AI-driven development flow orchestration. Trigger on: "dev flow", "開發流程",
  "phase", "階段", "新功能", "new feature", "ai-driven", "AI 開發",
  "哪個階段", "下一步", "flow overview", "流程總覽", "init", "初始化",
  "setup", "專案設定", "對齊結構", "align structure", "health check",
  "健檢", "結構檢查", "檢查結構".
metadata:
  version: 3.1.0
---

# vif (Velocity AI Flow) — AI-Driven Development Flow

## Philosophy

> **規格不服務程式碼，程式碼服務規格。** — Spec Kit
> **「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。** — Superpowers
> **探索是思考時間，不是任務時間。** — OpenSpec
> **沒有新鮮的驗證證據，就不能做出任何完成聲明。** — Superpowers

## 兩種模式

### 模式一：完全自動化（Solo / 小團隊）

AI 為主力開發，Human 為審查角色。一人驅動完整流程。

**技術先行**（先定技術邊界再寫需求）：

```
/vif-arch + /vif-uiux → /vif-prd → /vif-bdd → /vif-prototype(可選) → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

**產品先行**（先定需求再選技術）：

```
/vif-prd → /vif-arch + /vif-uiux → /vif-bdd → /vif-prototype(可選) → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

> `/vif-arch` 會自動偵測是否已有 PRD，有的話會讀取作為技術選型的參考依據。
>
> `/vif-prototype` 屬於 Phase 0（探索），在 BDD 後、Spec 前使用：
> - 用互動式 HTML 原型確認視覺概念與需求方向，再進入 Spec

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

### 模式三：God Mode（PRD-to-Review 全自動）

既有專案（架構 ✓、UI/UX ✓、Guideline ✓），PRD approved 後一路自動執行到 Review。

```
/vif-prd → Human approve → /vif-god（Spec → Design Docs → Develop → Verify → Review）→ Results Report → Human 檢視 → /vif-close
```

> God Mode 以品質門檻（spec-auditor 通過、unresolved findings = 0）取代人工 approval gate。🟡🟢 findings 由 AI 直接修復做最佳處理，最終產出 Results Report 供使用者驗測與調整。適用於基底穩定、只需決定做什麼的場景。詳見 `/vif-god`。

## flow_mode 設定

CLAUDE.md 可設定 `flow_mode` 決定 PRD approved 後的預設行為：

```markdown
### flow_mode（可選）
<!-- - flow_mode: god -->
```

| flow_mode | PRD 後「下一步」行為 |
|-----------|-------------------|
| `god` | 直接建議 `/vif-god` |
| `normal` | 建議 `/vif-spec`（正常流程） |
| 未設定 | 提示選擇 |

**PRD → 下一步 Routing：**

```
PRD approved →
├── CLAUDE.md flow_mode: god    → 「PRD 已 approved，啟動 God Mode（/vif-god）？」
├── CLAUDE.md flow_mode: normal → 「PRD 已 approved，下一步 /vif-spec。」
└── 未設定                       → 「PRD 已 approved。下一步：
                                      A. 正常流程（/vif-spec）
                                      B. God Mode（/vif-god）— 自動跑完 Spec→Review，最後看結果」
```

> 無論 flow_mode 設定為何，使用者可隨時直接呼叫 `/vif-god` 或 `/vif-spec` 覆蓋預設。

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
| docs | ../project-docs | prds/, api-specs/, ui-specs/, schema/, specs/, guideline/ |
| frontend | . | src/, test/ |
| backend | ../project-backend | src/, test/ |

當前 repo 角色: frontend
```

> 路徑使用相對路徑（相對於當前 repo 根目錄）。每個 repo 的表格內容相同，只有路徑因 cwd 不同而不同。
> `包含` 欄列出 repo 根目錄下的**實際子目錄**，路徑解析以此為準。

### 路徑解析規則

所有 skill 中的 `docs/` 路徑為**語義路徑**，實際位置依 workspace 模式解析：

| 語義路徑 | Monorepo | Multi-Repo |
|---------|----------|------------|
| `docs/specs/` | `./docs/specs/` | `{docs-repo}/specs/` |
| `docs/api-specs/` | `./docs/api-specs/` | `{docs-repo}/api-specs/` |
| `docs/ui-specs/` | `./docs/ui-specs/` | `{docs-repo}/ui-specs/` |
| `docs/schema/` | `./docs/schema/` | `{docs-repo}/schema/` |
| `docs/prds/prd-NNN.md` | `./docs/prds/prd-NNN.md` | `{docs-repo}/prds/prd-NNN.md` |
| `guideline/` | `./guideline/` | `{docs-repo}/guideline/` |
| `src/` | `./src/` | 當前 code repo 的 `src/` |

**解析邏輯：** 語義路徑的 `docs/` prefix 在 multi-repo 下由 docs repo 根目錄**取代**（不是疊加）。因為 docs repo 本身就是 `docs/`，不需要再建一層。

```
語義路徑 docs/specs/NNN/spec.md
├── Monorepo  → ./docs/specs/NNN/spec.md        （docs/ 是 repo 內的子目錄）
└── Multi-Repo → {docs-repo}/specs/NNN/spec.md   （docs repo 根目錄 = docs/）
```

> 實際子目錄結構以 workspace mapping 的 `包含` 欄為準。例如 `包含: api-specs/, specs/` 表示這些目錄直接在 docs repo 根目錄下。

### 操作分界

Multi-repo 下，每個操作明確歸屬到一個 repo：

| 操作 | 在哪個 repo |
|------|-----------|
| 讀/寫 PRD、spec、api-spec、ui-spec、schema、.feature | docs repo |
| 讀/寫 guideline、architecture (ADR) | docs repo |
| 讀/寫 progress.md、specs-overview | docs repo |
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
>
> 📦 建議搬移：
>   - guideline/db-schema.md → docs/schema/（VIF 累積型設計文件）
>   - docs/PRD.md → docs/prds/prd-001.md（VIF 命名規範）
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

> 全部存在 → 已設定，跳過 init。缺任一項 → 提示 init。
>
> Multi-repo 下，init 時額外詢問 workspace 角色配置。

## Health Check

對既有專案進行結構與內容健檢。使用者說「health check」、「健檢」、「結構檢查」時觸發。

### 檢查項目

**1. 目錄結構**

依 workspace 模式（monorepo / multi-repo）解析 docs 位置，掃描：

| 檢查 | 說明 |
|------|------|
| 必要目錄 | `prds/`、`specs/`、`specs/specs-overview.md` 存在 |
| 視需要目錄 | `api-specs/`、`ui-specs/`、`schema/`、`architecture/`、`features/`、`guideline/` — 有內容但放錯位置？ |
| 多餘巢狀 | docs repo 內不應有 `docs/` 子目錄（multi-repo 常見問題） |
| 孤立檔案 | PRD 散在根目錄而非 `prds/` 內？設計文件不在對應目錄？ |

**2. CLAUDE.md 設定**

基礎設定：

| 檢查 | 說明 |
|------|------|
| vif 設定區塊 | 是否有 `AI-Driven Development Flow` 區塊 |
| Workspace 設定 | multi-repo 是否有 workspace 表？`包含` 欄是否與實際目錄一致？ |
| 技術棧 / 專案指令 | 是否已填寫（空白 = `/vif-arch` 還沒跑？） |
| 測試策略 | 是否已填寫？與技術棧一致？（例如 Python 專案不該用 Jest） |
| Guideline 映射 | 有 `guideline/` 但沒設定映射？映射路徑指向的檔案/目錄存在？ |

參數驗證：

| 設定 | 合法值 | 檢查 |
|------|--------|------|
| `flow_mode` | `god` / `normal` / 未設定 | 值是否合法 |
| `Code Quality` | `true` / 未設定 | — |
| AI Cross-Review `mode` | `solo` / `team` | 啟用了 design/verify/review 但沒設定 mode？ |
| AI Cross-Review `design` | CLI 名稱（如 `codex`） | 啟用了但 mode 未設定？ |
| AI Cross-Review `verify` | CLI 名稱 | 同上 |
| AI Cross-Review `review` | CLI 名稱 | 同上 |

相依性檢查：

| 條件 | 問題 |
|------|------|
| Cross-Review 有 `design`/`verify`/`review` 但沒 `mode` | 缺少 mode 設定，無法判斷觸發時機 |
| Cross-Review 有 `mode` 但 design/verify/review 全未設定 | mode 已設但沒啟用任何階段，等於沒用 |
| `flow_mode: god` 但缺少技術棧或專案指令 | God Mode 需要完整設定才能自動決策 |

**3. 文件內容一致性**

| 檢查 | 說明 |
|------|------|
| specs-overview vs 實際 | specs-overview 列出的 spec 是否都有對應的 `specs/NNN-name/` 目錄？反之亦然？ |
| progress.md 狀態 | 設計文件表的路徑是否指向存在的檔案？ |
| 設計文件 frontmatter | api-spec / ui-spec / schema 的 frontmatter 是否有基本 metadata？ |
| PRD 編號連續性 | `prds/` 內的 PRD 編號是否連續？有無跳號？ |

**4. 路徑解析驗證（multi-repo）**

| 檢查 | 說明 |
|------|------|
| workspace 路徑可達 | 表中各 repo 路徑是否存在、是否為 git repo？ |
| 各 repo CLAUDE.md | 各 code repo 是否有 workspace 設定？角色是否一致？ |

### 報告格式

```
> vif Health Check Report
>
> 🏥 專案：[name]（[monorepo / multi-repo]）
> 📅 日期：YYYY-MM-DD
>
> ❌ 問題（需修正）：
>   1. docs repo 內有多餘的 docs/ 子目錄，內含 api-specs/、schema/ — 應搬到根目錄
>   2. prd-001.md、prd-002.md 散在根目錄 — 應搬入 prds/
>   3. specs-overview 列出 spec-003 但目錄不存在
>
> ⚠️ 建議（可選）：
>   1. CLAUDE.md 缺少技術棧設定 — 建議執行 /vif-arch 或手動填寫
>   2. guideline/ 有內容但未設定映射 — 建議加入 Guideline 映射
>
> ✅ 通過：
>   - 目錄結構正確
>   - workspace 路徑可達
>   - specs-overview 與目錄一致
>
> 要修正上述問題嗎？可逐項確認。
```

### 修正模式

使用者確認後，逐項執行修正：

- **搬移檔案**：`git mv` 搬移到正確位置
- **更新路徑引用**：搬移後掃描 spec.md / progress.md 內的路徑引用，同步更新
- **補建缺少的檔案**：如 specs-overview.md
- **更新 CLAUDE.md**：補上缺少的設定區塊

> 每項修正都向使用者確認後才執行。修正完畢後自動重跑一次檢查，確認問題已解決。

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
| 全自動 | `/vif-god` | God Mode：PRD 確認後全自動開發 |
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
| 3 | 需求探索 | `/vif-prd` | 與 Human 對話釐清問題、影響、動機 |
| 4 | BDD Discovery | `/vif-bdd` | 解決 Question、確認 Example |
| 5 | Spec 展開選擇 | `/vif-spec` | 選擇展開哪些設計文件 |
| 6 | 原型範圍 | `/vif-prototype` | 確認要做原型的頁面 |
| 7 | 原型確認 | `/vif-prototype` | 看畫面、給回饋 |
| 8 | API Spec 確認 | `/vif-api-spec` | 確認 API 規格 |
| 9 | UI Spec 確認 | `/vif-ui-spec` | 確認頁面規格 |
| 10 | 測試策略 | `/vif-develop` | 確認測試策略 |
| 11 | TDD 例外 | `/vif-develop` | 確認是否可不走 TDD |
| 12 | 🟡🟢 Findings Review | `/vif-verify` | 選擇 🟡🟢 findings 要修或跳過 |
| 13 | 🟡🟢 Findings Review | `/vif-review` | 選擇 🟡🟢 findings 要修或跳過 |
| 14 | 手動測試 | `/vif-review` | 執行 reviewer 產出的手動測試清單 |
| 15 | Escalation | 所有 skill | 3 次失敗後 Human 決定 |

## AI Cross-Review Trigger Points

需在 CLAUDE.md 啟用 `AI Cross-Review` 設定才會觸發。

| 設定 key | 觸發 Skill | 觸發時機 | mode |
|----------|-----------|---------|------|
| `design` | `/vif-spec` | 與 spec-auditor 平行進行 | team only |
| `design` | `/vif-api-spec` | 與 spec-auditor 平行進行 | team only |
| `design` | `/vif-ui-spec` | 與 spec-auditor 平行進行 | team only |
| `design` | `/vif-develop` | 與 spec-auditor Pass 3 平行進行 | solo only |
| `verify` | `/vif-verify` | 與 security-reviewer 平行進行 | — |
| `review` | `/vif-review` | 與 reviewer Stage 1+2 平行進行 | — |

> **solo vs team**：solo 在開發前統一審查所有設計文件（效率高）；team 在各 skill 完成時個別審查（回饋快）。verify 和 review 不分 mode。

## Documents

### 三層文件

| 層 | 文件 | 問題 |
|----|------|------|
| 需求 | `docs/prds/prd-NNN.md` | WHY + WHAT |
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

## Commit Points

| 時機 | 內容 | Message 範例 | 類型 |
|------|------|-------------|------|
| PRD approved | PRD 文件 | `docs: add prd-001 user-login` | Human 確認後 |
| BDD 完成 | .feature 文件 | `docs: add feature iam/user-login` | Human 確認後 |
| Spec approved | spec.md + progress.md | `docs: add spec-001 user-login` | Human approve 後 |
| 設計文件完成 | api-spec / ui-spec / schema | `docs: add api-spec iam/auth/login` | Human 確認後 |
| 開發 per-task | test + implementation + progress.md | `feat: implement login API (spec-001)` | 自動 |
| Verify 完成 | verification-report.md + progress.md | `docs: verify spec-001 PASS` | 自動 |
| Review APPROVED | review-report.md + progress.md | `docs: review spec-001 APPROVED` | Human approve 後 |
| Review 修復 | review 修正 | `fix: address review feedback (spec-001)` | 自動 |
| 收尾 | 追蹤文件更新 | `docs: close spec-001` | 自動 |

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

- spec-auditor 審查 → AI 修正 → 重新審查
  - spec.md 審查（含 3 pass + 自我審視）：最多 5 次迭代
  - 設計文件審查（api-spec / ui-spec，僅 Pass 1+2）：最多 3 次迭代
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
