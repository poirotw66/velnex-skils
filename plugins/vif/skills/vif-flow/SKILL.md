---
name: vif-flow
description: >-
  AI-driven development flow orchestration. Trigger on: "dev flow", "開發流程",
  "phase", "階段", "新功能", "new feature", "ai-driven", "AI 開發",
  "哪個階段", "下一步", "flow overview", "流程總覽", "init", "初始化",
  "setup", "專案設定", "對齊結構", "align structure", "health check",
  "健檢", "結構檢查", "檢查結構".
metadata:
  version: 3.4.0
---

# vif (Velocity AI Flow) — AI-Driven Development Flow

## Philosophy

> **規格不服務程式碼，程式碼服務規格。** — Spec Kit
> **「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。** — Superpowers
> **探索是思考時間，不是任務時間。** — OpenSpec
> **沒有新鮮的驗證證據，就不能做出任何完成聲明。** — Superpowers

## 三種模式

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

## Design Doc Lifecycle

`docs/api-specs/`、`docs/ui-specs/`、`docs/schema/` 下的設計文件透過 frontmatter 的 `status` 欄位標示生命週期。所有跨 skill 的狀態判斷以此為準。

### 四個狀態

| 狀態 | 語意 | 由誰產生 |
|------|------|---------|
| `draft` | 剛由 template 建立，尚未通過自審 | `/vif-api-spec`、`/vif-ui-spec` 從 template 建檔 |
| `approved` | 通過 spec-auditor Pass 1+2 自審 + Human 確認，待實作 | 設計 skill Step 4/6 最後一步（Human 確認後） |
| `implemented` | 本 spec 範圍已完成實作並通過 Review | `/vif-close` Design Doc Sync 階段 |
| `deprecated` | 已被其他設計文件取代 | 設計 skill 處理「取代」項目時 |

### 狀態轉換

```
                     ┌──[後續 spec 修改]──┐
                     │                    │
                     ↓                    │
draft ──[Human 確認]──→ approved ──[spec close]──→ implemented
                     │                             │
                     │ [被取代]                    │ [被取代]
                     └──────────────┬──────────────┘
                                    ↓
                               deprecated
```

| 轉換 | 觸發點 | 由哪個 skill 執行 |
|------|-------|----------------|
| `draft → approved` | 設計文件 Human 確認後 | `/vif-api-spec` Step 6、`/vif-ui-spec` Step 4 |
| `approved → implemented` | spec close 時對本 spec 範圍內文件統一升級 | `/vif-close` Design Doc Sync |
| `implemented → approved` | 後續 spec 修改既有 implemented 文件（實作已與設計脫鉤，需重走 close 流程） | `/vif-api-spec`、`/vif-ui-spec`（Step 2 修改流程） |
| `→ deprecated` | 新設計完全取代舊文件（來源可為 approved 或 implemented） | `/vif-api-spec`、`/vif-ui-spec`（Step 2 取代處理） |

### deprecated 必要欄位

`status: deprecated` 時 frontmatter 必須同時有：

- `replaced-by: [新檔案路徑]` — 取代此文件的新設計
- `deprecated-spec: spec-NNN` — 做此取代的 spec 編號

缺任一欄位即視為結構破壞（Health Check 會標 BLOCK）。

## Project Init

安裝 vif plugin 後的第一步：分析專案現況並對齊 VIF 結構。

### 判斷專案類型

```
> 偵測到本專案尚未設定 vif。
>   A. 全新專案（從零建立 VIF 結構）
>   B. 既有專案（分析現有結構，對齊 VIF 規範）
```

### A. 全新專案

按照 `references/project-setup.md` 建立完整結構。建立完成後自動執行 Health Check（見下方），BLOCK = 0 才算 init 完成。

### B. 既有專案

1. **掃描現有結構** — 讀取專案目錄，對照 VIF 預期結構
2. **產出差異報告** — 列出需要的調整（見下方格式）
3. **Human 確認** — 讓使用者決定哪些要調整、哪些保留
4. **執行調整** — 建立缺少的目錄/檔案、搬移既有文件
5. **設定 CLAUDE.md** — 補上 vif 設定區塊
6. **Health Check** — 自動執行 Health Check（見下方），BLOCK = 0 才算 init 完成

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

### Workspace 變化偵測

已設定 vif 的專案，vif-flow 每次 routing 前做輕量驗證：

- CLAUDE.md workspace 宣告 vs 實際目錄是否一致
- multi-repo：宣告的 repo 路徑可達且為 git repo
- 當前 repo 宣告角色的 `包含` 子目錄實際存在

任一項不符 → 提示「⚠️ 偵測到 workspace 設定與實際結構不一致，建議先跑 Health Check（說『健檢』或『health check』）」後再進行 routing。

> 目的：使用者手動改 CLAUDE.md 或切換 workspace mode 後，vif-flow 能主動察覺，不等某個 skill 執行失敗才發現。這是輕量驗證，完整結構檢查仍交給 Health Check。

## Health Check

專案結構健檢。確認專案是否準備好執行 vif 流程。

### 觸發時機

| 時機 | 方式 |
|------|------|
| Init 完成後 | **自動**（Init 結尾步驟，BLOCK = 0 才算 init 完成） |
| 使用者說「health check」、「健檢」、「結構檢查」 | **手動** |
| 搬移/重組專案結構後 | **手動**（建議） |
| vif-flow 偵測 workspace 設定與實際結構不一致 | **自動提示**（見上方 Workspace 變化偵測） |

> Health Check 檢查的是「專案結構是否符合 vif 執行條件」。各 Phase 的進入條件由 `references/phase-gates.md` 定義，不與結構健檢重複。

### 判定模型

| 等級 | 意義 | 影響 |
|------|------|------|
| **BLOCK** | 結構性缺失，vif 無法運作 | 不通過 |
| **WARN** | 可以跑但有風險或效率問題 | 通過（附警告） |
| **INFO** | 建議改善，不影響運作 | 通過 |

**通過條件：BLOCK = 0**

### 檢查項目

**1. Plugin 依賴**

| 檢查 | 等級 | 理由 |
|------|------|------|
| vex plugin 未安裝（git-commit agent 不可用） | **BLOCK** | commit 流程依賴 |

**2. Workspace 模式**

先判定模式：CLAUDE.md 有 `vif Workspace` 區塊 → multi-repo，否則 → monorepo（預設）。

| 檢查 | 等級 | 理由 |
|------|------|------|
| multi-repo：repo 路徑不存在 | **BLOCK** | 找不到 docs / code |
| multi-repo：repo 不是 git repo | **BLOCK** | commit 操作會失敗 |
| multi-repo：目標 repo 沒有 CLAUDE.md workspace 區塊 | **BLOCK** | 路徑解析失敗 |
| multi-repo：角色衝突（兩個 repo 宣告同一角色） | **BLOCK** | 不知道哪個是 docs |
| multi-repo：`包含` 欄 vs 實際目錄不一致 | **WARN** | 路徑解析可能找錯位置 |
| multi-repo：docs repo 內有多餘 `docs/` 巢狀 | **WARN** | 路徑解析會多一層 |

**3. 必要結構**

依 workspace 模式解析 docs 位置後掃描：

| 檢查 | 等級 | 理由 |
|------|------|------|
| docs 根目錄不存在（或 multi-repo docs repo 不可達） | **BLOCK** | 所有文件操作失敗 |
| CLAUDE.md 無 `AI-Driven Development Flow` 區塊 | **BLOCK** | skill 無法讀取設定 |
| `prds/` 不存在 | **WARN** | /vif-prd 會自動建立，但表示 init 未完成 |
| `specs/` 不存在 | **WARN** | /vif-spec 會自動建立，但表示 init 未完成 |
| `specs-overview.md` 不存在 | **WARN** | /vif-prd 或 init 會建立 |
| `specs-overview.md` 格式不正確（缺表格結構） | **WARN** | 後續 skill 無法正確解析 |

**4. CLAUDE.md 設定**

基礎設定：

| 檢查 | 等級 | 理由 |
|------|------|------|
| 技術棧 / 專案指令 / 測試策略全空 | **WARN** | develop / verify 會缺指令 — 建議先執行 /vif-arch |
| 無 Git 規範區塊 | **WARN** | commit subagent dispatch 缺資訊 |
| 無 Skills 表 | **INFO** | 不影響執行，只是使用者參考 |

參數驗證：

| 檢查 | 等級 | 理由 |
|------|------|------|
| `flow_mode` 值不合法（非 god / normal） | **WARN** | fallback 到提示選擇 |
| `flow_mode: god` 但缺技術棧或專案指令 | **WARN** | God Mode 需要完整設定才能自動決策 |
| Cross-Review 啟用 `design` 但沒 `mode` | **WARN** | design 的觸發時機需要 mode（solo = 統一審查、team = 個別審查） |
| Cross-Review 有 `mode` 但 3 個階段都沒啟用 | **INFO** | 等於沒用，提醒即可 |

Guideline：

| 檢查 | 等級 | 理由 |
|------|------|------|
| Guideline 映射路徑不存在 | **WARN** | guideline 注入會失敗 |
| `guideline/` 有內容但沒映射 | **INFO** | 目錄慣例 fallback 可能匹配，建議明確設定 |

Templates：

| 檢查 | 等級 | 理由 |
|------|------|------|
| Templates 映射路徑不存在 | **WARN** | skill 會 fallback 到內建，但表示設定有錯 |
| Templates 指向的檔案存在但格式異常（非 markdown、空檔） | **INFO** | 能讀但可能產生奇怪結果 |
| Multi-Repo 下 code repo 的 CLAUDE.md 有 Templates 區塊 | **WARN** | 設定會被忽略（skill 只讀 docs repo 的 Templates）— 屬設計限制，見 project-setup R4 |

**5. 結構錯位**

| 檢查 | 等級 | 理由 |
|------|------|------|
| PRD 散在根目錄而非 `prds/` | **WARN** | /vif-prd 找不到 |
| spec 文件不在 `specs/NNN-name/` 結構 | **WARN** | 後續 skill 路徑假設不成立 |
| `guideline/` 放在 `docs/` 而非專案根 | **INFO** | 慣例不匹配，但可設映射 |

**6. Spec 目錄完整性**（有 spec 時才檢查）

| 檢查 | 等級 | 理由 |
|------|------|------|
| `specs/NNN-name/` 存在但無 `spec.md` | **WARN** | 空殼目錄 |
| `specs/NNN-name/` 有 `spec.md` 但無 `progress.md` | **WARN** | Phase 1 未完成 |
| specs-overview 列出 spec 但目錄不存在 | **WARN** | 追蹤文件與實際不同步 |
| 目錄存在但 specs-overview 沒列 | **WARN** | 追蹤文件與實際不同步 |
| spec 編號跳號 | **INFO** | 不影響運作，可能是刻意 |

**7. PRD ↔ Specs-Overview 對齊**（有 PRD 時才檢查）

掃描 `prds/` 下所有 `prd-*.md` 的 Meta 狀態與 Section 6 spec 清單，比對 specs-overview：

| 檢查 | 等級 | 理由 |
|------|------|------|
| PRD 狀態為 `approved` 但 specs-overview 沒對應任何 spec 條目 | **WARN** | 孤兒 PRD——Import Mode 忘跑 Step 5、或 New Mode 中斷於 Step 4 後 |
| PRD 狀態為 `approved`、Section 6 列出 N 個 spec，specs-overview 只有 M 個（M < N）| **WARN** | 部分展開——Step 5 中斷或手動漏填 |
| specs-overview 某條目的 `PRD` 欄指向不存在的 PRD 編號 | **WARN** | 追蹤斷鏈，可能是 PRD 被刪或編號誤填 |
| specs-overview 某條目的 `PRD` 欄對應的 **approved** PRD Section 6 沒有此 spec | **WARN** | 反向不一致——spec 被加入但 PRD 沒更新，或編號錯誤 |
| PRD 狀態為 `proposal` 但 specs-overview 已有對應條目 | **INFO** | 可能是提前展開，也可能是狀態忘記更新（proposal PRD 的 Section 6 不一致不額外 WARN，由此項 INFO 統一表達） |

> **對齊檢查的兩個方向**：PRD → specs-overview（每個 approved PRD 的 Section 6 spec 都要在 overview）、specs-overview → PRD（每個 overview 條目的 PRD 欄要能回查到 PRD Section 6）。任一方向不一致都是 WARN。
>
> 孤兒 PRD 是 Import Mode 最容易發生的問題：外部 PRD 直接放進 `docs/prds/`，但沒跑 `/vif-prd` → Step 5 不會觸發 → specs-overview 永遠不會有這條 → `/vif-spec` Entry Gate 會擋下，但使用者可能搞不清楚為什麼。Health Check 提早暴露這個狀態。

**8. 設計文件 Frontmatter**（有設計文件時才檢查）

掃描 `api-specs/`、`ui-specs/`、`schema/` 下所有 `.md` 檔案的 frontmatter：

| 檢查 | 等級 | 理由 |
|------|------|------|
| 缺 `domain` / `module` / `spec` | **WARN** | 5 個 skill 依賴 frontmatter 做快速相關性掃描，缺欄位會導致判斷失準 |
| `spec` 欄位指向不存在的 spec | **WARN** | 關聯斷裂，cross-check 無法追溯 |
| 缺 `status` 欄位 | **BLOCK** | 無法判斷文件生命週期，status 轉換規則（draft→approved→implemented→deprecated）完全不適用 |
| `status` 值不合法（非 draft / approved / implemented / deprecated） | **BLOCK** | 語意破壞，所有 skill 對狀態的判斷會混亂 |
| `status: deprecated` 但缺 `replaced-by` 或 `deprecated-spec` | **BLOCK** | 取代鏈斷裂，使用者拿到 deprecated 文件卻不知該用哪份替代 |
| `replaced-by` 指向不存在的檔案 | **WARN** | 取代鏈斷裂但仍有 status 標示 |

> **WARN vs BLOCK 分界**：`domain`/`module`/`spec` 缺失仍 WARN，因為 vif-develop 有兩層載入保底（progress.md 路徑 → frontmatter scan），缺一仍能運作、只是掃描品質差。`status` 相關欄位升為 BLOCK，因為它決定整個 lifecycle（升降、實作對應、取代鏈），錯或缺就無法確定文件是否有效、該用哪個版本。

### 報告格式

有 BLOCK 時：

```
> vif Structural Health Check
>
> 🏥 專案：[name]（[monorepo / multi-repo]）
> 📅 日期：YYYY-MM-DD
>
> ─── 結果：❌ BLOCK (N) ───
>
> ❌ BLOCK（必須修正，否則 vif 無法運作）：
>   1. [問題描述]
>   2. [問題描述]
>
> ⚠️ WARN (N)：
>   1. [問題描述] — [修正建議]
>
> ℹ️ INFO (N)：
>   1. [問題描述] — [修正建議]
>
> ✅ 通過（M/N 項）：
>   - [類別] ✓
>
> 要修正上述問題嗎？可逐項確認。
```

BLOCK = 0 時：

```
> ─── 結果：✅ PASS ───
>
> ⚠️ WARN (N)：
>   1. [問題描述] — [修正建議]
>
> ✅ 全部結構檢查通過（M/N 項），可正常執行 vif 流程。
```

### 修正模式

使用者確認後，逐項執行修正：

- **搬移檔案**：`git mv` 搬移到正確位置
- **更新路徑引用**：搬移後掃描 spec.md / progress.md 內的路徑引用，同步更新
- **補建缺少的檔案**：如 specs-overview.md
- **更新 CLAUDE.md**：補上缺少的設定區塊
- **補齊 frontmatter**：掃描設計文件，補上缺少的 `domain` / `module` / `spec` 欄位

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
2. **影響分析是核心** — 判斷新增 / 修改 / 取代 / 參考，修改和取代比新增更危險
3. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
4. **Spec 先行** — 沒有 approved spec 不寫設計文件（api-spec / ui-spec / schema）、不寫程式
5. **驗證即誠實** — 每一個聲明都要有新鮮的證據支撐
6. **最多重試 3 次** — 超過就 escalate 給 Human

## Human Intervention Points

### Approval Gates（必須 approve 才能進入下一階段）

| Gate | Skill | Human 行為 |
|------|-------|-----------|
| PRD → Spec | `/vif-prd` | Approve PRD |
| Spec → Design Docs / Develop | `/vif-spec` | Approve Spec（一次 approve 解鎖 Phase 1 設計文件撰寫 + Phase 2 開發） |
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
| 8 | 設計偏差核准 | `/vif-api-spec`, `/vif-ui-spec` | 偏差偵測後選擇核准/逐項/拒絕 |
| 9 | API Spec 確認 | `/vif-api-spec` | 確認 API 規格 |
| 10 | UI Spec 確認 | `/vif-ui-spec` | 確認頁面規格 |
| 11 | 測試策略 | `/vif-develop` | 確認測試策略 |
| 12 | TDD 例外 | `/vif-develop` | 確認是否可不走 TDD |
| 13 | 🟡🟢 Findings Review | `/vif-verify` | 選擇 🟡🟢 findings 要修或跳過 |
| 14 | 🟡🟢 Findings Review | `/vif-review` | 選擇 🟡🟢 findings 要修或跳過 |
| 15 | 手動測試 | `/vif-review` | 執行 reviewer 產出的手動測試清單 |
| 16 | Escalation | 所有 skill | 3 次失敗後 Human 決定 |

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
| 規劃 | `docs/specs/NNN-name/spec.md` | WHAT to build |

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

## 狀態系統對應表

vif 有四套平行的狀態標記，各自管理不同生命週期。以下為對應關係與同步規則：

| 層級 | 檔案位置 | 值域 | 由誰更新 |
|------|---------|------|---------|
| 全專案 spec 索引 | `specs-overview.md` 狀態欄 | `—` / `📋` / `✅` / `🚧` / `✔️` | vif-prd（`—` 建立）→ vif-spec（`✅`）→ vif-develop（`🚧`，首個 task 啟動時）→ vif-close（`✔️`） |
| 單一 spec 流程 | `spec.md` Meta 狀態 | `draft` / `approved` / `in-progress` / `done` | vif-spec（`approved`）→ vif-develop（`in-progress`）→ vif-close（`done`） |
| 單一 spec 進度 | `progress.md` 設計文件表狀態欄 | `待撰寫` / `完成` | vif-api-spec、vif-ui-spec（Step 6 / Step 4 改為「完成」） |
| 個別設計文件生命週期 | 設計文件 frontmatter `status` | `draft` / `approved` / `implemented` / `deprecated` | 設計 skill（`draft` 建立、`approved` Human 確認後）→ vif-close（`implemented`）→ 取代流程（`deprecated`） |

**同步規則：**

- **specs-overview ↔ spec.md Meta**：兩者狀態語意一對一對應（`📋` ↔ `draft`、`✅` ↔ `approved`、`🚧` ↔ `in-progress`、`✔️` ↔ `done`）。特殊值 `—`（not-started）僅用於 specs-overview，表示 spec.md 尚未建立。任一方更新時必須同步另一方。
- **progress.md ↔ frontmatter status**：`progress.md` 的「完成」對應 frontmatter `approved`（設計階段結束）或 `implemented`（close 後）。設計修改導致 implemented 降回 approved 時，progress.md 仍維持「完成」，僅 Pass 3 checkbox 重置。
- **任一層級的不同步** 由 Health Check 偵測並以 WARN 標示（見 vif-flow Health Check）。

## Commit Points

| 時機 | 內容 | Message 範例 | 類型 |
|------|------|-------------|------|
| PRD approved | PRD 文件 | `docs: add prd-001 user-login` | Human 確認後 |
| BDD 完成 | .feature 文件 | `docs: add feature iam/user-login` | Human 確認後 |
| Spec approved | spec.md + progress.md | `docs: add spec-001 user-login` | Human approve 後 |
| 設計文件完成 | api-spec / ui-spec / schema | `docs: add api-spec iam/auth/login (spec-001)` | Human 確認後 |
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
