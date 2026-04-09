# VIF Console — AI Development Governance Framework

> 一套以 SDLC 階段為主軸的流程框架，協助使用者治理 AI、應用在專案開發上。
> 提供多專案、多人協作、跨裝置的操作介面，並能驅動本地與遠端 Agent。

---

## 一、定位與核心理念

### 我們提供的是什麼

**一套流程框架，讓人治理 AI 的開發行為。**

- 使用者看到的是 SDLC 階段與專案產出物，不是 skill 名稱
- 每個階段都有 AI & Skill 在背後協助
- 14 種文件模板有預設版本，使用者可上傳自訂版
- 支援多專案、多人協作、Remote Agent 驅動

### 不是什麼

| ❌ 不是 | ✅ 而是 |
|---------|---------|
| 把 14 個 skill 搬上網頁 | 以 SDLC 6 階段為導覽，Skill 是背後的能力模組 |
| CLI 的替代介面 | 獨立的專案治理平台 |
| 另一個 Kanban 工具 | 結構化的 AI 開發生命週期管理 |
| 只能本機使用的 Dashboard | 可部署的服務，支援多人、多專案、遠端 Agent |

### 跟 Vibe Kanban 的定位差異

| 面向 | Vibe Kanban | VIF Console |
|------|-------------|-------------|
| 本質 | AI Agent 工作管理工具 | AI 開發治理框架 |
| 核心抽象 | Issue → Agent → PR | SDLC Phase → Artifact → Gate |
| 使用者看到 | Kanban board + agent sessions | SDLC 階段 + 專案產出物全覽 |
| 流程 | 無（使用者自行決定） | 完整 SDLC 框架（可自訂模板） |
| 品質保證 | 無內建 | TDD + Audit + Review 內建 |
| 模板 | 無 | 14 種文件模板，可自訂 |
| 規範注入 | 無 | Guideline 自動注入 Agent |
| 協作 | 單機或付費雲端 | Solo / Team / Enterprise 三種部署 |
| 資料 | SQLite（已知 lock 問題） | PostgreSQL（Team）/ SQLite（Solo） |
| Agent 驅動 | 只有本地 | 本地 + Remote Agent |
| 安全 | YOLO mode 預設 | Phase Gate + Human Approval |

---

## 二、系統架構

### 架構總覽

```
┌─────────────────────────────────────────────────────────────┐
│                       VIF Console                            │
│                                                              │
│  ┌─ Web UI (任何裝置) ───────────────────────────────────┐  │
│  │  Dashboard │ Library │ Templates │ Settings              │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                           │ REST + WebSocket                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │  API Server (Node.js / Bun)                            │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Project    │  │ Flow         │  │ Agent        │  │  │
│  │  │ Service    │  │ Engine       │  │ Runtime      │  │  │
│  │  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘  │  │
│  │        │                │                  │          │  │
│  │  ┌─────▼────────────────▼──────────────────▼───────┐  │  │
│  │  │              Database                            │  │  │
│  │  │     PostgreSQL (Team) / SQLite (Solo)            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│           │                │                  │               │
│  ┌────────▼─────┐  ┌──────▼──────────────────▼───────────┐  │
│  │  Git Repos   │  │  Agent Runtime (Multi-Provider)     │  │
│  │  (MD Sync)   │  │                                     │  │
│  │              │  │  ┌──────────┐ ┌──────┐ ┌─────────┐ │  │
│  │  • monorepo  │  │  │ Claude   │ │Codex │ │Copilot  │ │  │
│  │  • docs repo │  │  │ Code SDK │ │ SDK  │ │  SDK    │ │  │
│  │  • code repos│  │  │ 訂閱 auth│ │訂閱  │ │ 訂閱    │ │  │
│  │              │  │  └──────────┘ └──────┘ └─────────┘ │  │
│  │              │  │  ┌──────────┐ ┌──────────────────┐ │  │
│  │              │  │  │ Gemini   │ │ Direct API       │ │  │
│  │              │  │  │ CLI SDK  │ │ (API Key 計費)   │ │  │
│  │              │  │  │ 免費 auth│ │ Anthropic/OpenAI │ │  │
│  │              │  │  └──────────┘ └──────────────────┘ │  │
│  └──────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 三個連接點

| 連接 | 協議 | 說明 |
|------|------|------|
| UI ↔ Server | REST + WebSocket | Web UI 操作一切，WebSocket 推送即時狀態 + Agent 輸出串流 |
| Server ↔ Git Repos | Git CLI / Webhook | 同步 markdown 文件，偵測變更 |
| Server ↔ Agent SDK | 各 SDK 原生協議 | 透過 SDK 程式化控制 Agent，管理 conversation state |

### Agent Runtime：直接用 SDK，不包 CLI

Console Server 不是 spawn CLI process 再 pipe stdin/stdout（脆弱、各 CLI 格式不一），而是**直接透過 SDK 程式化驅動 Agent**。Server 自己管理 conversation state、代理 tool 執行、串流輸出到 UI。

```
❌ 之前的想法（CLI 包裝）：Server → spawn CLI → pipe stdin/stdout → 脆弱
✅ 正確做法（SDK 直接驅動）：Server → 呼叫 SDK → 管理 conversation → 完全可控
```

這樣做的好處：

| 能力 | CLI 包裝 | SDK 直接驅動 |
|------|---------|-------------|
| 使用者 Chat 即時介入 | ⚠️ 各 CLI 支援不一 | ✅ append to messages，100% 可控 |
| Output 串流 | ⚠️ stdout 格式各異 | ✅ SDK stream event，標準格式 |
| 多 Provider 支援 | ❌ 每個 CLI 各寫整合 | ✅ 統一 AgentProvider interface |
| Remote Agent | ❌ CLI 只能本機 | ✅ API/SDK 天生支援遠端 |
| 權限控制 | ❌ CLI 有完整系統存取 | ✅ Server 代理 tool，可限制 scope |
| 穩定性 | ⚠️ CLI 更新可能 break | ✅ SDK/API 向後相容 |
| 訂閱方案 | ✅ 走訂閱 | ✅ SDK 同樣走訂閱（見下方） |

### 四大 AI Coding Agent SDK

所有主流 AI Coding Agent 都提供 SDK，且都支援訂閱方案（不需要額外付 API 費用）：

| | Claude Code | Codex | Copilot | Gemini CLI |
|--|-------------|-------|---------|------------|
| **SDK** | `@anthropic-ai/claude-code` | `@openai/codex` | `github/copilot-sdk` | `@google/gemini-cli-sdk` |
| **SDK 語言** | TypeScript | TypeScript | Node/Python/Go/.NET/Java | TypeScript |
| **訂閱可用** | ✅ Pro/Max/Max+ | ✅ ChatGPT Plus/Pro/Biz | ✅ Copilot Free/Pro/Pro+/Biz | ✅ Google 帳號免費 |
| **API Key 可用** | ✅ Anthropic API | ✅ OpenAI API | ✅ BYOK（多家） | ✅ Google AI Studio |
| **Streaming** | ✅ | ✅ JSONL events | ✅ | ✅ onActivity callback |
| **Session 管理** | ✅ | ✅ | ✅ multi-turn | ✅ SessionContext |
| **Tool Use** | ✅ | ✅ | ✅ function tools | ✅ tool registries |
| **Chat 注入** | ✅ | ✅ | ✅ | ✅ |

計費細節：

| Provider | 訂閱方案 | 月費 | SDK 走訂閱 |
|----------|---------|------|:---:|
| Claude | Pro / Max / Max+ | $20 / $100 / $200 | ✅ |
| Codex | ChatGPT Plus / Pro / Biz | $20 / $200 / $25/user | ✅ 走 plan 額度 |
| Copilot | Free / Pro / Pro+ / Biz | $0 / $10 / $39 / $19/user | ✅ 走 seat 額度 |
| Gemini | Google 個人帳號 | **免費**（60 req/min） | ✅ |

### 統一 AgentProvider Interface

四家 SDK 風格不同但能力一致，Console 透過統一 interface 封裝：

```typescript
interface AgentProvider {
  readonly name: string;        // "claude" | "codex" | "copilot" | "gemini"
  readonly authType: "subscription" | "api-key" | "free";

  createSession(config: {
    systemPrompt: string;       // skill prompt（SKILL.md 內容）
    tools: ToolDefinition[];    // read, write, bash, glob, grep, git
    model?: string;             // opus, sonnet, codex, gemini-2.5-pro, ...
  }): Promise<AgentSession>;
}

interface AgentSession {
  // 核心操作
  sendMessage(content: string): Promise<void>;
  stream(): AsyncIterable<StreamEvent>;

  // 使用者 Chat 介入（從 UI 注入訊息）
  injectMessage(content: string): Promise<void>;

  // 控制
  pause(): void;
  resume(): void;
  stop(): void;

  // 狀態
  getMessages(): Message[];
  isRunning(): boolean;
}

// 四個 Provider 實作
class ClaudeProvider implements AgentProvider  { /* @anthropic-ai/claude-code */ }
class CodexProvider implements AgentProvider   { /* @openai/codex */ }
class CopilotProvider implements AgentProvider { /* github/copilot-sdk */ }
class GeminiProvider implements AgentProvider  { /* @google/gemini-cli-sdk */ }
```

使用者可在 Settings 自由選擇每個 agent 用哪個 Provider（見八、Settings），甚至混搭使用。

### 部署模式

| 模式 | DB | 適用 | 說明 |
|------|-----|------|------|
| **Solo** | SQLite | 個人開發者 | 本機跑 Console，連接本地 repo |
| **Team** | PostgreSQL | 小團隊 | 部署到雲端，多人登入共享狀態 |
| **Enterprise** | PostgreSQL + SSO | 企業團隊 | 企業內網部署，權限控管、審計紀錄 |

---

## 三、SDLC 階段架構

使用者看到的是 6 個 SDLC 階段，不是 14 個 skill：

```
Phase 0             Phase 1             Phase 2
Exploration         Specification       Development
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ PRD          │    │ Spec         │    │ TDD Loop     │
│ Architecture │    │ API Spec     │    │  RED→GREEN   │
│ UI/UX Design │    │ UI Spec      │    │  →REFACTOR   │
│ BDD          │    │ DB Schema    │    │              │
│ Prototype    │    │ OpenAPI      │    │              │
└──────────────┘    └──────────────┘    └──────────────┘

Phase 3             Phase 4             Phase 5
Verification        Review              Closure
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Build        │    │ Spec         │    │ Doc Sync     │
│ Type Check   │    │ Compliance   │    │ Checklist    │
│ Lint         │    │ Code Quality │    │ Overview     │
│ Test Suite   │    │ Manual Test  │    │ Update       │
│ Security     │    │ Plan         │    │              │
│ Dep Audit    │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

每個階段背後由對應的 VIF Skill 驅動，但使用者不需要知道 skill 名稱。

### 階段與 Skill 的對應

| SDLC 階段 | 背後的 Skill | 使用者看到的 |
|-----------|-------------|------------|
| Exploration | vif-prd, vif-arch, vif-uiux, vif-bdd, vif-prototype | 「寫 PRD」「做架構決策」「看原型」 |
| Specification | vif-spec, vif-api-spec, vif-ui-spec | 「寫規格」「撰寫 API 設計」 |
| Development | vif-develop | 「開發中，Task 3/6 完成」 |
| Verification | vif-verify | 「跑驗證 Pipeline」 |
| Review | vif-review | 「程式碼審查中」 |
| Closure | vif-close | 「收尾核對」 |

---

## 四、三種互動模式

分析 14 個 skill 的所有 step，使用者的互動本質上只有三種。UI 根據當前步驟自動切換，使用者不需要手動選擇。

### 模式分佈

| 模式 | 出現場景 | 佔比 | UI 元素 |
|------|---------|------|---------|
| **對話** | Phase 0 探索（PRD、Arch、UIUX、BDD） | ~15% | Chat + Artifact 即時預覽 |
| **自動執行 + 監控** | Phase 1 產出、Phase 2 開發、Phase 3 驗證 | ~63% | 進度條 + Agent 狀態 + Log |
| **決策** | 各階段 Gate（approve、WARN、escalation） | ~22% | 結構化表單 + 按鈕 |

### 每個 Skill 的 Step 模式標注

`[A]` = 對話 / `[B]` = 自動執行 / `[C]` = 決策

#### vif-prd

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Pre-check（掃描既有 PRD/spec） | [B] 自動 |
| 2 | Problem Exploration（人機對話） | [A] 對話 |
| 3 | Draft PRD（產出文件） | [B] 自動 |
| 4 | Deliver & Approve | [C] 決策：approve PRD |
| 5 | Expand specs-overview | [C] 決策：確認 spec 清單 |
| 6 | Commit | [B] 自動 |

#### vif-arch

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Pre-check | [B] 自動 |
| 2 | Tech Discussion | [A] 對話 |
| 3 | Write ADR | [B] 自動 |
| 4 | Update CLAUDE.md | [B] 自動 |
| 5 | Confirm | [C] 決策 |

#### vif-uiux

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Intent First | [A] 對話 |
| 2 | Domain Exploration | [A] 對話 + [C] 方向確認 |
| 3 | Design Decisions | [A] 對話（逐項） |
| 4 | Quality Testing | [C] 測試結果確認 |
| 5 | Record | [B] 自動 |

#### vif-bdd

| Step | 名稱 | 模式 |
|------|------|------|
| 0 | Three-Perspective | [A] 對話 |
| 1 | Example Mapping | [A] 對話 + [C] 解 🔴 Question |
| 2 | Write .feature | [B] 自動 + [C] 確認 |

#### vif-spec

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Impact Analysis | [B] 自動 |
| 2 | Write spec.md | [B] 自動 |
| 3 | Build progress.md | [B] 自動 |
| 4 | Choose Expansion | [C] 選擇展開方向 |
| 5a | spec-auditor | [B] dispatch agent |
| 5b | Self-reflection | [B] 自動 |
| 5c | Human review | [C] approve spec |
| 6 | Commit | [B] 自動 |

#### vif-api-spec / vif-ui-spec

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Input & Impact | [B] 自動 |
| 2-4 | Write docs | [B] 自動 |
| 5 | Self-Review (auditor) | [B] dispatch agent |
| 6 | Confirm | [C] 決策 |
| 7 | Commit | [B] 自動 |

#### vif-develop

| Step | 名稱 | 模式 |
|------|------|------|
| 0 | Entry Gate | [B] 自動檢查 |
| 1 | Test Strategy | [C] 確認策略 |
| 2 | Guideline Injection | [B] 自動 |
| 3 | Core Loop (per task) | — |
| ∟ 3a | RED | [B] dispatch test-writer |
| ∟ 3b | RED→GREEN Gate | [B] 自動檢查 |
| ∟ 3c | GREEN | [B] dispatch implementer |
| ∟ 3d | Feedback Loop | [B] 自動 / [C] escalation |
| ∟ 3e | REFACTOR | [B] 自動 |
| ∟ 3f | Verify | [B] 自動 |
| ∟ 3g | Update progress | [B] 自動 |
| ∟ 3h | Commit | [B] 自動 |
| 4 | De-Sloppify | [B] 自動 |
| 5 | Exit Check | [B] 自動 |

#### vif-verify

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Core Stages 1-6 | [B] dispatch verifier |
| 2 | Security Review | [B] dispatch security-reviewer |
| 3 | Code Quality (optional) | [B] 自動 |
| 4 | WARN Evaluation | [C] per WARN item |
| 5 | Report | [B] 自動 |
| 6 | Commit | [B] 自動 |

#### vif-review

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Stage 1 + 2 | [B] dispatch reviewer |
| 2 | Feedback | [B] report 產出 |
| 3 | Manual Test Checklist | [B] 自動產出 |
| 4 | Issue Resolution | [C] per 🟡 item |
| 5 | Human Approve | [C] approve code |
| 6 | Commit | [B] 自動 |

#### vif-close

| Step | 名稱 | 模式 |
|------|------|------|
| 1 | Design Doc Sync | [B] 自動 + [C] 決策 |
| 2 | Completion Checklist | [B] 自動檢查 |
| 3 | Updates | [B] 自動 |
| 4 | Commit | [B] 自動 |

---

## 五、Database Schema

### 資料模型總覽

```
User ──┐
       ├──▶ ProjectMember ◀── Project
       │                        │
       │              ┌─────────┼──────────────┐
       │              ▼         ▼              ▼
       │         Repo      Template       Feature
       │                                    │
       │                    ┌───────────────┼───────────┐
       │                    ▼               ▼           ▼
       │              Document           Task         Gate
       │                                    │
       │                                    ▼
       └─────────────────────────────▶  Session
```

### Table 說明

| Table | 說明 | 量級 |
|-------|------|------|
| **User** | 使用者帳號 | ~10s |
| **Project** | 專案（支援多專案） | ~10s |
| **ProjectMember** | 專案成員（誰參與哪個專案） | ~100s |
| **Repo** | Git repo 連接（支援 multi-repo） | 每專案 1~3 |
| **Template** | 文件模板設定（default / custom） | 每專案 ~14 |
| **Feature** | 功能 = Spec = SDLC 流程主體 | 每專案 ~10s |
| **Document** | 所有產出物索引 | 每專案 ~100s |
| **Task** | Feature 內的開發任務 + TDD 紀錄 | 每 Feature ~5-10 |
| **Session** | Agent 執行紀錄 | 每 Task ~2-4 |
| **Gate** | 人工決策紀錄 | 每 Feature ~5-10 |

### Schema 定義

```sql
-- ─── 使用者與專案 ───────────────────────────────

CREATE TABLE users (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE projects (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  mode        TEXT NOT NULL DEFAULT 'solo',       -- solo | team
  flow        TEXT NOT NULL DEFAULT 'tech-first', -- tech-first | product-first
  workspace   TEXT NOT NULL DEFAULT 'monorepo',   -- monorepo | multi-repo
  settings    JSONB DEFAULT '{}',                 -- CLAUDE.md 的結構化版本
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_members (
  project_id  UUID REFERENCES projects(id),
  user_id     UUID REFERENCES users(id),
  role        TEXT NOT NULL DEFAULT 'member',     -- owner | member
  joined_at   TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- ─── Git Repo 連接 ──────────────────────────────

CREATE TABLE repos (
  id          UUID PRIMARY KEY,
  project_id  UUID REFERENCES projects(id),
  role        TEXT NOT NULL,                      -- docs | frontend | backend | monorepo
  url         TEXT,                               -- git remote URL (team/enterprise)
  local_path  TEXT,                               -- 本機路徑（solo 模式）
  branch      TEXT DEFAULT 'main',
  last_synced TIMESTAMPTZ
);

-- ─── 文件模板 ───────────────────────────────────

CREATE TABLE templates (
  id          UUID PRIMARY KEY,
  project_id  UUID REFERENCES projects(id),
  type        TEXT NOT NULL,                      -- prd | spec | progress | api-spec
                                                  -- | schema | ui-spec | adr
                                                  -- | ui-guideline | feature
                                                  -- | verify-report | review-report
                                                  -- | close-checklist
  source      TEXT NOT NULL DEFAULT 'default',    -- default | custom
  content     TEXT,                               -- custom 時存模板內容
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, type)
);

-- ─── Feature（= Spec = SDLC 流程主體）──────────

CREATE TABLE features (
  id            UUID PRIMARY KEY,
  project_id    UUID REFERENCES projects(id),
  spec_number   INT NOT NULL,                     -- 001, 002, ...
  name          TEXT NOT NULL,
  prd_doc_id    UUID REFERENCES documents(id),
  flow_template TEXT DEFAULT 'solo-tech-first',   -- 使用的流程模板
  phase         TEXT NOT NULL DEFAULT 'exploration',
                                                  -- exploration | specification
                                                  -- | development | verification
                                                  -- | review | closure | done
  phase_detail  TEXT,                             -- "task-3 GREEN running"
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  closed_at     TIMESTAMPTZ,
  UNIQUE(project_id, spec_number)
);

-- ─── Document（產出物索引）──────────────────────

CREATE TABLE documents (
  id            UUID PRIMARY KEY,
  project_id    UUID REFERENCES projects(id),
  feature_id    UUID REFERENCES features(id),     -- nullable（ADR/Guideline 不屬於特定 feature）
  repo_id       UUID REFERENCES repos(id),
  type          TEXT NOT NULL,                    -- prd | spec | progress | api-spec
                                                  -- | ui-spec | schema | openapi
                                                  -- | adr | guideline | feature
  path          TEXT NOT NULL,                    -- Git 內的相對路徑
  title         TEXT,
  status        TEXT DEFAULT 'draft',             -- draft | approved | audited
                                                  -- | implemented | done
  frontmatter   JSONB DEFAULT '{}',               -- 從 markdown 解析的 YAML frontmatter
  audit_passes  INT[] DEFAULT '{}',               -- [1, 2] = Pass 1+2 通過
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Task（開發任務 + TDD 紀錄）─────────────────

CREATE TABLE tasks (
  id                  UUID PRIMARY KEY,
  feature_id          UUID REFERENCES features(id),
  task_number         INT NOT NULL,
  name                TEXT NOT NULL,
  spec_ref            TEXT,                       -- 對應的設計文件 path
  feature_ref         TEXT,                       -- 對應的 .feature scenario ref
  depends_on          INT[] DEFAULT '{}',         -- [1, 2] = depends on task-1, task-2
  status              TEXT DEFAULT 'pending',     -- pending | queued | running
                                                  -- | done | blocked | skipped

  -- TDD RED 紀錄
  red_session_id      UUID REFERENCES sessions(id),
  red_test_file       TEXT,
  red_duration_sec    INT,
  red_status          TEXT,                       -- valid | invalid

  -- TDD GREEN 紀錄
  green_session_id    UUID REFERENCES sessions(id),
  green_impl_files    TEXT[],
  green_duration_sec  INT,
  green_status        TEXT,                       -- done | done_with_concerns
                                                  -- | needs_context | blocked

  -- REFACTOR 紀錄
  refactor_duration_sec INT,
  refactor_changes    TEXT[],

  -- Commit
  commit_message      TEXT,
  commit_sha          TEXT,

  sort_order          FLOAT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ─── Session（Agent 執行紀錄）───────────────────

CREATE TABLE sessions (
  id                UUID PRIMARY KEY,
  project_id        UUID REFERENCES projects(id),
  feature_id        UUID REFERENCES features(id),
  task_id           UUID REFERENCES tasks(id),    -- nullable（auditor 不屬於 task）
  agent             TEXT NOT NULL,                -- test-writer | implementer
                                                  -- | spec-auditor | reviewer
                                                  -- | verifier | security-reviewer
  stage             TEXT,                         -- red | green | design-review
                                                  -- | cross-check | verify
                                                  -- | security | review
  status            TEXT DEFAULT 'queued',        -- queued | running | completed
                                                  -- | failed | killed
  model             TEXT,                         -- opus | sonnet | haiku
  is_remote         BOOLEAN DEFAULT false,        -- 本地 or 遠端 Agent
  provider          TEXT,                          -- claude | codex | copilot | gemini
  auth_type         TEXT DEFAULT 'subscription',  -- subscription | api-key | free
  dispatch_context  JSONB,                        -- dispatch contract 完整內容
  result            JSONB,                        -- agent 回傳的結構化結果
  messages          JSONB DEFAULT '[]',           -- 完整 conversation log
                                                  -- [{role, content, timestamp, source}]
                                                  -- source: system | dispatch | agent
                                                  --       | user_chat | tool_use | tool_result
  interventions     INT DEFAULT 0,                -- 使用者 Chat 介入次數
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  duration_sec      INT
);

-- ─── Gate（決策紀錄）────────────────────────────

CREATE TABLE gates (
  id            UUID PRIMARY KEY,
  project_id    UUID REFERENCES projects(id),
  feature_id    UUID REFERENCES features(id),
  task_id       UUID REFERENCES tasks(id),        -- nullable
  type          TEXT NOT NULL,                    -- phase-gate | escalation
                                                  -- | warn-decision | issue-decision
  gate_name     TEXT NOT NULL,                    -- prd-approve | spec-approve
                                                  -- | design-complete | red-green
                                                  -- | verify-pass | review-approve
  status        TEXT DEFAULT 'pending',           -- pending | decided
  decision      TEXT,                             -- approved | rejected
                                                  -- | option-a/b/c/d
                                                  -- | fix | accept
  note          TEXT,
  options       JSONB,                            -- escalation 選項
  items         JSONB,                            -- warn/issue 逐項決策
  decided_by    UUID REFERENCES users(id),
  decided_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Flow Templates ─────────────────────────────

CREATE TABLE flow_templates (
  id            UUID PRIMARY KEY,
  project_id    UUID REFERENCES projects(id),     -- nullable = 全域模板
  name          TEXT NOT NULL,
  source        TEXT DEFAULT 'default',           -- default | custom
  definition    JSONB NOT NULL,                   -- 流程定義（phases, skip, parallel）
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

### 資料量估算

| 專案規模 | Features | Documents | Tasks | Sessions | Gates | 合計 |
|---------|----------|-----------|-------|----------|-------|------|
| 小（個人） | ~5 | ~50 | ~30 | ~80 | ~30 | ~200 筆 |
| 中（團隊） | ~20 | ~200 | ~120 | ~300 | ~100 | ~800 筆 |
| 大（企業） | ~50 | ~500 | ~300 | ~800 | ~250 | ~2000 筆 |

**資料量極小**，不需要分片、不需要 cache 層、不需要複雜的查詢優化。

---

## 六、Markdown 文件同步策略

### 角色分工

| | DB | Markdown |
|--|-----|---------|
| 狀態追蹤 | ✅ Primary | Snapshot（progress.md 等仍然產出，但 DB 是主要查詢來源） |
| 文件內容 | ❌ 不存 | ✅ Source of Truth |
| 查詢 | ✅ SQL query | ❌ 需 glob + parse |
| 跨專案 | ✅ JOIN | ❌ 不可能 |
| 歷史紀錄 | ✅ sessions, gates | Git log |
| 協作 | ✅ 多人共享 | Git 協作 |

### 同步方向

```
方向一：AI 產出文件
  Server dispatch Agent
    → Agent 寫 markdown 到 Git repo
    → Server 偵測變更（webhook / polling / file watch）
    → 解析 frontmatter → 更新 DB documents
    → WebSocket 推送 → UI 刷新

方向二：UI 操作
  使用者在 UI approve gate
    → 更新 DB (gates, features.phase)
    → 通知 Agent 繼續下一步
    → Agent 寫 markdown
    → 偵測 → 更新 DB → UI 刷新

方向三：首次匯入
  使用者在 Console 連結 Git repo
    → Server 掃描 docs/ 目錄
    → 解析所有 markdown 的 frontmatter
    → 建立 documents 索引
    → 解析 specs-overview.md → 建立 features
    → 解析 progress.md → 建立 tasks

方向四：手動改 markdown
  使用者直接在 IDE/editor 改 markdown
    → Git push → webhook 觸發
    → Server 重新解析受影響的檔案
    → 更新 DB → UI 刷新
```

### specs-overview.md 與 progress.md 的角色

| 文件 | 之前的角色 | 之後的角色 |
|------|-----------|-----------|
| specs-overview.md | 唯一的 spec 追蹤來源 | DB 是主要來源，此檔案是「人可讀的快照」，AI 仍會更新它 |
| progress.md | 唯一的 task 追蹤來源 | DB 是主要來源，此檔案保留作為 Git 可追蹤的紀錄 |

**不廢棄這些文件**——它們仍然有價值（Git blame、人可讀、離線查看），但不再是查詢的入口。

---

## 七、Agent 驅動模型

### SDK-Based Agent Runtime

Console Server 透過各家 SDK 直接驅動 Agent，自己管理 conversation state 和 tool 執行。不是 spawn CLI process。

```
┌─────────────────────────────────────────────────────────────┐
│  Agent Runtime                                               │
│                                                              │
│  ┌─ Conversation State（Server 管理）────────────────────┐  │
│  │                                                        │  │
│  │  [system] Skill prompt（SKILL.md 載入）                 │  │
│  │  [user]   Dispatch context（task_id, spec_ref, ...）    │  │
│  │  [assistant] "Reading test file..."     ← stream 到 UI │  │
│  │  [tool_use] read("test/session.test.ts")               │  │
│  │  [tool_result] "..."                   ← Server 代理   │  │
│  │  [assistant] "Writing implementation..."← stream 到 UI │  │
│  │  [user] "改用 Redis，不要 Map"         ← 使用者 Chat   │  │
│  │  [assistant] "了解，改用 Redis..."     ← stream 到 UI │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Tool Proxy（Server 代理執行）────────────────────────┐  │
│  │                                                        │  │
│  │  Agent 透過 SDK 發出 tool_use                          │  │
│  │    → Server 收到                                      │  │
│  │    → 驗證權限（scope, allowlist/blocklist）            │  │
│  │    → 在目標 repo 執行（本地 or SSH to remote）         │  │
│  │    → 回傳 tool_result 給 SDK                          │  │
│  │    → Agent 繼續                                       │  │
│  │                                                        │  │
│  │  權限控制範例：                                         │  │
│  │  ✅ bash: npm test         → 允許（test command）      │  │
│  │  ⚠️ bash: git push --force → 需 UI 確認（destructive） │  │
│  │  ❌ write: /etc/passwd     → 拒絕（out of scope）      │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Available Tools ─────────────────────────────────────┐  │
│  │  read, write, edit     限定 repo scope                 │  │
│  │  bash                  allowlist / blocklist            │  │
│  │  glob, grep            限定 repo scope                 │  │
│  │  git                   危險操作需 UI 確認               │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 執行流程

```
使用者在 UI 點「Start Development」
  │
  ▼
Flow Engine 讀取 feature.tasks
  → 找到 ready tasks（依賴已滿足）
  → 尊重 parallel_tasks 上限
  │
  ▼
For each ready task:
  │
  ├─ 建立 DB Session（status: queued）
  ├─ 準備 dispatch_context（spec_ref, guideline, workspace）
  ├─ 查詢 agent 設定（哪個 Provider、哪個 model、auth 方式）
  │
  ├─ 透過 AgentProvider.createSession() 建立 SDK session
  │    → 注入 skill prompt 為 system message
  │    → 注入 dispatch context 為第一條 user message
  │    → 更新 DB Session（status: running）
  │    → WebSocket 通知 UI
  │
  ├─ session.stream() 串流執行
  │    → output events → WebSocket → UI Live Output
  │    → tool_use events → Tool Proxy 代理執行 → tool_result 回傳
  │    → 使用者從 UI 輸入 Chat → session.injectMessage() → Agent 收到
  │
  ├─ Agent 完成
  │    → 解析 result（status code, artifacts）
  │    → 更新 DB Session（status: completed, result, messages）
  │    → 更新 DB Task（red/green/refactor 紀錄）
  │    → 更新 DB Feature（phase_detail）
  │    → WebSocket 推送 UI
  │
  └─ Flow Engine 判斷下一步
       → Gate 自動通過？→ dispatch 下一個 agent
       → Gate 需要人？→ 建立 Gate（status: pending）→ UI 提示
       → 全部完成？→ 推進 feature.phase
```

### Provider 選擇邏輯

```
每個 Agent role（test-writer, implementer, ...）
  → 查 DB settings: 用哪個 Provider？
  → 查 Provider auth: subscription or API Key？
  │
  ├─ subscription → SDK 用使用者的訂閱帳號 auth
  │                 不產生額外費用
  │
  └─ api-key → SDK 用 API Key auth
               按 token 計費
```

使用者可以混搭，例如：
- 主力開發用 Claude（訂閱）
- Cross-review 用 Gemini（免費）
- CI/CD 環境用 API Key（無人模式）

### Agent 互動 API

Console Server 對 UI 暴露的 WebSocket API：

```
── UI → Server ──

agent:send_message
  { session_id, content }
  → 呼叫 session.injectMessage(content)
  → Agent 在下一輪 API call 收到新 context

agent:pause
  { session_id }
  → 暫停 SDK session（hold 下一輪 call）

agent:resume
  { session_id }
  → 恢復 SDK session

agent:stop
  { session_id }
  → 終止 SDK session
  → 更新 DB Session（status: killed）

── Server → UI ──

agent:output
  { session_id, event }
  → SDK stream event（text token / tool_use / tool_result）

agent:status_change
  { session_id, status, detail }
  → Agent 狀態變更（running → completed / failed）

agent:approval_request
  { session_id, tool_name, input }
  → Agent 呼叫了需要確認的 tool（如 git push）
  → UI 顯示確認對話框
```

---

## 七之一、Agent 即時互動模型

使用者在 Web UI 可以即時觀察 Agent 執行過程，並透過 Chat 介入調整方向。

### 互動畫面

```
┌─ Task 3: Session Store — GREEN Stage ──────────────────────────┐
│                                                                 │
│  Agent: implementer    Provider: Claude (subscription)          │
│  Model: sonnet         Runtime: 2m 15s                         │
│                                                                 │
│  ┌─ Live Output ───────────────────────────────────────────┐   │
│  │                                                          │   │
│  │ > Reading failing test: test/auth/session.test.ts        │   │
│  │ > Test expects: createSession({userId}) → {token, exp}   │   │
│  │ > Scanning existing code for session patterns...         │   │
│  │ > Found: src/middleware/auth.ts uses express-session      │   │
│  │ > Writing minimal implementation...                      │   │
│  │ > Adding SessionStore class with in-memory Map...        │   │
│  │                                                          │   │
│  │ ┌─ File: src/services/session.ts (新建) ──────────────┐ │   │
│  │ │ export class SessionStore {                          │ │   │
│  │ │   private sessions = new Map<string, Session>();     │ │   │
│  │ │   ...                                               │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  │ > Running target test... ✅ 3/3 pass                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Chat ──────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │ 👤 不要用 in-memory Map，用 Redis。                      │   │
│  │   專案已有 ioredis，設定在 src/config/redis.ts           │   │
│  │                                                          │   │
│  │ 🤖 了解，改用 Redis。讀取 redis.ts 設定中...             │   │
│  │   > Reading src/config/redis.ts...                       │   │
│  │   > Found RedisClient singleton with connection pool     │   │
│  │   > Rewriting SessionStore to use Redis...               │   │
│  │                                                          │   │
│  │ ┌──────────────────────────────────────────────────┐    │   │
│  │ │ Type message...                          [Send] │    │   │
│  │ └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [⏸ Pause] [⏹ Stop] [📋 Full Log]                              │
└─────────────────────────────────────────────────────────────────┘
```

### 五種介入層級

| 層級 | 動作 | UI 元素 | 說明 |
|------|------|---------|------|
| **觀察** | 純看 | Live Output | 大部分時間 |
| **補充** | 提供額外 context | Chat | 「這個 API 還要支援分頁」 |
| **修正** | 改變方向 | Chat | 「不要用 Map，改用 Redis」 |
| **決策** | Gate / Escalation | 結構化按鈕 | approve / 選選項 |
| **中斷** | 暫停或停止 | Pause / Stop | 「先停，我要重想」 |

### 各 SDLC 階段的 Chat 角色

| SDLC Phase | 主介面 | Chat 角色 |
|------------|--------|----------|
| Exploration (Phase 0) | Chat 為主 + Preview | **主要互動方式** — 來回對話探索需求 |
| Specification (Phase 1) | 工作台 + Output | **補充/修正** — AI 撰寫設計文件時偶爾介入 |
| Development (Phase 2) | 監控台 + Output + Chat | **修正/補充** — Agent 開發時需要時介入 |
| Verification (Phase 3) | Pipeline 結果 | **極少** — Pipeline 自動跑完 |
| Review (Phase 4) | 報告 + 決策按鈕 | **反饋** — 解釋決策理由 |

### Session 紀錄

每個 Agent Session 的完整對話紀錄存入 DB，事後可回看：

```sql
-- sessions table 包含 messages 欄位
messages    JSONB DEFAULT '[]'
-- 格式: [{role, content, timestamp, source}]
-- source: "system" | "dispatch" | "agent" | "user_chat" | "tool_use" | "tool_result"

interventions  INT DEFAULT 0
-- 使用者介入次數，用於分析哪些 task 需要較多人工指導
```

---

## 八、導覽結構與畫面

### 主導覽

```
┌─────────────────────────────────────────────────────────────┐
│  VIF Console                                                 │
│                                                              │
│  ┌─ Nav ───────────────────────────────────────────────┐    │
│  │ 📊 Dashboard │ 📁 Library │ 📐 Templates │ ⚙ Settings│    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Dashboard  = SDLC 階段總覽 + 待辦決策 + 執行中 Agent       │
│  Library    = 所有產出物分類瀏覽（跨專案）                    │
│  Templates  = 14 種文件模板管理（default + custom）          │
│  Settings   = 專案設定 + 使用者設定                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.1 Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard — my-saas-app                        [+ New Feature]  │
│                                                                   │
│  ┌─ SDLC Overview ───────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  Exploration    Specification   Development                │   │
│  │  ┌──────────┐  ┌──────────┐   ┌──────────┐               │   │
│  │  │ 3 PRDs   │  │ 2 Specs  │   │ 1 Active │               │   │
│  │  │ 2 ADRs   │  │ 4 API    │   │ 4/6 tasks│               │   │
│  │  │ 1 Guide  │  │ 2 UI     │   │ 2 agents │               │   │
│  │  │ 1 BDD    │  │ 3 Schema │   │          │               │   │
│  │  └──────────┘  └──────────┘   └──────────┘               │   │
│  │                                                            │   │
│  │  Verification   Review         Closure                    │   │
│  │  ┌──────────┐  ┌──────────┐   ┌──────────┐               │   │
│  │  │ — idle   │  │ — idle   │   │ 1 closed │               │   │
│  │  └──────────┘  └──────────┘   └──────────┘               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Feature Tracker ─────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  Feature           Phase           Progress    Actions     │   │
│  │ ──────────────── ──────────────── ─────────── ──────────  │   │
│  │  spec-001         Development      ████░ 4/6   [Open]     │   │
│  │  User Login       task-3 GREEN 🟢                         │   │
│  │                                                            │   │
│  │  spec-002         Specification    ██░░░ Spec   [Open]     │   │
│  │  File Upload      🔒 awaiting approve          [Approve]  │   │
│  │                                                            │   │
│  │  spec-003         Exploration      █░░░░ PRD    [Open]     │   │
│  │  Dashboard        drafting                      [Chat]     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Needs Your Attention ─────────────────────────────────────┐  │
│  │                                                             │  │
│  │  🔶 spec-002: Spec 等待 Approve                             │  │
│  │     Auditor: PASS │ [Preview] [✅ Approve] [💬 Feedback]   │  │
│  │                                                             │  │
│  │  🔴 spec-001/task-5: Escalation (BLOCKED)                  │  │
│  │     "Rate limiter 需要 Redis"                               │  │
│  │     [○ a. Simplify ○ b. Add Redis ○ c. Skip ○ d. Manual]  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─ Running Agents ───────────────────────────────────────────┐  │
│  │ 🟢 test-writer   spec-001/task-4    RED     0:45  local    │  │
│  │ 🟢 implementer   spec-001/task-3    GREEN   3:12  remote   │  │
│  │ 🟢 spec-auditor  spec-002           review  5:02  local    │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 8.2 Feature Workspace

點進一個 Feature，上方永遠有 Phase Pipeline，下方根據當前階段切換介面。

```
┌──────────────────────────────────────────────────────────────┐
│  ← Dashboard    spec-001: User Login                          │
│                                                                │
│  ✅ Exploration → ✅ Specification → 🚧 Development → ...     │
│     PRD ✓  ADR ✓     Spec ✓  5 design docs ✓   4/6 tasks    │
└──────────────────────────────────────────────────────────────┘
```

#### Phase 0 — Exploration（對話面板）

```
┌─ Exploration ──────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ 子項目 ──────────────────────────────────────────────┐     │
│  │ ✅ Architecture (ADR-001 JWT Auth)         [View ADR] │     │
│  │ ✅ UI/UX Foundation (ui-guideline.md)      [View]     │     │
│  │ ✅ PRD (prd-001.md)                        [View PRD] │     │
│  │ ✅ BDD (login.feature, 3 scenarios)        [View]     │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  Gate: PRD approved ✅ → [Continue to Specification]            │
│                                                                 │
│  [+ Write another PRD] [+ New ADR] [+ Add BDD scenario]       │
└─────────────────────────────────────────────────────────────────┘
```

正在對話時（例如點 `[+ New PRD]`）：

```
┌─ Exploration → PRD ────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Chat ──────────────────────┐ ┌─ PRD Preview ───────────┐  │
│  │                              │ │                          │  │
│  │ 🤖 你的專案已有 auth 模組... │ │ # PRD-001: User Login   │  │
│  │                              │ │                          │  │
│  │ 👤 我想改成 JWT...           │ │ ## 問題定義              │  │
│  │                              │ │ 現有 session auth...     │  │
│  │ 🤖 需要釐清幾件事...        │ │                          │  │
│  │                              │ │ (撰寫中...)              │  │
│  │ ┌──────────────────────┐    │ │                          │  │
│  │ │ Type message...      │    │ │ [View Full] [Edit]       │  │
│  │ └──────────────────────┘    │ └──────────────────────────┘  │
│  └──────────────────────────────┘                               │
│                                                                 │
│  Template: PRD (default)  [Change]                              │
│  Status: 📝 Drafting           [✅ Approve PRD]                │
└─────────────────────────────────────────────────────────────────┘
```

#### Phase 1 — Specification（工作台）

```
┌─ Specification ────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Spec ─────────────────────────────────────────────┐        │
│  │ ✅ spec.md   approved   [View] [Diff]              │        │
│  │ ✅ progress.md          [View]                     │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                 │
│  ┌─ Design Documents ─────────────────────────────────┐        │
│  │  Type       Document             Status    Audit    │        │
│  │ ────────── ─────────────────── ──────── ─────────  │        │
│  │  API Spec   auth/login.md       ✅ Done   P1+2 ✓   │        │
│  │  API Spec   auth/refresh.md     ✅ Done   P1+2 ✓   │        │
│  │  UI Spec    login-page.md       ✅ Done   P1+2 ✓   │        │
│  │  Schema     auth.md             ✅ Done   P1+2 ✓   │        │
│  │                                                     │        │
│  │  Cross-check (Pass 3): ✅ Passed                    │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                 │
│  Gate: All design complete ✅ → [Continue to Development]       │
└─────────────────────────────────────────────────────────────────┘
```

#### Phase 2 — Development（監控台）

```
┌─ Development ──────────────────────────────────────────────────┐
│                                                                 │
│  Strategy: Unit + Integration    Parallel: 2    [Settings]     │
│                                                                 │
│  ┌─ Tasks ─────────────────────────────────────────────┐       │
│  │                                                      │       │
│  │  Task 1: Login API                          ✅ Done  │       │
│  │  RED ✓ → GATE ✓ → GREEN ✓ → REFACTOR ✓ → COMMIT ✓  │       │
│  │  42s      auto     1m38s     32s       auto          │       │
│  │                                                      │       │
│  │  Task 3: Session store               🟢 Running     │       │
│  │  RED ✓ → GATE ✓ → GREEN 🔄 ████████░░ 2m15s         │       │
│  │  implementer: "adding SessionStore class..."         │       │
│  │  Agent: remote (codex)     [View Log] [View Diff]    │       │
│  │                                                      │       │
│  │  Task 4: JWT validation              🟢 Running     │       │
│  │  RED 🔄 ████░░░░░ 48s                                │       │
│  │  test-writer: "writing JWT verify test..."           │       │
│  │  Agent: local (claude-code) [View Log]               │       │
│  │                                                      │       │
│  │  Task 5: Rate limiter               ⏳ Queued       │       │
│  │  depends on: Task 3, Task 4                          │       │
│  │                                                      │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  Progress: ██████████░░░░░░░░░░ 2/6 (33%)                     │
│  [Pause All] [Adjust Parallelism]                              │
└─────────────────────────────────────────────────────────────────┘
```

#### Phase 3 — Verification（驗證台）

```
┌─ Verification ─────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Pipeline ──────────────────────────────────────────┐       │
│  │ Build ✅  Type ✅  Lint ⚠️  Test ✅  Diff ✅  Audit ✅ │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─ Security Review ──────────────────────────────────┐        │
│  │ 🟢 LOW risk — 0 🔴, 0 🟡, 1 🟢                     │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                 │
│  ┌─ WARN Decisions (2) ───────────────────────────────┐        │
│  │ W1: unused import   ● Fix  ○ Accept: ___           │        │
│  │ W2: prefer const    ● Fix  ○ Accept: ___           │        │
│  │                       [Apply & Continue →]          │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

#### Phase 4 — Review（審查台）

```
┌─ Review ───────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Stage 1: Spec Compliance ──────────────────────────┐       │
│  │ AC-1: JWT token     ✅    AC-2: Refresh    ✅        │       │
│  │ AC-3: Multi-device  ✅    Design match     ✅        │       │
│  │ Stage 1: ✅ PASS                                     │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─ Stage 2: Code Quality ─────────────────────────────┐       │
│  │ 🟡 SessionStore cleanup 應可配置                      │       │
│  │   src/stores/session.ts:28                            │       │
│  │   [View] ● Fix  ○ Accept: ___                        │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─ Manual Test Checklist ─────────────────────────────┐       │
│  │ [ ] 瀏覽器測試 login flow                             │       │
│  │ [ ] iOS Safari token 儲存                             │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  [Apply Fixes]    [✅ Approve Code & Continue]                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Phase 5 — Closure（核對台）

```
┌─ Closure ──────────────────────────────────────────────────────┐
│                                                                 │
│  Acceptance                                                     │
│  [✓] 所有 AC 通過 (3/3)                         auto           │
│  [✓] Manual tests (3/3)                          user           │
│                                                                 │
│  Quality                                                        │
│  [✓] Coverage 94%                                auto           │
│  [✓] 0 🔴 unresolved                             auto           │
│  [✓] Security PASS                                auto           │
│                                                                 │
│  Documentation                                                  │
│  [✓] progress.md complete                         auto           │
│  [⚠] api-spec drift: +last_login_at                             │
│      [Auto-sync] [Ignore]                                        │
│                                                                 │
│  [✅ Close Feature]                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Library — 跨專案產出物全覽

```
┌─ Library ──────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Project: [All ▾]  Type: [All ▾]  Status: [All ▾] ────┐   │
│                                                                 │
│  Summary: 3 PRDs │ 2 ADRs │ 1 Guideline │ 2 Specs             │
│           4 API │ 2 UI │ 3 Schema │ 1 BDD                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Type       Title                Project    Status       │   │
│  │ ────────── ──────────────────── ───────── ──────────── │   │
│  │ PRD        User Auth Migration  my-saas   ✅ approved   │   │
│  │ PRD        Dashboard Redesign   my-saas   ✅ approved   │   │
│  │ PRD        Notification System  my-saas   📋 draft      │   │
│  │ Spec       User Login           my-saas   ✅ → develop  │   │
│  │ Spec       File Upload          my-saas   📋 → spec     │   │
│  │ API Spec   auth/login.md        my-saas   ✅ audited    │   │
│  │ API Spec   auth/refresh.md      my-saas   ✅ audited    │   │
│  │ UI Spec    login-page.md        my-saas   ✅ audited    │   │
│  │ Schema     auth.md              my-saas   ✅ audited    │   │
│  │ ADR        JWT over Session     my-saas   ✅ accepted   │   │
│  │ ...                                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  點擊任一項 → 開啟 markdown 預覽 + metadata 面板                │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Templates — 文件模板管理

```
┌─ Templates ────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Document Templates ───────────────────────────────────┐    │
│  │                                                         │    │
│  │  Exploration                                            │    │
│  │  ├ PRD                [Default ✓]          [Preview]    │    │
│  │  ├ ADR                [Default ✓]          [Preview]    │    │
│  │  ├ UI Guideline       [Custom ✏️]           [Edit]      │    │
│  │  └ BDD Feature        [Default ✓]          [Preview]    │    │
│  │                                                         │    │
│  │  Specification                                          │    │
│  │  ├ Spec               [Default ✓]          [Preview]    │    │
│  │  └ Progress           [Default ✓]          [Preview]    │    │
│  │                                                         │    │
│  │  Design                                                 │    │
│  │  ├ API Spec           [Custom ✏️]           [Edit]      │    │
│  │  ├ DB Schema          [Default ✓]          [Preview]    │    │
│  │  └ UI Spec            [Custom ✏️]           [Edit]      │    │
│  │                                                         │    │
│  │  Reports                                                │    │
│  │  ├ Verify Report      [Default ✓]          [Preview]    │    │
│  │  ├ Review Report      [Default ✓]          [Preview]    │    │
│  │  └ Close Checklist    [Default ✓]          [Preview]    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Flow Templates ───────────────────────────────────────┐    │
│  │  Solo Tech-First      default   全功能流程              │    │
│  │  Solo Product-First   default   全功能流程              │    │
│  │  Bug Fix              default   develop → verify       │    │
│  │  Tech Debt            default   develop → verify       │    │
│  │  [+ Create Custom Flow]                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Upload Custom Template]  [Reset All to Defaults]              │
└─────────────────────────────────────────────────────────────────┘
```

### 8.5 Settings

```
┌─ Settings ─────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Project ──────────────────────────────────────────────┐    │
│  │  Name:      [my-saas-app       ]                        │    │
│  │  Mode:      [Solo ▾]         Flow: [Tech-first ▾]      │    │
│  │  Workspace: [Monorepo ▾]                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ Tech Stack ───────────────────────────────────────────┐    │
│  │  Language:   [TypeScript  ]   Framework: [Fastify    ]  │    │
│  │  Test:       [Vitest      ]   Build:     [tsup       ]  │    │
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
│  │  Backend:  [Unit + Integration ▾]                       │    │
│  │  Frontend: [Unit + Key E2E ▾]                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ AI Cross-Review ─────────────────────────────────────┐     │
│  │  [ ] Enable                Mode: [Solo ▾]              │     │
│  │  Design:  [codex ▾]   Verify: [codex ▾]               │     │
│  │  Review:  [codex ▾]                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ Guideline Mapping ───────────────────────────────────┐     │
│  │  api-spec  → [guideline/backend/          ]            │     │
│  │  ui-spec   → [guideline/frontend/         ]            │     │
│  │  testing   → [guideline/testing/          ]            │     │
│  │  [+ Add mapping]                                       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ Git Repos ────────────────────────────────────────────┐    │
│  │  monorepo   ~/Projects/my-saas    main   synced 5m ago │    │
│  │  [+ Add Repo]  [Sync Now]                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ AI Providers ─────────────────────────────────────────┐     │
│  │                                                        │     │
│  │  ✅ Claude Code                                        │     │
│  │     Auth: ● Subscription (Max)  ○ API Key              │     │
│  │     Status: ✅ Logged in as vito@...                    │     │
│  │                                                        │     │
│  │  ✅ Codex                                              │     │
│  │     Auth: ● ChatGPT (Pro)  ○ API Key                   │     │
│  │     Status: ✅ Logged in                                │     │
│  │                                                        │     │
│  │  ☐ Copilot         [Setup →]                           │     │
│  │  ☐ Gemini          [Setup →]                           │     │
│  │                                                        │     │
│  │  [Test All Connections]                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─ Agent Assignments ────────────────────────────────────┐     │
│  │                                                        │     │
│  │  Role            Provider    Model       Auth          │     │
│  │ ──────────────  ──────────  ──────────  ────────────  │     │
│  │  test-writer     Claude ▾    sonnet ▾    subscription  │     │
│  │  implementer     Claude ▾    sonnet ▾    subscription  │     │
│  │  spec-auditor    Claude ▾    opus ▾      subscription  │     │
│  │  reviewer        Claude ▾    opus ▾      subscription  │     │
│  │  verifier        Claude ▾    sonnet ▾    subscription  │     │
│  │  security        Claude ▾    sonnet ▾    subscription  │     │
│  │  cross-review    Codex ▾     codex ▾     subscription  │     │
│  │                                                        │     │
│  │  每個 agent 可獨立選 provider，支援混搭                  │     │
│  │  例如：主力 Claude 訂閱 + cross-review Gemini 免費       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  Changes sync to project settings    [Save] [Reset]            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 九、對現有 Skill 的調整

### Skill 的角色轉變

```
之前：使用者直接操作 Skill（/vif-prd、/vif-spec...）
之後：Console 調度 Skill，使用者操作 SDLC 階段
      Skill = Console 背後的能力模組，不面對使用者
```

### 需要的調整

| 調整 | 說明 | 優先度 |
|------|------|-------|
| **Template 外部化** | 從 SKILL.md 內嵌 → 獨立 template 檔案，可被 Console 載入和替換 | P0 |
| **Skill Prompt 可載入** | SKILL.md 內容作為 Agent SDK 的 system prompt，需可程式化讀取 | P0 |
| **結構化 output** | Skill 執行時 emit 結構化事件（step 進度、artifact 產出、gate 到達） | P0 |
| **Agent 改走 SDK** | Agent dispatch 從 CLI subagent → 透過 AgentProvider SDK 呼叫 | P1 |
| **Gate 定義標準化** | 從 prose → 可程式化的條件定義 | P1 |
| **Progress 結構化** | progress.md frontmatter 強化，讓 parser 更容易解析 | P2 |

### Skill 作為 SDK System Prompt

Console 載入 Skill 的方式：

```
1. 讀取 SKILL.md 內容 → 作為 SDK session 的 system prompt
2. 讀取 agent .md 內容 → 作為子 agent 的 system prompt
3. 讀取 references/*.md → 注入為 context（template、規則等）
4. Console 管理 conversation state，不依賴 CLI 的 skill routing

SKILL.md 本身不需要大改，它的內容就是給 AI 看的 prompt。
唯一要確保的是：prompt 裡不要有「依賴 CLI 環境」的指令
（如 "使用 /vif-guideline"），改為由 Console 在 dispatch 前注入。
```

### Template 外部化

目前 template 散落在 `skills/*/references/*-template.md`。外部化後：

```
plugins/vif/
├── templates/                    ← 新增：獨立 template 目錄
│   ├── prd-template.md           ← 從 skills/vif-prd/references/ 搬出
│   ├── spec-template.md
│   ├── progress-template.md
│   ├── api-spec-template.md
│   ├── schema-template.md
│   ├── ui-spec-template.md
│   ├── adr-template.md
│   ├── ui-guideline-template.md
│   ├── verify-report-template.md ← 從 SKILL.md 內嵌提取
│   ├── review-report-template.md
│   └── close-checklist-template.md
├── skills/                       ← 現有 skill 引用 template，不內嵌
└── agents/                       ← 不變
```

AI 產出文件時的邏輯：

```
1. 檢查 DB templates 表 → source = custom？
   → 用 custom content
2. 沒有 custom？
   → 用 plugins/vif/templates/ 內建 default
```

---

## 十、14 種文件模板清單

每種模板都有 Default（VIF 內建）和 Custom（使用者自訂）：

| # | Template | 用途 | Frontmatter | 所屬 SDLC 階段 | 預設檔 |
|---|----------|------|:-----------:|--------------|-------|
| 1 | PRD | 產品需求文件 | ○ Meta | Exploration | `prd-template.md` |
| 2 | ADR | 架構決策記錄 | ○ Meta | Exploration | `adr-template.md` |
| 3 | UI Guideline | 設計基礎 | — | Exploration | `ui-guideline-template.md` |
| 4 | BDD Feature | 行為規格 | — | Exploration | Gherkin format |
| 5 | Spec | 技術規劃 | ✓ YAML | Specification | `spec-template.md` |
| 6 | Progress | 追蹤文件 | — | Specification | `progress-template.md` |
| 7 | API Spec | API 規格 | ✓ YAML | Design | `api-spec-template.md` |
| 8 | DB Schema | 資料庫設計 | ✓ YAML | Design | `schema-template.md` |
| 9 | UI Spec | 頁面規格 | ✓ YAML | Design | `ui-spec-template.md` |
| 10 | Verify Report | 驗證報告 | — | Verification | `verify-report-template.md` |
| 11 | Review Report | 審查報告 | — | Review | `review-report-template.md` |
| 12 | Close Checklist | 完成清單 | — | Closure | `close-checklist-template.md` |
| 13 | Specs Overview | Spec 索引 | — | 跨階段 | 內建格式 |
| 14 | Project Config | CLAUDE.md | ✓ | 專案設定 | 內建格式 |
