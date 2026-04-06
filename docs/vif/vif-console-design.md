# VIF Console — 產品設計文件

> VIF 的主要操作介面從 CLI 遷移到 UI。使用者不再需要開終端機打 `/vif-prd`，而是在介面上直接操作整個開發流程。

```
現在：使用者 → CLI 打指令 → Claude Code 執行 skill → 看輸出 → 打字 approve
以後：使用者 → UI 操作 → Console 驅動 Claude Code → UI 顯示過程 → 按鈕操作
```

**Claude Code 從「使用者直接操作的工具」變成「Console 背後的執行引擎」。**

---

## 一、三種互動模式

分析完 14 個 skill 的所有 step，使用者的互動本質上只有三種：

### 模式 A：對話（Conversation）

使用者和 AI 來回討論，逐步釐清一件事。

| Skill | 對話內容 |
|-------|---------|
| vif-prd step.2 | 問題探索：「痛點是什麼？影響誰？」 |
| vif-arch step.2 | 技術討論：「用 Next.js 還是 SvelteKit？」 |
| vif-uiux step.1-3 | 設計探索：「產品個性？色系？字型？」 |
| vif-bdd step.0-1 | 行為發現：「這個邊界條件怎麼處理？」 |

→ **需要 Chat UI**

### 模式 B：執行 + 監控（Execution）

AI 自動執行，使用者看進度、看結果。

| Skill | 執行內容 |
|-------|---------|
| vif-spec step.1-2 | Impact Analysis + 寫 spec |
| vif-api-spec step.1-4 | 寫 API spec + openapi + schema |
| vif-ui-spec step.1-3 | 寫 UI spec |
| vif-develop step.3 | TDD loop（test-writer → implementer）|
| vif-verify step.1-3 | 跑 pipeline（verifier + security-reviewer）|
| vif-review step.1-2 | 執行 code review（reviewer agent）|
| vif-close step.1-3 | 同步文件 + checklist |

→ **需要 Monitor UI**（即時 log + 進度條 + agent 狀態）

### 模式 C：決策（Decision）

使用者做一個選擇或給一個批准。

| 場景 | 決策內容 | UI 元素 |
|------|---------|---------|
| PRD 完成 | Approve 這份 PRD？ | Approve / Request Changes |
| Spec 完成 | Approve 這份 Spec？ | Approve / Request Changes |
| 展開選擇 | 展開哪些設計文件？ | Checkbox: API / UI / Schema / 全部 / 不展開 |
| Test Strategy | 確認測試策略？ | 表格 + Confirm / Adjust |
| 🟡🟢 Findings Review | lint warning / 可維護性問題，修還是接受？ | Fix / Accept + 理由 |
| Escalation | 3 次失敗，選一個方案 | Option a/b/c/d |
| Review 完成 | Code 可以嗎？ | Approve / Changes Requested |
| TDD 例外 | 這個可以不走 TDD 嗎？ | Allow / Deny |

→ **需要 Decision UI**（結構化表單 + 按鈕）

---

## 二、每個 Skill 的 Step 模式標注

每個 step 標注為 `[A]` 對話 / `[B]` 自動執行 / `[C]` 決策：

### vif-prd

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Pre-check（掃描既有 PRD/spec） | [B] 自動掃描 |
| step.2 | Problem Exploration（人機對話） | [A] 對話 |
| step.3 | Draft PRD（產出文件） | [B] 自動產出 |
| step.4 | Deliver & Approve（人審核 + 迭代） | [C] 決策：approve PRD |
| step.5 | Expand specs-overview（更新追蹤） | [C] 決策：確認 spec 清單 |
| step.6 | Commit | [B] 自動 |

### vif-arch

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Pre-check | [B] 自動 |
| step.2 | Tech Discussion | [A] 對話 |
| step.3 | Write ADR | [B] 自動產出 |
| step.4 | Update CLAUDE.md | [B] 自動 |
| step.5 | Confirm | [C] 決策：確認 |

### vif-uiux

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Intent First | [A] 對話 |
| step.2 | Domain Exploration | [A] 對話 + [C] 決策（方向確認） |
| step.3 | Design Decisions | [A] 對話（逐項） |
| step.4 | Quality Testing | [C] 決策：測試結果確認 |
| step.5 | Record | [B] 自動 |

### vif-bdd

| Step | 名稱 | 模式 |
|------|------|------|
| step.0 | Three-Perspective | [A] 對話 |
| step.1 | Example Mapping | [A] 對話 + [C] 決策（解 🔴 Question） |
| step.2 | Write .feature | [B] 自動 + [C] 確認 |

### vif-spec

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Impact Analysis | [B] 自動執行 |
| step.2 | Write spec.md | [B] 自動產出 |
| step.3 | Build progress.md | [B] 自動 |
| step.4 | Choose Expansion | [C] 決策：展開什麼 |
| step.5a | spec-auditor | [B] 自動（dispatch agent） |
| step.5b | Self-reflection | [B] 自動 |
| step.5c | Human review | [C] 決策：approve spec |
| step.6 | Commit | [B] 自動 |

### vif-prototype

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Check guideline | [B] 自動 + [C] 決策（用不用 uiux） |
| step.2 | Confirm scope | [C] 決策：哪些頁面 |
| step.3 | Generate | [B] 自動 |
| step.4 | Human review | [A] 看畫面 + 給回饋 |
| step.5 | Convert to UI Spec | [B] 自動 |

### vif-api-spec

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Input & Impact | [B] 自動 |
| step.2 | Write API Specs | [B] 自動 |
| step.3 | Update openapi.yaml | [B] 自動 |
| step.4 | Write DB Schema | [B] 自動 |
| step.5 | Self-Review (auditor) | [B] 自動（dispatch agent，可迭代） |
| step.6 | Confirm | [C] 決策：確認 |
| step.7 | Commit | [B] 自動 |

### vif-ui-spec

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Input & Impact | [B] 自動 |
| step.2 | Write UI Specs | [B] 自動 |
| step.3 | Self-Review (auditor) | [B] 自動（dispatch agent） |
| step.4 | Confirm | [C] 決策：確認 |
| step.5 | Commit | [B] 自動 |

### vif-develop

| Step | 名稱 | 模式 |
|------|------|------|
| step.0 | Entry Gate | [B] 自動檢查 |
| step.1 | Test Strategy | [C] 決策：確認策略 |
| step.2 | Guideline Injection | [B] 自動 |
| step.3 | Core Loop (per task) | — |
| ∟ 3a | RED | [B] dispatch test-writer |
| ∟ 3b | RED→GREEN Gate | [B] 自動檢查 |
| ∟ 3c | GREEN | [B] dispatch implementer |
| ∟ 3d | Feedback Loop | [B] 自動 / [C] escalation |
| ∟ 3e | REFACTOR | [B] 自動 |
| ∟ 3f | Verify | [B] 自動 |
| ∟ 3g | Update progress | [B] 自動 |
| ∟ 3h | Commit | [B] 自動 |
| step.4 | De-Sloppify | [B] 自動 |
| step.5 | Exit Check | [B] 自動 |

### vif-verify

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Core Stages | [B] dispatch verifier |
| step.2 | Security Review | [B] dispatch security-reviewer |
| step.3 | Code Quality | [B] 自動（optional） |
| step.4 | 🟡🟢 Findings Review | [C] 決策（per finding） |
| step.5 | Report | [B] 自動 |
| step.6 | Commit | [B] 自動 |

### vif-review

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Stage 1+2 | [B] dispatch reviewer |
| step.2 | Feedback | [B] 自動（report 產出） |
| step.3 | Manual Test Checklist | [B] 自動產出 |
| step.4 | Issue Resolution | [C] 決策（per 🟡 item） |
| step.5 | Human Approve | [C] 決策：approve code |
| step.6 | Commit | [B] 自動 |

### vif-close

| Step | 名稱 | 模式 |
|------|------|------|
| step.1 | Design Doc Sync | [B] 自動 + [C] 決策 |
| step.2 | Completion Checklist | [B] 自動檢查 |
| step.3 | Updates | [B] 自動 |
| step.4 | Commit | [B] 自動 |

### 模式分佈統計

| 模式 | 出現次數 | 佔比 | 意義 |
|------|---------|------|------|
| [A] 對話 | ~10 | 15% | 只在探索型 skill 出現 |
| [B] 自動執行 | ~42 | 63% | 大部分時間 AI 在做事 |
| [C] 決策 | ~15 | 22% | 使用者做選擇和批准 |

**關鍵洞見**：63% 的步驟是自動的，使用者其實只需要介入 37% 的時間。UI 的核心價值就是讓那 63% 可見可追蹤，讓那 22% 的決策高效，讓那 15% 的對話舒適。

---

## 三、介面結構

### 整體佈局

```
┌─────────────────────────────────────────────────────────┐
│  VIF Console                                             │
│                                                          │
│  ┌─ Sidebar ─┐  ┌─ Main Area ──────────────────────┐   │
│  │            │  │                                   │   │
│  │ 🏠 Home    │  │  根據目前 active skill 動態切換    │   │
│  │            │  │  顯示對應的互動模式：              │   │
│  │ 📁 Specs   │  │                                   │   │
│  │  001 🚧   │  │  • 對話面板（prd/arch/uiux/bdd）  │   │
│  │  002 📋   │  │  • 工作台（spec/api/ui/prototype） │   │
│  │  003 —    │  │  • 監控台（develop）                │   │
│  │            │  │  • 驗證台（verify/review）          │   │
│  │ 📄 Docs   │  │  • 核對台（close）                  │   │
│  │            │  │                                   │   │
│  │ ⚙ Config  │  │                                   │   │
│  │            │  └───────────────────────────────────┘   │
│  └────────────┘                                          │
│                                                          │
│  ┌─ Bottom Bar ─────────────────────────────────────┐   │
│  │ 🔔 2 Gates pending │ 🟢 3 Agents running │ Flow ▸│   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

根據 A/B/C 三種互動模式，Main Area 需要能承載五種介面模式：

| UI 模式 | 對應 Skills | 核心元素 |
|---------|------------|---------|
| 對話面板 | prd, arch, uiux, bdd | Chat + Artifact 即時預覽 |
| 工作台 | spec, api-spec, ui-spec, prototype | 結構化表格 + 文件預覽 + 審計結果 |
| 監控台 | develop | Task pipeline + Agent 狀態 + Event log |
| 驗證台 | verify, review | Pipeline stages + 🟡🟢 Findings Review |
| 核對台 | close | Checklist + Auto-check + 最終確認 |

---

## 四、操作旅程

### Step 0：開啟專案

使用者開啟 VIF Console，選擇專案資料夾。

```
┌──────────────────────────────────────────────────┐
│  Welcome to VIF Console                           │
│                                                    │
│  Recent Projects:                                  │
│  ┌────────────────────────────────────────────┐   │
│  │ 📁 ~/Projects/my-saas     vif configured   │   │
│  │ 📁 ~/Projects/mobile-app  vif configured   │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  [Open Project...] [Init New Project]              │
└──────────────────────────────────────────────────┘
```

**Init New Project** 就是現在 vif-flow 的 Project Init，但用設定精靈取代對話：

```
┌──────────────────────────────────────────────────┐
│  Project Setup                          Step 1/4  │
│                                                    │
│  模式：                                            │
│  ● 完全自動化（Solo / 小團隊）                       │
│  ○ 輔助自動化（企業團隊）                            │
│                                                    │
│  流程順序：                                         │
│  ● 技術先行（先 arch → 再 prd）                     │
│  ○ 產品先行（先 prd → 再 arch）                     │
│                                                    │
│  Workspace：                                       │
│  ● Monorepo                                        │
│  ○ Multi-repo → [設定 repo 角色和路徑]              │
│                                                    │
│                              [Next →]              │
└──────────────────────────────────────────────────┘
```

### Step 1：Home — 看全局、做決策

使用者每次打開 Console 第一眼看到的頁面，是 Progress Board + Gate Console 的合體。

```
┌──────────────────────────────────────────────────────────────┐
│  my-saas-app                                                  │
│                                                                │
│  ┌─ Active Flows ─────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  spec-001: User Login                                   │  │
│  │  ✅ arch → ✅ prd → ✅ spec → 🚧 api+ui → ○ dev → ...   │  │
│  │  Current: vif-api-spec (AI 撰寫中)                      │  │
│  │  [Open →]                                               │  │
│  │                                                         │  │
│  │  spec-002: File Upload                                  │  │
│  │  ✅ prd → 🔒 spec (等待 approve)                        │  │
│  │  [Open →]                                               │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Needs Your Attention ─────────────────────────────────┐  │
│  │                                                         │  │
│  │  🔶 spec-002: Spec 等待 Approve                         │  │
│  │     spec-auditor: APPROVED (0 🔴, 2 🟢)                 │  │
│  │     [Preview Spec] [✅ Approve] [💬 Feedback]           │  │
│  │                                                         │  │
│  │  🔶 spec-001: api-spec 自審完成                          │  │
│  │     spec-auditor: NEEDS_REVISION (1 🟡)                 │  │
│  │     → "欄位 created_at 在 spec 裡但 schema 漏了"        │  │
│  │     [View Finding] [Auto-fix] [Dismiss]                 │  │
│  │                                                         │  │
│  │  🔴 spec-001/task-3: Escalation                         │  │
│  │     implementer BLOCKED (3rd attempt)                   │  │
│  │     "Rate limiter 需要 Redis 但專案只有 in-memory"       │  │
│  │     ○ a. 降低需求  ○ b. 加 Redis  ○ c. 跳過  ○ d. 手動 │  │
│  │     [Decide]                                            │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Running Agents ───────────────────────────────────────┐  │
│  │ 🟢 spec-auditor  spec-001/api-spec  design-review 2m   │  │
│  │ 🟢 test-writer   spec-001/task-4    RED stage     45s  │  │
│  │ 🟢 implementer   spec-001/task-3    GREEN stage   3m   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [+ New Feature]  [+ Bug Fix]  [+ Quick Task]                 │
└──────────────────────────────────────────────────────────────┘
```

**「+ New Feature」按鈕** = 啟動一個新的 flow instance：

1. 選模板（或用專案預設）
2. 自動建立第一個 skill 的 workspace
3. 進入 Flow 操作介面

### Step 2：Flow 操作 — 依模式切換介面

點進一個 spec 的 flow 後，上方永遠有 **Flow Pipeline Bar**，下方根據當前 active skill 切換不同的操作介面。

```
┌──────────────────────────────────────────────────────────────┐
│  ← Home    spec-001: User Login                               │
│                                                                │
│  ┌─ Flow Pipeline ────────────────────────────────────────┐  │
│  │ ✅arch ✅uiux ✅prd ✅spec 🚧api 🚧ui ○dev ○vfy ○rev ○cls│  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Active Skill Area ────────────────────────────────────┐  │
│  │                                                         │  │
│  │  （根據 skill 類型切換，見下方五種模式）                    │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 五、五種 UI 模式詳解

### 模式 A：對話面板（prd / arch / uiux / bdd）

這些 skill 的本質是人跟 AI 討論。介面是 chat + 即時產出物預覽。

```
┌─ vif-prd ──────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Chat ──────────────────────┐ ┌─ Artifact Preview ──────┐  │
│  │                              │ │                          │  │
│  │ 🤖 我看到你的專案已有 auth    │ │ # PRD-001: User Login   │  │
│  │   模組，目前用的是 session    │ │                          │  │
│  │   based auth。你想解決什麼    │ │ ## 1. 問題定義           │  │
│  │   問題？                     │ │ 現有 session auth 無法   │  │
│  │                              │ │ 支援多裝置同時登入...    │  │
│  │ 👤 我想改成 JWT，支援多裝置   │ │                          │  │
│  │   登入，而且手機 app 也要     │ │ ## 2. 使用者影響         │  │
│  │   用同一組 API。             │ │ - 一般用戶：多裝置       │  │
│  │                              │ │ - 管理員：監控 sessions  │  │
│  │ 🤖 好的，那我們需要釐清幾    │ │                          │  │
│  │   件事：                     │ │ ## 3. 預期成果           │  │
│  │   1. 現有的 session 要保留    │ │ (撰寫中...)              │  │
│  │      還是完全替換？           │ │                          │  │
│  │   2. Token refresh 機制？    │ │                          │  │
│  │   3. ...                    │ │                          │  │
│  │                              │ │                          │  │
│  │ ┌──────────────────────┐    │ │  [View Full] [Edit]      │  │
│  │ │ Type your message... │    │ │                          │  │
│  │ └──────────────────────┘    │ │                          │  │
│  └──────────────────────────────┘ └──────────────────────────┘  │
│                                                                 │
│  PRD 狀態: 📝 Drafting...         [✅ Approve PRD & Continue]  │
└─────────────────────────────────────────────────────────────────┘
```

**重點**：

- 左邊 Chat = 現在 CLI 裡的對話
- 右邊 Artifact = AI 正在撰寫的文件，渲染後的 markdown 即時預覽
- AI 完成文件後，底部出現 **Approve** 按鈕（= 現在的 phase gate）
- Approve 後 flow pipeline 自動推進到下一個節點

**跟 CLI 的差異**：

- CLI 裡文件內容混在對話輸出中，難以分辨
- UI 裡 artifact 有獨立面板，隨時可回頭看
- Gate approval 是一個明確的按鈕，不是靠打字 "approve"

### 模式 B：工作台（spec / api-spec / ui-spec / prototype）

互動較結構化：AI 分析 → 產出文件 → 審閱 → 決策。

```
┌─ vif-spec ─────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Impact Analysis ──────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Module         │ Action │ Affected Files               │    │
│  │ ─────────────── │ ────── │ ─────────────────────────── │    │
│  │  Auth Middleware │ 修改   │ src/middleware/auth.ts       │    │
│  │  Login Route    │ 新增   │ (new) src/routes/login.ts   │    │
│  │  User Schema    │ 修改   │ src/db/schema.ts            │    │
│  │  Session Store  │ 新增   │ (new) src/stores/session.ts │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Spec Preview ─────────────────────────────────────────┐    │
│  │  # spec-001: JWT Auth Migration                         │    │
│  │                                                         │    │
│  │  ## Section 2: Impact Analysis                          │    │
│  │  ...（rendered markdown）                                │    │
│  │                                                         │    │
│  │  ## Section 4: Acceptance Criteria                      │    │
│  │  - [ ] AC-1: JWT token 發行與驗證                        │    │
│  │  - [ ] AC-2: Refresh token rotation                     │    │
│  │  - [ ] AC-3: 多裝置同時登入                              │    │
│  │  ...                                                    │    │
│  │  [View Full] [Edit] [Diff from last version]            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Audit Result ─────────────────────────────────────────┐    │
│  │  spec-auditor: ✅ APPROVED                              │    │
│  │  Pass 1 (Internal): 0 issues                            │    │
│  │  Pass 2 (Completeness): 1 🟢 suggestion                 │    │
│  │  Pass 3 (External): 0 issues                            │    │
│  │  [View Full Report]                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Design Doc Expansion ─────────────────────────────────┐    │
│  │  Spec 分析結果需要以下設計文件：                          │    │
│  │                                                         │    │
│  │  [✓] API Spec — POST /auth/login, POST /auth/refresh   │    │
│  │  [✓] UI Spec — Login Page, Session Manager              │    │
│  │  [✓] DB Schema — users table 修改, sessions table 新增   │    │
│  │  [ ] Prototype — (optional)                             │    │
│  │                                                         │    │
│  │  [Start Selected Design Docs →]                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Spec 狀態: ✅ Audited       [✅ Approve Spec & Continue]      │
└─────────────────────────────────────────────────────────────────┘
```

**比 CLI 好的地方**：

- Impact Analysis 是結構化表格，不是散在對話裡的文字
- Design Doc Expansion 的選擇（全展/API only/UI only）是 checkbox，不是靠打字選
- 審計結果獨立顯示，有摺疊的完整報告
- 「Start Selected Design Docs」一鍵同時啟動 api-spec + ui-spec（平行）

### 模式 C：監控台（develop）

develop 是最複雜的——內部有 task loop、agent dispatch、feedback loop。使用者大部分時間只是在看，偶爾介入。

```
┌─ vif-develop ──────────────────────────────────────────────────┐
│                                                                 │
│  Test Strategy: Unit + Integration (from CLAUDE.md)    [Edit]  │
│  Parallel Tasks: 2                                     [Edit]  │
│                                                                 │
│  ┌─ Task Pipeline ────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Task 1: Login API endpoint                             │    │
│  │  ┌────┐ ┌────┐ ┌───────┐ ┌────────┐ ┌──────┐         │    │
│  │  │RED │→│GATE│→│ GREEN │→│REFACTOR│→│COMMIT│  ✅ Done │    │
│  │  │ ✅ │ │ ✅ │ │  ✅   │ │  ✅    │ │  ✅  │         │    │
│  │  └────┘ └────┘ └───────┘ └────────┘ └──────┘         │    │
│  │  42s      auto    1m38s    32s        auto    = 3m02s  │    │
│  │                                                         │    │
│  │  Task 2: Auth middleware                                │    │
│  │  ┌────┐ ┌────┐ ┌───────┐ ┌────────┐ ┌──────┐         │    │
│  │  │RED │→│GATE│→│ GREEN │→│REFACTOR│→│COMMIT│  ✅ Done │    │
│  │  │ ✅ │ │ ✅ │ │  ✅   │ │  ✅    │ │  ✅  │         │    │
│  │  └────┘ └────┘ └───────┘ └────────┘ └──────┘         │    │
│  │                                                         │    │
│  │  Task 3: Session store                    ← depends T1  │    │
│  │  ┌────┐ ┌────┐ ┌───────────────────┐                   │    │
│  │  │RED │→│GATE│→│ GREEN 🔄 running  │  🟢 In Progress  │    │
│  │  │ ✅ │ │ ✅ │ │  ████████░░ 2m15s │                   │    │
│  │  └────┘ └────┘ └───────────────────┘                   │    │
│  │  implementer: "adding SessionStore class..."            │    │
│  │  [View Log] [View Test] [View Diff]                     │    │
│  │                                                         │    │
│  │  Task 4: JWT validation                                 │    │
│  │  ┌──────────────────┐                                   │    │
│  │  │ RED 🔄 running   │  🟢 In Progress                  │    │
│  │  │  ████░░░░░ 48s   │                                   │    │
│  │  └──────────────────┘                                   │    │
│  │  test-writer: "writing JWT verify test..."              │    │
│  │  [View Log]                                             │    │
│  │                                                         │    │
│  │  Task 5: Rate limiter                     ← depends T3  │    │
│  │  ⏳ Queued (waiting for Task 3)                         │    │
│  │                                                         │    │
│  │  Task 6: Logout API                       ← depends T1  │    │
│  │  ⏳ Queued (waiting for slot)                           │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Progress: ██████████░░░░░░░░░░  2/6 tasks  33%               │
│                                                                 │
│  ┌─ Event Log ────────────────────────────────────────────┐    │
│  │ 10:23 task-4 test-writer dispatched (RED)               │    │
│  │ 10:22 task-3 RED→GREEN gate ✅ passed                   │    │
│  │ 10:21 task-3 test-writer done (38s)                     │    │
│  │ 10:18 task-2 committed: feat: add auth middleware       │    │
│  │ 10:15 task-2 REFACTOR done                              │    │
│  │ ...                                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Pause All] [Adjust Parallelism] [Skip to De-Sloppify]       │
└─────────────────────────────────────────────────────────────────┘
```

**使用者在這個畫面的操作**：

- **大部分時間：看**。看 task 跑到哪了、agent 在做什麼
- **偶爾介入**：Escalation 彈出 → 選處理方式（a/b/c/d）
- **可調參數**：平行數量（1~N）、要不要 pause
- **View Log**：看 agent 的完整輸出
- **View Diff**：看 agent 改了什麼

#### Escalation 在介面上的呈現

```
┌─ ⚠ Escalation: Task 3 ────────────────────────────────┐
│                                                         │
│  implementer BLOCKED (3rd attempt)                      │
│                                                         │
│  Problem:                                               │
│  SessionStore 需要 Redis 但專案只用 in-memory cache      │
│                                                         │
│  Attempted:                                             │
│  1. In-memory Map → race condition               ❌    │
│  2. LRU cache → expired tokens not cleaned       ❌    │
│  3. WeakRef approach → GC timing unpredictable   ❌    │
│                                                         │
│  ○ a. 降低需求：改用簡單 Map + TTL                      │
│  ○ b. 加入 Redis dependency                            │
│  ○ c. 標記 blocked，跳過此 task                         │
│  ○ d. 我手動處理                                        │
│                                                         │
│  💬 Additional context: ___________________________     │
│                                                         │
│                             [Submit Decision]           │
└─────────────────────────────────────────────────────────┘
```

### 模式 D：驗證台（verify / review）

Pipeline 式的結果呈現 + 決策點。

#### vif-verify

```
┌─ vif-verify ───────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Core Pipeline ────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Stage 1: Build         ✅ PASS  (3.2s)                │    │
│  │  Stage 2: Type Check    ✅ PASS  (1.8s)                │    │
│  │  Stage 3: Lint          ✅ PASS  (2 auto-fixed)         │    │
│  │    └ 🟢 unused import in src/utils.ts:3   [fixed]      │    │
│  │    └ 🟢 prefer const in src/auth.ts:42    [fixed]      │    │
│  │  Stage 4: Test Suite    ✅ PASS  (12.4s, 94% coverage) │    │
│  │  Stage 5: Diff Review   ✅ PASS  (no debug/secrets)    │    │
│  │  Stage 6: Dep Audit     ✅ PASS  (0 vulnerabilities)   │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Security Review ─────────────────────────────────────┐     │
│  │  security-reviewer: 🟢 LOW risk                        │     │
│  │  0 🔴 Critical │ 0 🟠 High │ 0 🟡 Medium │ 1 🟢 Low   │     │
│  │  └ 🟢 Low: Consider adding rate limit header            │     │
│  │  [View Full Report]                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ 🟡🟢 Findings Review ────────────────────────────────┐     │
│  │                                                        │     │
│  │  🟢 Low: Consider adding rate limit header             │     │
│  │  ● Fix  ○ Accept with reason: ___                      │     │
│  │                                                        │     │
│  │  [Apply Decisions & Continue →]                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  Verdict: ✅ PASS                                               │
└─────────────────────────────────────────────────────────────────┘
```

#### vif-review

```
┌─ vif-review ───────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Stage 1: Spec Compliance ─────────────────────────────┐    │
│  │                                                         │    │
│  │  Acceptance Criteria:                                   │    │
│  │  AC-1: JWT 發行與驗證        ✅ PASS (impl + test)     │    │
│  │  AC-2: Refresh token         ✅ PASS (impl + test)     │    │
│  │  AC-3: 多裝置同時登入        ✅ PASS (impl + test)     │    │
│  │                                                         │    │
│  │  Design Consistency:                                    │    │
│  │  API vs api-spec             ✅ PASS                    │    │
│  │  DB vs schema                ✅ PASS                    │    │
│  │  Behavior vs .feature        ✅ PASS                    │    │
│  │                                                         │    │
│  │  Stage 1 Verdict: ✅ PASS → proceeding to Stage 2      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Stage 2: Code Quality ────────────────────────────────┐    │
│  │                                                         │    │
│  │  🟡 Medium: SessionStore 的 cleanup interval 應可配置   │    │
│  │    src/stores/session.ts:28                             │    │
│  │    建議: 抽為 constructor 參數                          │    │
│  │    [View Code] ● Fix  ○ Accept: ___                    │    │
│  │                                                         │    │
│  │  🟢 Low: loginHandler 可抽出 validateCredentials       │    │
│  │    src/routes/login.ts:15-42                            │    │
│  │    [View Code] (optional, doesn't block)                │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Manual Test Checklist ────────────────────────────────┐    │
│  │  reviewer 建議以下項目需手動驗證：                        │    │
│  │  [ ] 實際瀏覽器測試 login flow (mock 了 fetch)           │    │
│  │  [ ] iOS Safari token 儲存行為 (platform-specific)      │    │
│  │  [ ] 多分頁同時登入/登出 (concurrent state)              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Apply Fixes & Re-verify] [✅ Approve Code & Continue]        │
└─────────────────────────────────────────────────────────────────┘
```

### 模式 E：核對台（close）

自動核對 + 人確認。

```
┌─ vif-close ────────────────────────────────────────────────────┐
│                                                                 │
│  Completion Checklist — spec-001: User Login                    │
│                                                                 │
│  Acceptance                                                     │
│  [✓] 所有 AC 驗收通過 (3/3)                     auto-checked  │
│  [✓] Manual tests 完成 (3/3)                     user-checked  │
│                                                                 │
│  Quality                                                        │
│  [✓] Test coverage ≥ 80% (actual: 94%)          auto-checked  │
│  [✓] 0 🔴 Critical unresolved                   auto-checked  │
│  [✓] 0 🟡 Medium unresolved (1 fixed)           auto-checked  │
│  [✓] Security review PASS                        auto-checked  │
│                                                                 │
│  Documentation                                                  │
│  [✓] progress.md 全部完成                        auto-checked  │
│  [✓] specs-overview.md 已更新                    auto-checked  │
│  [⚠] api-spec 有實作偏差                                       │
│      → login response 多了 last_login_at 欄位                  │
│      [Auto-sync to api-spec] [Ignore]                          │
│                                                                 │
│  Version Control                                                │
│  [✓] 所有變更已 commit                           auto-checked  │
│  [ ] Git tag (optional): v______                               │
│                                                                 │
│                              [✅ Close spec-001]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 六、Sidebar：Docs — Artifact Registry

```
┌─ Docs ─────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Filter: [All ▾] [spec-001 ▾] ────────────────────────┐    │
│  │                                                         │    │
│  │  📁 PRD                                                 │    │
│  │  ├ prd-001.md  ✅ approved  → spec-001, spec-002        │    │
│  │                                                         │    │
│  │  📁 Specs                                               │    │
│  │  ├ 001-user-login/                                      │    │
│  │  │ ├ spec.md      ✅ approved  ← prd-001                │    │
│  │  │ └ progress.md  🚧 67%                                │    │
│  │  ├ 002-file-upload/                                     │    │
│  │  │ ├ spec.md      🔒 pending approve                   │    │
│  │  │ └ progress.md  📋 draft                              │    │
│  │                                                         │    │
│  │  📁 API Specs                                           │    │
│  │  ├ auth/login.md      ✅ audited  ← spec-001           │    │
│  │  ├ auth/refresh.md    ✅ audited  ← spec-001           │    │
│  │  └ auth/openapi.yaml  ✅          ← spec-001           │    │
│  │                                                         │    │
│  │  📁 UI Specs                                            │    │
│  │  ├ login-page.md      ✅ audited  ← spec-001           │    │
│  │                                                         │    │
│  │  📁 Schema                                              │    │
│  │  ├ auth.md            ✅ audited  ← spec-001           │    │
│  │                                                         │    │
│  │  📁 Architecture                                        │    │
│  │  ├ adr-001-jwt-auth.md  ← arch phase                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  點擊任一文件 → 右側面板渲染 markdown preview                     │
│  每個文件顯示：狀態 + 上游來源 + 下游消費者 + 審計狀態            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 七、Sidebar：Config — CLAUDE.md 的 GUI

所有設定都寫回 CLAUDE.md — UI 是 CLAUDE.md 的視覺化編輯器，不是另一個設定來源。

```
┌─ Config ───────────────────────────────────────────────────────┐
│                                                                 │
│  Project: my-saas-app                                           │
│                                                                 │
│  ┌─ General ──────────────────────────────────────────────┐    │
│  │  Mode:     [Solo ▾]        Flow: [Tech-first ▾]        │    │
│  │  Workspace: [Monorepo ▾]                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Tech Stack ───────────────────────────────────────────┐    │
│  │  Language:    [TypeScript  ]  Framework: [Fastify    ]  │    │
│  │  Test:        [Vitest      ]  Build:     [tsup       ]  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Commands ─────────────────────────────────────────────┐    │
│  │  Build:      [npm run build      ]                      │    │
│  │  Test:       [npm test            ]                     │    │
│  │  Lint:       [npm run lint        ]                     │    │
│  │  Type Check: [npx tsc --noEmit    ]                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Test Strategy ────────────────────────────────────────┐    │
│  │  Backend: [Unit + Integration ▾]                        │    │
│  │  Frontend: [Unit + Key E2E ▾]                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ AI Cross-Review ─────────────────────────────────────┐     │
│  │  [ ] Enable                Mode: [Solo ▾]              │     │
│  │  Design review:  [codex ▾]                             │     │
│  │  Verify review:  [codex ▾]                             │     │
│  │  Code review:    [codex ▾]                             │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ Guideline Mapping ───────────────────────────────────┐     │
│  │  api-spec  → [guideline/backend/           ]           │     │
│  │  ui-spec   → [guideline/frontend/          ]           │     │
│  │  testing   → [guideline/testing/            ]          │     │
│  │  [+ Add mapping]                                       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ Verify Options ──────────────────────────────────────┐     │
│  │  [ ] Code Quality (uses /simplify)                     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  Changes will update .claude/CLAUDE.md    [Save] [Reset]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 八、對現有 Skills 需要的調整

要讓介面能運作，現有 skill 需要做的改動：

| 調整 | 說明 | 影響範圍 |
|------|------|---------|
| **結構化 output** | Skill 執行時 emit 結構化事件（step 開始/完成、artifact 產出、gate 到達） | 所有 skill |
| **Dispatch 回調** | Agent 完成時回報結構化 status（不只是文字） | develop, verify, review |
| **Gate 標準化** | Gate 條件提取為可程式化檢查（不只是 prose） | phase-gates.md → gate-definitions.yaml |
| **Progress 結構化** | progress.md 加 frontmatter 讓 parser 容易解析（或改用 YAML section） | progress.md template |
| **Step 拆分** | 每個 skill 的 step 可獨立啟動/暫停（目前是一路跑到底） | 需要 skill engine 支持 |

---

## 九、跟 Vibe Kanban 的核心差異

| 面向 | Vibe Kanban | VIF Console |
|------|-------------|-------------|
| **本質** | 通用任務管理 + agent launcher | 結構化開發流程的操作介面 |
| **使用者角色** | 寫 prompt 指揮 agent | 審核者 — AI 做事，人做決定 |
| **流程意識** | 無（使用者自己決定順序） | 完整 SDLC，每步都知道上下文 |
| **Chat** | 每個 workspace 一個 chat | 只在探索型 skill（Phase 0）有 chat |
| **自動化程度** | 人啟動每一步 | Gate pass 後自動推進 |
| **品質保證** | 無內建 | TDD + spec-auditor + reviewer 內建 |
| **資料儲存** | SQLite DB | Markdown 文件 = Source of Truth |
