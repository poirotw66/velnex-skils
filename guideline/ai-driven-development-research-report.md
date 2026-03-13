# AI 驅動開發流程研究報告

> 研究日期：2026-03-12
> 作者：Vito（AI 協作產出）
> 版本：2.0

---

## 目錄

1. [研究背景與目的](#1-研究背景與目的)
2. [Skills 生態系調查](#2-skills-生態系調查)
   - 2.1 BDD / TDD 相關 Skills
   - 2.2 產品發想 / Discovery 相關 Skills
   - 2.3 綜合型生態系：Everything Claude Code（ECC）
   - 2.4 Skills 比較分析
3. [BDD 與 TDD 在 AI 協作時代的趨勢](#3-bdd-與-tdd-在-ai-協作時代的趨勢)
   - 3.1 TDD 作為 AI 協作的通訊協定
   - 3.2 BDD + AI 的最佳實踐
   - 3.3 Spec-Driven Development（SDD）
   - 3.4 TDAID — Test-Driven AI Development
   - 3.5 EDD — Eval-Driven Development
   - 3.6 Autonomous Loops 與 Continuous Learning
4. [四大框架分析](#4-四大框架分析)
   - 4.1 Spec Kit（GitHub 官方）
   - 4.2 Superpowers（Jesse Vincent）
   - 4.3 OpenSpec（Fission AI）
   - 4.4 Everything Claude Code（ECC）
   - 4.5 框架比較總表
5. [SDD、BDD、TDD、EDD 的關聯性](#5-sddbddtddedd-的關聯性)
6. [現有專案基礎盤點](#6-現有專案基礎盤點)
   - 6.1 Velarch
   - 6.2 Albedo
   - 6.3 Proji WhereSpent
   - 6.4 三專案最佳實踐對照
7. [統一開發流程設計](#7-統一開發流程設計)
   - 7.1 流程概覽（六階段 Phase 0-5）
   - 7.2 文件架構與三層職責
   - 7.3 Phase 0: PRD — 產品探索
   - 7.4 Phase 1: Spec — 規格與設計
   - 7.5 Phase 2: Develop — 開發（逐任務 TDD）
   - 7.6 Phase 3: Verify — 驗證
   - 7.7 Phase 4: Review — 審查
   - 7.8 Phase 5: Close — 完成
   - 7.9 Phase Transition Gates
   - 7.10 失敗路徑與回退機制
   - 7.11 跳過判斷速查表
   - 7.12 Profile 制
8. [Agent 分工模型](#8-agent-分工模型)
   - 8.1 4+2 Agent 模型
   - 8.2 Agent 編排協議
   - 8.3 個人開發模式
   - 8.4 團隊角色對應
9. [統一模板設計](#9-統一模板設計)
   - 9.1 PRD 模板
   - 9.2 統一 Spec 模板
   - 9.3 Progress 模板
   - 9.4 文件結構
10. [工具與 Skills 建議](#10-工具與-skills-建議)
11. [導入策略與改動摘要](#11-導入策略與改動摘要)
12. [參考資料](#12-參考資料)

---

## 1. 研究背景與目的

### 動機

在 AI 輔助開發工具日益成熟的 2025-2026 年，傳統的軟體開發方法論（BDD、TDD）正在與 AI 協作模式融合。同時，一個新的實踐 — Spec-Driven Development（SDD）— 正在成為連接人類意圖與 AI 生成程式碼的橋樑。

### 研究目標

1. 調查 Claude Code Skills 生態系中 BDD、TDD、產品發想相關的 skills
2. 調查網路上 BDD/TDD 在 AI 協作中的最新趨勢與作法
3. 分析四大框架（Spec Kit、Superpowers、OpenSpec、Everything Claude Code）
4. 釐清 SDD、BDD、TDD、EDD 四者的關聯性
5. 基於現有專案（Velarch、Albedo、Proji）的實踐基礎，設計一套適用於個人或小型團隊（5-10 人）的統一開發流程
6. 整合 Everything Claude Code（ECC）的 Agent Harness、Eval-Driven Development、Autonomous Loops 等原創概念

---

## 2. Skills 生態系調查

### 2.1 BDD / TDD 相關 Skills

透過 `npx skills find` 搜尋，並讀取各 repo 的 SKILL.md 進行內容分析。

#### BDD Skills

| Skill | Repo | Stars | 安裝數 | 特色 |
|-------|------|-------|--------|------|
| bdd-patterns | [thebushidocollective/han](https://github.com/thebushidocollective/han) | 106 | 72 | 模組化 BDD plugin（4 個 skill），融入 250+ skills 大生態系 |
| bdd-principles | thebushidocollective/han | 106 | 38 | BDD 核心概念、Three Amigos、Discovery-Development-Delivery |
| bdd | [samzhu/agent-skills](https://github.com/samzhu/agent-skills) | 0 | — | 完整三階段工作流（Discovery → Formulation → Automation），原生繁體中文 |
| doc-bdd | [vladm3105/aidoc-flow-framework](https://github.com/vladm3105/aidoc-flow-framework) | 9 | 37 | 文件驅動的 BDD |
| bdd-gherkin-specification | [jzallen/fred_simulations](https://github.com/jzallen/fred_simulations) | 1 | 26 | Gherkin 語法撰寫專用 |

#### TDD Skills

| Skill | Repo | Stars | 安裝數 | 特色 |
|-------|------|-------|--------|------|
| test-driven-development | [bobmatnyc/claude-mpm-skills](https://github.com/bobmatnyc/claude-mpm-skills) | 20 | 91 | 通用 TDD，含 progressive disclosure，附帶子文件 |
| tdd | [samzhu/agent-skills](https://github.com/samzhu/agent-skills) | 0 | — | 嚴格 Red-Green-Refactor，「鐵律」設計，原生繁體中文 |
| test-driven-development | [thebushidocollective/han](https://github.com/thebushidocollective/han) | 106 | — | han 生態系 TDD plugin，偏 Elixir/TypeScript |
| tdd-expert | [anton-abyzov/specweave](https://github.com/anton-abyzov/specweave) | 87 | 16 | TDD 專家指導 |

#### samzhu/agent-skills 深度分析

此 repo 雖然 stars 為 0，但 BDD 和 TDD skill 的內容品質高：

**BDD Skill（v1.1.0）**：

- 三階段工作流：Discovery（三視角探索 + Example Mapping 四色卡片法）→ Formulation（Gherkin 場景撰寫）→ Automation（Outside-In 開發）
- 強調「先對話、用範例、再寫碼」
- 明確定義與 TDD 的切換時機：Phase 3 內層開發時切換到 TDD

**TDD Skill（v1.1.0）**：

- 鐵律：`NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`
- 寫了 production code 沒有測試？刪掉重來。不是建議，是約束
- 附帶完整的「常見藉口反駁表」（12 個藉口 + 反駁）
- 包含 Bug Fix 範例流程和完成驗證清單

**核心優勢**：原生繁體中文，BDD/TDD 設計為搭配使用，反藉口設計有效約束 AI 不跳過測試。

### 2.2 產品發想 / Discovery 相關 Skills

| Skill | Repo | Stars | 安裝數 | 特色 |
|-------|------|-------|--------|------|
| brainstorm-ideas-new | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | 6,472 | 118 | 三視角腦力激盪（PM/Designer/Engineer），背後是 ProductCompass 方法論 |
| brainstorm-ideas-existing | phuryn/pm-skills | 6,472 | 113 | 既有產品改善 |
| identify-assumptions-new | phuryn/pm-skills | 6,472 | 109 | 識別產品假設 |
| product-discovery | [majiayu000/claude-arsenal](https://github.com/majiayu000/claude-arsenal) | 10 | 118 | JTBD、Kano model，Hard Rules 設計（禁止 solution-first） |
| inspired-product | [wondelai/skills](https://github.com/wondelai/skills) | 202 | 91 | Empowered Teams + Discovery/Delivery 雙軌，附帶評分機制 |
| continuous-discovery | wondelai/skills | 202 | — | OST + 每週訪談節奏，與 inspired-product 互補 |
| spec-driven-brainstorming | [anton-abyzov/specweave](https://github.com/anton-abyzov/specweave) | 87 | 43 | 規格驅動的腦力激盪 |

#### phuryn/pm-skills 深度分析

以 6,472 stars 遙遙領先，是目前最完整的 PM 工具箱，涵蓋 70+ skills：

- **Product Discovery**：brainstorm、assumptions、experiments、interview、OST
- **Product Strategy**：lean canvas、SWOT、pricing、vision
- **Market Research**：competitor analysis、personas、journey map
- **Go-to-Market**：GTM strategy、battlecard、growth loops
- **Execution**：PRD、OKR、sprint plan、retro

每個 skill 獨立、可單獨安裝。

#### wondelai/skills 深度分析

每個 skill 對應一本經典書的框架：

- `inspired-product`：Marty Cagan《Inspired》
- `continuous-discovery`：Teresa Torres《Continuous Discovery Habits》
- `lean-startup`、`jobs-to-be-done`、`mom-test`、`blue-ocean-strategy` 等

有 references 子文件和互相交叉引用，附帶 0-10 評分機制。

### 2.3 綜合型生態系：Everything Claude Code（ECC）

[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)（72,072 stars）是目前最大的社群驗證 Claude Code 資源，由 Affaan Mushtaq 建立。不同於上述單一職責的 skills，ECC 是一個完整的 AI agent harness 效能最佳化系統，涵蓋 skills、agents、commands、hooks、rules、continuous learning 等面向。

**基本資訊**：

| 指標 | 數值 |
|------|------|
| Stars | 72,072 |
| Forks | 9,044 |
| 版本 | v1.8.0 |
| 授權 | MIT |
| 建立日期 | 2026-01-18 |
| 最新推送 | 2026-03-11 |

**規模統計**：

| 類別 | 數量 | 說明 |
|------|------|------|
| Agents | 16 | 專業化 subagent（planner、architect、tdd-guide、code-reviewer 等） |
| Skills | 65+ | 涵蓋開發、測試、安全、商業、垂直領域 |
| Commands | 40+ | `/tdd`、`/plan`、`/code-review`、`/verify`、`/learn` 等 |
| Rules | 9+ 通用 + 語言別 | 分層規則系統（common/ + typescript/ + python/ + golang/ 等） |
| Hooks | 完整事件系統 | PreToolUse、PostToolUse、SessionStart、Stop 等 |
| Tests | 997+ | 完整測試套件 |
| 範例配置 | 4 | SaaS Next.js、Go microservice、Django API、Rust API |

**TDD 相關資源**：

ECC 在 TDD 方面有極為豐富的內容，涵蓋多個層次：

| 資源類型 | 檔案 | 用途 |
|---------|------|------|
| Agent | `agents/tdd-guide.md` | TDD 引導 agent（使用 Sonnet 模型） |
| Command | `commands/tdd.md` | `/tdd` slash command |
| Skill | `skills/tdd-workflow/SKILL.md` | 完整 TDD 工作流定義 |
| Rule | `rules/common/testing.md` | 強制 TDD 流程（RED → GREEN → REFACTOR） |
| Django TDD | `skills/django-tdd/` | Django + pytest |
| Spring Boot TDD | `skills/springboot-tdd/` | Spring Boot + JUnit 5 |
| Go Testing | `skills/golang-testing/` | Go TDD + benchmarks |
| Python Testing | `skills/python-testing/` | Python + pytest |
| C++ Testing | `skills/cpp-testing/` | GoogleTest TDD |
| Swift Testing | `skills/swift-protocol-di-testing/` | Protocol DI testing |

TDD 核心約束：80%+ 覆蓋率底線（金融/認證/安全相關要求 100%）、三種測試類型（Unit + Integration + E2E）、8 種必測邊緣情況。

**16 個 Agents 概覽**：

| Agent | 用途 | 特色 |
|-------|------|------|
| planner | 功能實作規劃 | 類似 SDD 中的 spec-writer |
| architect | 系統設計決策 | 架構層級的設計審查 |
| tdd-guide | TDD 開發引導 | 使用 Sonnet 模型，專注測試先行 |
| code-reviewer | 程式碼品質審查 | 雙階段審查 |
| security-reviewer | 漏洞分析 | **不可 Edit**，只讀審查 |
| build-error-resolver | 建構錯誤修復 | 自動化 debug |
| e2e-runner | E2E 測試 | Playwright 驅動 |
| refactor-cleaner | 死碼清除 | 重構專用 |
| doc-updater | 文件同步 | 自動更新文件 |
| loop-operator | 自主迴路監控 | 管理 autonomous loops |
| harness-optimizer | Harness 調優 | 配置最佳化 |
| go-reviewer | Go 審查 | 語言特定 |
| python-reviewer | Python 審查 | 語言特定 |
| database-reviewer | DB 審查 | PostgreSQL/Supabase 專家 |
| chief-of-staff | 溝通分流 | 非技術性任務處理 |
| kotlin-reviewer | Kotlin 審查 | 語言特定 |

**原創概念**：

1. **Eval-Driven Development（EDD）**：將 eval 視為「AI 開發的 unit test」，使用 pass@k / pass^k 指標量化 AI agent 可靠性
2. **Instinct-based Learning**：原子級學習單元（帶信心分數 0.3-0.9），支援跨專案隔離防止知識汙染
3. **Autonomous Loops**：6 種複雜度遞增的自主迴路模式
4. **Verification Loop**：六階段驗證系統（Build → Type Check → Lint → Test → Security Scan → Diff Review）
5. **De-Sloppify Pattern**：獨立清理步驟取代負面指令
6. **Hook Profile 分級**：minimal/standard/strict 執行時控制

**核心差異**：ECC 不是「開發方法論」，而是「AI agent 的作業系統層」。它提供的是 agent 運作的基礎設施（harness），而非定義「該做什麼」的流程框架。這使它與 Spec Kit、Superpowers、OpenSpec 形成互補而非競爭關係。

### 2.4 Skills 比較分析

#### 按使用階段推薦

| 階段 | 推薦 Skill | 理由 |
|------|-----------|------|
| 產品發想 | phuryn/pm-skills | 6,472 stars，最完整的 PM 工具箱 |
| 持續探索 | wondelai/skills（continuous-discovery + inspired-product） | 理論最紮實，OST、雙軌制 |
| BDD | samzhu/agent-skills@bdd | 繁體中文、三階段完整、與 TDD 明確銜接 |
| TDD | samzhu/agent-skills@tdd | 繁體中文、嚴格紀律、反藉口設計 |
| TDD（多語言） | ECC tdd-workflow + 語言特定 skills | 7 種語言框架的 TDD 最佳實踐 |
| Agent Harness | ECC（完整安裝） | 72,072 stars，最完整的 agent 基礎設施 |
| 驗證與品質 | ECC verification-loop + eval-harness | 六階段驗證 + EDD 指標 |

#### han 生態系的取捨

- han (106 stars) 規模龐大（250+ skills），適合「全家桶」團隊
- BDD skill 拆太細（4 個），且 `user-invocable: false` 不能直接用 slash command 觸發
- 適合 Elixir/Phoenix 技術棧的團隊

---

## 3. BDD 與 TDD 在 AI 協作時代的趨勢

### 3.1 TDD 作為 AI 協作的通訊協定

#### 8th Light 的觀點：TDD 是人與 AI 的溝通協定

> TDD 不只是測試方法，它是人與 AI 之間的結構化溝通框架。

**為什麼 TDD + AI 特別搭**：

| 原因 | 說明 |
|------|------|
| LLM 有效 context 限制 | TDD 的微迭代（一次一個行為）符合 AI 最佳工作單位 |
| 測試先行 = 明確規格 | 減少模糊指令造成的幻覺 |
| 壞掉的程式碼汙染 context | TDD 持續測試確保 context 乾淨 |
| 跨 session 持久性 | 測試套件成為不會遺失的文件 |

**推薦的 5 步工作流**：

1. **人**：列出所有測試描述（涵蓋需求和邊界案例）
2. **人**：實作一個完整的測試，建立 coding convention
3. **AI**：根據已建立的模式完成剩餘測試
4. **人**：review 並修正生成的測試
5. **AI**：根據完整的測試規格生成實作程式碼

#### Codemanship 的觀點：為什麼 TDD 在 AI 輔助下效果更好

> 用測試來 prompt，幫助模型釘住需求的含義，產生更精確的 pattern matching。

關鍵洞察：

- **小步驟**：AI 一次處理一個測試案例，比一次給整個規格準確度高很多
- **持續測試**：壞掉的程式碼讓 AI 產出 5 倍的 token 去處理不必要的複雜度
- **快速 code review**：小差異讓人更容易 review AI 的產出
- **具體範例**：比抽象規格更能限縮 AI 的搜索空間

DORA 數據顯示：頂尖效能團隊幾乎都在做 TDD，搭配 AI 後效果更顯著。

#### Builder.io 的觀點：AI 讓 TDD 從「知道該做但跳過」變成「真正可行」

> AI 把 TDD 從 best-practice-you-skip 變成了 powerful way to scale resilient applications。

AI 解決了 TDD 最大的摩擦：

- **時間成本**：AI 大幅加速 boilerplate 和測試撰寫
- **維護負擔**：AI 可以幫助重構測試
- **覆蓋率**：AI 能建議人類遺漏的邊界案例

### 3.2 BDD + AI 的最佳實踐

#### Humanizing Work 的研究：AI 是 Reviewer，不是 Author

> Copilot 可以生成 Gherkin scenario，但生成的結果常常失敗於 BDD 的核心目的 — 對人類清楚表達行為。

**問題根源**：AI 訓練資料中充滿品質差的 Gherkin 範例。

**建議作法**：

| 原則 | 說明 |
|------|------|
| AI 不從零寫 scenario | 讓 AI review 和改寫現有的 Gherkin |
| 建立自己的 BDD 規範 | 放在 CLAUDE.md 或 project instructions |
| 三原則 | 具體的領域語言、去除雜訊、術語一致性 |
| AI 的最佳角色 | 協作 reviewer，而非主要作者 |

### 3.3 Spec-Driven Development（SDD）

#### 定義

SDD 是 2025 年 Thoughtworks Technology Radar 列出的重要趨勢：

> 使用結構化的軟體需求規格作為 prompt，由 AI coding agent 生成可執行程式碼。

#### SDD 與 BDD/TDD/EDD 的關係

```
┌─────────────────────────────────────────────┐
│  SDD（Spec-Driven Development）             │  ← 意圖層：定義「為什麼」和「做什麼」
│  規格驅動開發                                │     Markdown 規格文件 → AI 的 prompt
├─────────────────────────────────────────────┤
│  BDD（Behavior-Driven Development）         │  ← 行為層：定義「系統應該怎麼表現」
│  行為驅動開發                                │     Gherkin scenario → 驗收測試
├─────────────────────────────────────────────┤
│  TDD（Test-Driven Development）             │  ← 實作層：定義「程式碼應該怎麼運作」
│  測試驅動開發                                │     Unit test → Production code
├─────────────────────────────────────────────┤
│  EDD（Eval-Driven Development）             │  ← 驗證層：定義「AI agent 是否可靠」
│  評估驅動開發（ECC 原創）                     │     pass@k/pass^k → Agent 可靠性量化
└─────────────────────────────────────────────┘
```

四者不是互相取代，而是不同層次的互補實踐。詳見[第 5 章](#5-sddbddtddedd-的關聯性)。

#### 核心工作流

```
SDD 規格  ──拆解──▶  BDD 場景  ──驅動──▶  TDD 測試  ──生成──▶  程式碼  ──驗證──▶  EDD
   │                    │                    │                   │                │
   │     回饋發現       │    回饋遺漏        │    回饋設計       │   回饋品質     │
   ◀────────────────────◀────────────────────◀───────────────────◀────────────────┘
```

**向下**是「分解」：大規格 → 行為場景 → 單元測試。**向上**是「回饋」：寫測試時發現場景遺漏 → 寫場景時發現規格模糊。

#### SDD 的核心差異

| 面向 | SDD | BDD | TDD | EDD |
|------|-----|-----|-----|-----|
| 回答的問題 | 我們要建什麼？為什麼？ | 系統的行為是否符合業務需求？ | 這段程式碼是否正確運作？ | AI agent 是否可靠？ |
| 產出物 | Markdown 規格文件 | Gherkin Feature 檔案 | Unit Test | Eval report + 指標 |
| 參與者 | PM + 架構師 + AI | 業務 + 開發 + 測試 | 開發者 + AI | 開發者 + AI |
| 粒度 | 功能/模組級 | 使用者場景級 | 函式/方法級 | Agent 任務級 |
| 與 AI 的關係 | 規格 = AI 的 prompt | scenario = AI 的驗收標準 | test = AI 的護欄 | eval = AI 的品質量化 |

#### SDD vs Vibe Coding

- Vibe Coding = 快速但缺乏紀律
- SDD = 用結構化規格約束 AI，保持速度的同時確保品質
- 關鍵差異：SDD 要求「先寫規格再寫碼」

### 3.4 TDAID — Test-Driven AI Development

Awesome Testing 提出的擴展模型：

```
Plan → Red → Green → Refactor → Validate
```

- **Plan**（新增）：定義 AI 生成的範圍與約束
- **Validate**（新增）：驗證 AI 產出是否符合原始意圖（不只是測試通過）

### 3.5 EDD — Eval-Driven Development

Everything Claude Code（ECC）提出的原創方法論，將 **eval 視為 AI 開發的 unit test**：

#### 定義

> 在讓 AI agent 寫程式碼之前，先定義 eval（評估標準），用量化指標驗證 AI 產出的可靠性。

#### 與 TDD 的類比

| TDD | EDD |
|-----|-----|
| 先寫 unit test | 先定義 eval criteria |
| 跑測試 → RED | 跑 eval → 不通過 |
| 寫實作 → GREEN | 調整 prompt/agent → 通過 |
| Refactor | 最佳化 agent 配置 |
| 覆蓋率指標 | pass@k / pass^k 指標 |

#### 核心指標

- **pass@k**：在 k 次嘗試中至少有一次成功的機率。衡量 AI agent 是否「有能力」完成任務
- **pass^k**：在 k 次嘗試中全部成功的機率。衡量 AI agent 的「可靠性」

```
pass@k = 1 - (1 - p)^k     ← 至少成功一次
pass^k = p^k                ← 每次都成功
```

例：一個 agent 的單次成功率 p = 0.8：
- pass@3 = 1 - (0.2)³ = 99.2%（三次內幾乎一定會成功一次）
- pass^3 = (0.8)³ = 51.2%（但三次都成功的機率只有一半）

#### 三種 Grader

| Grader 類型 | 適用場景 | 說明 |
|------------|---------|------|
| Code-Based | 確定性輸出 | 字串比對、正則匹配、結構驗證 |
| Model-Based | 主觀品質 | 用另一個 LLM 評分（0-10） |
| Human | 最終驗收 | 人工審查，通常用於高風險場景 |

#### EDD 在開發流程中的位置

```
SDD → BDD → TDD → Implement → EDD（驗證 AI 產出品質）→ Review
                                  ↑
                          新增的驗證層
```

EDD 不取代 TDD，而是在 TDD 之上加一層：TDD 驗證「程式碼是否正確」，EDD 驗證「AI agent 是否可靠」。

### 3.6 Autonomous Loops 與 Continuous Learning

ECC 歸納了 6 種複雜度遞增的自主迴路模式，代表 AI 輔助開發從「人驅動」到「AI 自主」的光譜：

| 等級 | 模式 | 複雜度 | 說明 |
|------|------|--------|------|
| L1 | Sequential Pipeline | 最低 | 簡單的 `claude -p` 指令串接 |
| L2 | NanoClaw REPL | 低 | 內建持久化 session 的互動迴路 |
| L3 | Infinite Agentic Loop | 中 | 平行 sub-agent 生成（by @disler） |
| L4 | Continuous PR Loop | 中高 | 自動建立 PR → 等待 CI → 合併（by @AnandChowdhary） |
| L5 | De-Sloppify Pattern | 高 | 獨立清理步驟，避免負面指令汙染 |
| L6 | RFC-Driven DAG | 最高 | RFC 分解 → DAG → 多 agent 平行 → merge queue（by @enitrat） |

#### Continuous Learning v2.1

ECC 的持續學習系統基於「instinct（本能）」概念：

```
Session 活動 → Hook 觀察 → 萃取 instinct → 信心加權（0.3-0.9）→ 演化
                                                                    ↓
                                                    skill / command / agent
```

**關鍵設計**：
- **Project-scoped isolation**：每個專案的 instinct 獨立，防止跨專案知識汙染
- **信心分數**：新 instinct 從低信心開始，經驗證後逐步提升
- **演化路徑**：高信心 instinct 可升級為正式的 skill、command 或 agent

### 3.7 AI 協作實用原則總結

| 原則 | 具體作法 |
|------|---------|
| 人寫測試意圖，AI 寫實作 | 你定義 test description，AI 生成 test body 和 production code |
| 微迭代 | 一次只給 AI 一個測試案例，不要一次丟整個需求 |
| BDD scenario 人主導 | Example Mapping 探索需求 → 人寫 Gherkin → AI review 品質 |
| TDD 作為護欄 | 測試先行確保 AI 生成的程式碼始終在你定義的邊界內 |
| SDD 作為上層框架 | Markdown 規格文件作為 AI 的 prompt，BDD/TDD 在下層驗證 |
| 持續驗證 | 每次 AI 生成後立即跑測試，不累積未驗證的程式碼 |
| 規範放進 project context | BDD/TDD 規則寫入 CLAUDE.md，讓 AI 每次對話都遵守 |
| EDD 驗證 AI 可靠性 | 用 pass@k / pass^k 量化 AI agent 的能力與可靠性 |
| Agent Harness 最佳化 | 設計 action space、observation 格式、error recovery contract |
| 研究先於實作 | 寫程式碼前先搜尋現有解決方案（search-first principle） |

---

## 4. 四大框架分析

### 基本資訊

| | Spec Kit | Superpowers | OpenSpec | ECC |
|---|---|---|---|---|
| GitHub | [github/spec-kit](https://github.com/github/spec-kit) | [obra/superpowers](https://github.com/obra/superpowers) | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) |
| Stars | 75,859 | 77,683 | 29,513 | 72,072 |
| 維護者 | GitHub 官方 | Jesse Vincent | Fission AI | Affaan Mushtaq |
| 版本 | 持續更新 | v5.0.1 | 持續更新 | v1.8.0 |
| 定位 | SDD 工具箱 | 完整開發方法論 + skills 框架 | 輕量級 SDD 框架 | AI Agent Harness 最佳化系統 |
| 支援平台 | 22+ AI agents | Claude Code、Cursor、Codex、OpenCode | 21+ AI agents | Claude Code、Cursor、Codex、OpenCode、Antigravity |

### 4.1 Spec Kit（GitHub 官方）

#### 核心理念：Power Inversion（權力倒轉）

> 過去幾十年，程式碼是王者，規格服務於程式碼。SDD 倒轉這個關係 — 規格不服務程式碼，程式碼服務規格。

#### 四階段工作流

```
/speckit.specify ──▶ /speckit.plan ──▶ /speckit.tasks ──▶ Implement
   建立規格            建立技術計劃         拆解任務          執行實作
```

| 階段 | 做什麼 | 產出 |
|------|--------|------|
| Specify | 從一句話描述生成完整規格，自動建 branch 和目錄結構 | `spec.md`（PRD） |
| Plan | 讀取規格，確保符合專案 constitution，轉化為技術架構 | `plan.md` + `data-model.md` + `contracts/` |
| Tasks | 分析計劃文件，拆解為可執行任務，標記可平行化的任務 `[P]` | `tasks.md` |
| Implement | AI agent 逐一執行任務 | 程式碼 + 測試 |

#### 特色

- **自動化管理**：自動 feature 編號、branch 建立、目錄結構
- **Extension 系統**：可擴展的 plugin 架構
- **雙向回饋**：production metrics 和 incidents 會反過來更新規格
- **官方背書**：GitHub 官方維護，與 Copilot 深度整合

#### 核心原則

- **Specifications as the Lingua Franca**：規格成為主要產出物，程式碼只是規格在特定語言和框架中的表達
- **Executable Specifications**：規格必須精確到可以生成可運作的系統
- **Continuous Refinement**：持續驗證規格的一致性，不是一次性的
- **Bidirectional Feedback**：生產環境的指標和事件反過來影響規格演進

#### 適合場景

- Greenfield（全新專案）
- 需要嚴格的規格 → 程式碼追溯性
- 多人協作、需要 spec review 流程

### 4.2 Superpowers（Jesse Vincent）

#### 核心理念：完整的 AI 協作開發方法論

Superpowers 不只是 SDD 工具 — 它是一個完整的 agentic skills 框架 + 開發方法論，內建 TDD 紀律。

#### 工作流

```
Brainstorm ──▶ Write Plan ──▶ Execute Plan（TDD）──▶ Code Review
  蘇格拉底式      拆解任務         Red-Green-Refactor     兩階段 review
  對話探索        2-5 分鐘粒度      subagent 執行          spec 合規 + 品質
```

#### 關鍵設計

**1. Brainstorming 有 Hard Gate：**

```
<HARD-GATE>
不可以寫任何程式碼，直到設計被人類批准。
這適用於每一個專案，不管看起來多「簡單」。
</HARD-GATE>
```

**2. Anti-Pattern 防護**：

> 每個專案都需要設計。Todo list、單一函式工具、config 變更 — 全部。「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。

**3. TDD 是硬性約束**：

> 如果 production code 出現在 test 之前，Superpowers 會刪掉它。這不是建議 — 這是約束。

**4. Subagent 驅動開發**：

- 每個任務由專門的 subagent 執行
- 雙階段 review：spec 合規性 → 程式碼品質
- 支援平行執行多個任務

#### 特色

- 方法論完整：從 brainstorming 到 code review 全覆蓋
- 被 Anthropic marketplace 接受（2026 年 1 月）
- Claude Code plugin 格式：安裝即用
- Spec reviewer subagent 自動審查（最多 5 次迭代）

#### 適合場景

- Claude Code 深度使用者
- 想要端到端的 AI 開發方法論
- 重視 TDD 紀律的團隊

### 4.3 OpenSpec（Fission AI）

#### 核心理念：輕量、流動、Brownfield-first

```
fluid not rigid       — 沒有 phase gate，做有意義的事
iterative not waterfall — 邊建邊學，邊做邊精煉
easy not complex      — 輕量設定，最少儀式
brownfield-first      — 專為既有 codebase 設計
```

#### 工作流（core profile）

```
/opsx:explore ──▶ /opsx:propose ──▶ /opsx:apply ──▶ /opsx:archive
  探索想法           建立規格+計劃       實作任務          歸檔合併
```

#### 核心架構：Specs + Changes 分離

```
openspec/
├── specs/          ← Source of truth（系統目前的行為）
│   ├── auth/spec.md
│   └── payments/spec.md
└── changes/        ← 提案中的修改（每個 change 一個資料夾）
    └── add-dark-mode/
        ├── proposal.md
        ├── specs/ui/spec.md  ← 含 delta 標記
        ├── design.md
        └── tasks.md
```

#### Delta 標記系統（Brownfield 的殺手級功能）

```markdown
### Requirement: User Authentication [MODIFIED]
The system SHALL issue a JWT token upon successful login.
+ AND refresh tokens SHALL be rotated on each use.   ← ADDED
- AND tokens expire after 24 hours.                   ← REMOVED

### Requirement: OAuth Integration [ADDED]
The system SHALL support Google OAuth 2.0 login.
```

#### 規格格式：RFC 2119 關鍵字

```markdown
The system SHALL issue a JWT token...     ← 必須
The system SHOULD log failed attempts...  ← 建議
The system MAY support biometric...       ← 可選
```

#### 特色

- **Brownfield-first**：專門處理既有系統的漸進修改
- **Delta-based**：追蹤「改了什麼」而非「全部是什麼」
- **多 change 平行**：可同時處理多個變更，不衝突
- **Profile 可選**：core（簡單）或 expanded（完整）

#### 適合場景

- 既有專案的功能迭代
- 多個功能同時開發
- 需要清楚追蹤「每次改了什麼」

### 4.4 Everything Claude Code（ECC）

#### 核心理念：AI Agent Harness 最佳化

> ECC 不是開發方法論，而是 AI agent 的作業系統層。它提供 agent 運作的基礎設施（harness），讓任何方法論都能更有效地執行。

#### 定位差異

```
Spec Kit / Superpowers / OpenSpec  →  定義「該做什麼」（方法論）
ECC                                →  定義「怎麼做得更好」（基礎設施）
```

三大 SDD 框架回答「開發流程該怎麼走」，ECC 回答「AI agent 該怎麼配置才能走得更好」。兩者是互補關係。

#### 核心架構

```
everything-claude-code/
├── agents/           ← 16 個專業化 subagent（planner、tdd-guide 等）
├── skills/           ← 65+ 工作流程定義（tdd-workflow、eval-harness 等）
├── commands/         ← 40+ slash commands（/tdd、/plan、/verify 等）
├── rules/            ← 分層規則系統
│   ├── common/       ← 語言無關原則（9 個檔案）
│   ├── typescript/   ← TypeScript 特定
│   ├── python/       ← Python 特定
│   └── golang/       ← Go 特定
├── hooks/            ← 事件驅動自動化（hooks.json）
├── contexts/         ← 動態系統提示注入（dev/review/research 模式）
├── examples/         ← 範例配置（4 種技術棧）
└── scripts/          ← 跨平台 Node.js 工具腳本
```

#### 六階段驗證系統（Verification Loop）

```
Build → Type Check → Lint → Test Suite → Security Scan → Diff Review
                                                              ↓
                                                    結構化驗證報告
```

這是 ECC 最核心的品質保障機制，確保每次 AI 產出都經過完整驗證。

#### Hook 系統

ECC 的 hook 系統在工具呼叫的各個生命週期自動執行品質檢查：

| Hook 時機 | 功能 |
|-----------|------|
| PreToolUse | git push 審查、compaction 建議、安全監控 |
| PostToolUse | 建構分析、品質門檻、自動格式化、TypeScript 檢查 |
| SessionStart | 載入先前 context、偵測 package manager |
| Stop | console.log 檢查、session 狀態持久化、成本追蹤 |

支援 `ECC_HOOK_PROFILE=minimal|standard|strict` 三種嚴格度。

#### 範例配置模板

| 模板 | 技術棧 |
|------|--------|
| `examples/saas-nextjs-CLAUDE.md` | Next.js + Supabase + Stripe |
| `examples/go-microservice-CLAUDE.md` | Go gRPC + PostgreSQL |
| `examples/django-api-CLAUDE.md` | Django REST API + Celery |
| `examples/rust-api-CLAUDE.md` | Rust Axum + SQLx + PostgreSQL |

#### 特色

- **Agent 工具沙箱**：每個 agent 限制可用工具（如 security-reviewer 不能 Edit）
- **Research-First**：`search-first` skill 強制在寫碼前搜尋現有解決方案
- **De-Sloppify Pattern**：獨立清理步驟取代負面指令，避免品質下降
- **NPM 套件**：`ecc-universal`（通用配置）+ `ecc-agentshield`（安全掃描）
- **GitHub App**：[ECC Tools Marketplace](https://github.com/marketplace/ecc-tools)

#### 適合場景

- 已有開發方法論，需要強化 AI agent 執行品質
- 多語言專案（TypeScript、Python、Go、Rust、Swift、Kotlin）
- 需要完整的 hook 系統和自動化驗證
- 重視安全性和程式碼品質的團隊

### 4.5 框架比較總表

| 面向 | Spec Kit | Superpowers | OpenSpec | ECC |
|------|----------|-------------|---------|-----|
| 核心定位 | SDD 工具箱 | 完整開發方法論 | 輕量 SDD 框架 | **Agent Harness** |
| 層次 | 方法論 | 方法論 | 方法論 | **基礎設施** |
| Greenfield | 非常強 | 強 | 可用但非主打 | 中性（不限定） |
| Brownfield | 較弱 | 中等 | **最強**（delta 系統） | 中性（不限定） |
| TDD 整合 | 不內建 | **硬性約束** | 不內建 | **多語言 TDD**（7+） |
| EDD 整合 | 不內建 | 不內建 | 不內建 | **原創**（eval-harness） |
| Brainstorming | 不內建 | **完整流程** | `/opsx:explore` | planner + architect agent |
| BDD 整合 | 可搭配 | 可搭配 | spec 格式接近 Gherkin | 可搭配 |
| 規格格式 | PRD + 技術計劃 | 設計文件 + spec | RFC 2119 + scenario | CLAUDE.md + rules |
| 任務粒度 | 標記平行化 `[P]` | 2-5 分鐘/任務 | 由 AI 拆解 | 由 agent 拆解 |
| Review 機制 | 人工 review | **雙階段** subagent + 人 | `/opsx:verify` | **6 種 reviewer** agent |
| 驗證機制 | 無 | spec 合規檢查 | `/opsx:verify` | **六階段 Verification Loop** |
| Hook 系統 | 無 | 無 | 無 | **完整**（5 種時機） |
| 持續學習 | 無 | 無 | 無 | **Instinct-based**（v2.1） |
| 安全掃描 | 無 | 無 | 無 | **內建**（AgentShield） |
| 學習曲線 | 中等 | 較高 | **最低** | 中等（可選組件多） |
| 硬性約束 | 中等 | **最嚴格** | 最寬鬆（fluid） | **可調**（Hook Profile） |
| 與其他框架 | 獨立使用 | 獨立使用 | 獨立使用 | **互補**（可疊加） |

#### 框架定位四象限

```
                    方法論完整度 高
                         │
         Superpowers     │     Spec Kit
         (方法論+紀律)    │     (SDD 工具箱)
                         │
  ─── Agent 導向 ────────┼──────── Spec 導向 ───
                         │
         ECC             │     OpenSpec
         (Agent Harness) │     (輕量 SDD)
                         │
                    方法論完整度 低
```

**關鍵洞察**：ECC 不在方法論維度上競爭，而是在正交的「Agent 基礎設施」維度上提供價值。最佳策略是選一個方法論框架（Spec Kit / Superpowers / OpenSpec）+ ECC 作為執行層。

---

## 5. SDD、BDD、TDD、EDD 的關聯性

### 層次關係

由上往下是「範圍縮小、精確度增加」的過程：

- **SDD** 回答「我們要建什麼？為什麼？」→ 功能/模組級
- **BDD** 回答「系統的行為是否符合業務需求？」→ 使用者場景級
- **TDD** 回答「這段程式碼是否正確運作？」→ 函式/方法級
- **EDD** 回答「AI agent 是否可靠地完成任務？」→ Agent 可靠性級

### 三層模型 + 橫切關注點

```
┌─────────────────────────────────────────────┐
│  SDD（Spec-Driven Development）             │  ← 意圖層：定義「為什麼」和「做什麼」
│  規格驅動開發                                │     PRD + Spec → AI 的 prompt
├─────────────────────────────────────────────┤
│  BDD（Behavior-Driven Development）         │  ← 行為層：定義「系統應該怎麼表現」
│  行為驅動開發                                │     .feature（Gherkin）→ 行為規格
├─────────────────────────────────────────────┤
│  TDD（Test-Driven Development）             │  ← 實作層：定義「程式碼應該怎麼運作」
│  測試驅動開發                                │     Unit test → Production code
└─────────────────────────────────────────────┘
  ═══════════════════════════════════════════════
  EDD（Eval-Driven Development）                ← 橫切關注點（Cross-Cutting Concern）
  評估驅動開發                                      驗證「AI agent 是否可靠」
  pass@k/pass^k → Agent 可靠性量化                  適用於所有層次
```

SDD、BDD、TDD 三者是由上往下的分解關係。EDD 不在這個堆疊中，而是一個 **橫切關注點**（類似架構中的 logging / security）— 它驗證的是「產出程式碼的 AI 是否可靠」，而非程式碼本身，適用於所有層次。

### 串接方式（以「密碼重設」為例）

**Step 1 — SDD 規格**：

```markdown
## 功能：密碼重設
### 目的
用戶忘記密碼時，能透過 email 安全地重設密碼。
### 約束
- Token 有效期 1 小時
- 新請求會使舊 token 失效
- 每小時最多 3 次請求（防濫用）
```

**Step 2 — BDD 場景**：

```gherkin
Feature: 密碼重設

  Rule: Token 有效期 1 小時
    Example: 在有效期內重設成功
      Given 用戶 "alice@example.com" 已請求密碼重設
      When 用戶在 30 分鐘內使用 token 重設密碼
      Then 密碼應更新成功

    Example: 過期 token 被拒絕
      Given 用戶 "alice@example.com" 已請求密碼重設
      When 用戶在 2 小時後使用 token 重設密碼
      Then 應顯示 "連結已過期，請重新申請"
```

**Step 3 — TDD 測試**：

```typescript
test('expired token should be rejected', () => {
  const token = createResetToken('alice@example.com');
  advanceTime(2 * 60 * 60 * 1000);
  expect(() => resetPassword(token, 'newPass123'))
    .toThrow('連結已過期，請重新申請');
});
```

**Step 4 — EDD 驗證**（AI 協作時新增）：

```typescript
// eval: AI agent 生成密碼重設功能的可靠性
const eval = {
  name: 'password-reset-generation',
  runs: 5,  // 跑 5 次
  grader: 'code-based',
  criteria: [
    'all TDD tests pass',
    'no hardcoded tokens',
    'rate limiting implemented',
  ],
  metrics: {
    'pass@5': 'target >= 99%',   // 5 次內至少成功一次
    'pass^5': 'target >= 80%',   // 5 次都成功的機率
  }
};
```

### 核心工作流（含 EDD）

```
SDD 規格  ──拆解──▶  BDD 場景  ──驅動──▶  TDD 測試  ──生成──▶  程式碼  ──驗證──▶  EDD
   │                    │                    │                   │                │
   │     回饋發現       │    回饋遺漏        │    回饋設計       │   回饋品質     │
   ◀────────────────────◀────────────────────◀───────────────────◀────────────────┘
```

**向下**是「分解」：大規格 → 行為場景 → 單元測試 → AI 可靠性驗證。**向上**是「回饋」：EDD 發現 AI 不可靠 → 回頭檢查測試/場景/規格。

### 在 AI 協作中的角色分配

| 層次 | 人的角色 | AI 的角色 |
|------|---------|----------|
| SDD | 定義意圖、約束、審查技術設計 | 草擬 spec、發現遺漏、任務拆解 |
| BDD | 主導 Example Mapping、確認場景 | 將範例寫成 .feature、建議邊界案例 |
| TDD | 審查測試品質 | 從 .feature 生成測試 + production code |
| EDD | 定義 eval 標準、審查指標 | 執行 eval、產出可靠性報告 |

**關鍵洞察：越上層越需要人的判斷，越下層越適合 AI 加速。EDD 是橫切關注點，驗證的是 AI 本身而非程式碼。**

### 選擇組合

| 情境 | 建議組合 |
|------|---------|
| 新產品從 0 到 1 | SDD + BDD + TDD（完整走一遍） |
| 既有產品加功能 | BDD + TDD（規格已在既有文件中） |
| 修 bug | TDD 即可（先寫重現 bug 的測試） |
| AI 主導生成大量程式碼 | SDD + TDD + EDD（規格約束 + 測試護欄 + 可靠性驗證） |
| 跨團隊協作、需求常變 | BDD 為主（建立共識比寫測試更重要） |
| 高風險/合規場景 | SDD + BDD + TDD + EDD（全部走一遍） |

### 核心差異總表

| 面向 | SDD | BDD | TDD | EDD |
|------|-----|-----|-----|-----|
| 回答的問題 | 我們要建什麼？為什麼？ | 系統的行為是否符合業務需求？ | 這段程式碼是否正確運作？ | AI agent 是否可靠？ |
| 產出物 | Markdown 規格文件 | Gherkin Feature 檔案 | Unit Test | Eval report + 指標 |
| 參與者 | PM + 架構師 + AI | 業務 + 開發 + 測試 | 開發者 + AI | 開發者 + AI |
| 粒度 | 功能/模組級 | 使用者場景級 | 函式/方法級 | Agent 任務級 |
| 與 AI 的關係 | 規格 = AI 的 prompt | scenario = AI 的驗收標準 | test = AI 的護欄 | eval = AI 的品質量化 |
| 何時需要 | 新功能定義 | 複雜業務規則 | 所有程式碼 | AI 大量生成時 |

---

## 6. 現有專案基礎盤點

### 6.1 Velarch

**專案性質**：local AI 系統的結構控制層（CLI + Web Dashboard）

**技術棧**：Bun + TypeScript + React + Ink

**已有的 SDD 實踐**：

| 項目 | 內容 | 成熟度 |
|------|------|--------|
| Spec 模板 | 10 個必填章節（背景、設計原則、功能範圍、資料結構、影響檔案、AC 等） | 高 |
| AC 分類 | AC-auto（自動化驗證，須轉為 test case）+ AC-manual（人工驗證） | 高 |
| 影響檔案清單 | 每個 spec 列出需修改的檔案 + 變更程度（小/中/大） | 高 |
| Feature Map | 40+ 功能的狀態追蹤（✅🚧⚠️🔲） | 高 |
| process.md | 執行紀錄（決策日誌、問題排查），完成後凍結 | 高 |
| Spec 完成 Checklist | 7 項驗收（AC 通過、測試通過、typecheck、文件更新） | 高 |
| Spec 狀態流轉 | draft → approved → in-progress → done | 高 |

**已完成**：14 個 specs（spec-001 ~ spec-014），46+ test passes

**缺少**：PRD 階段、BDD 結構化場景、嚴格 TDD、Agent 分工

### 6.2 Albedo

**專案性質**：個人自動化工作流程平台（n8n + PostgreSQL + Web Dashboard）

**技術棧**：n8n + PostgreSQL + Bun + React

**已有的 SDD 實踐**：

| 項目 | 內容 | 成熟度 |
|------|------|--------|
| 多種 Spec 模板 | Workflow 型 + Infra 型，各有不同必填章節 | 高 |
| process.md | 詳細的決策日誌 + 問題排查紀錄 + 運維知識累積 | 非常高 |
| Checklist 測試 | 每個 spec 有明確的功能驗收 checklist | 中 |
| 版本管理 | Git Tag 格式：spec-NNN/vX.Y.Z | 高 |

**已完成**：6 個 specs（spec-001 ~ spec-006），8 家銀行帳單分析全通過

**獨特貢獻**：

- Workflow spec 模板（觸發方式、節點流程、外部服務整合）
- process.md 的深度決策紀錄（15 個邊界情況、上線後維運事件）
- n8n Code Node 限制清單（Task Runner VM 陷阱）

**缺少**：PRD 階段、Given-When-Then 格式、Agent 分工

### 6.3 Proji WhereSpent

**專案性質**：以「專案」為主軸的支出收入追蹤 APP

**技術棧**：Flutter + SQLite + Clean Architecture + Riverpod

**已有的 SDD 實踐**：

| 項目 | 內容 | 成熟度 |
|------|------|--------|
| PRD | 563 行的完整產品規格書（資料模型、金額規則、頁面流程、NFR） | 非常高 |
| Specs Overview | 13 個 specs 的依賴關係圖 + 建議開發順序 + 可平行開發標記 | 高 |
| Spec 模板 | 以使用者為中心（User Story + Given-When-Then）+ MoSCoW 優先級 | 高 |
| Progress 模板 | 14 個區段（進度統計、任務清單、技術決策、障礙、經驗總結） | 高 |
| Testing 模板 | 覆蓋率表 + AC 對應 + 品質指標 | 高 |
| 4 個 Agent | spec-writer、implementer、test-writer、reviewer | 高 |
| 測試規範 | 三層金字塔（Unit + Widget + E2E）+ 覆蓋率目標 | 高 |
| 架構規範 | Clean Architecture 三層 + 依賴規則 + 目錄結構 | 高 |
| DB 規範 | SQLite schema 設計 + 命名規範 + 索引策略 + Migration | 高 |
| Schema 參考 | 單一權威來源（schema-reference.md） | 高 |

**已完成**：12 個 specs done + 1 個進行中，4 套主題系統

**獨特貢獻**：

- 4 Agent 分工模型（spec-writer → reviewer → implementer → test-writer → reviewer）
- 測試金字塔 + 覆蓋率目標表
- Spec 模板以業務語言為主（WHAT + WHY，不含 HOW）
- Reviewer agent 有完整的審查清單（Spec 審查 + Code 審查 + 嚴重性分級）

**缺少**：BDD Example Mapping、嚴格 TDD 先行（測試目前在實作後）

### 6.4 三專案最佳實踐對照

| 最佳實踐 | Velarch | Albedo | Proji | 統一流程 |
|---------|---------|--------|-------|---------|
| PRD | ❌ | ❌ | ✅ | 採用 Proji |
| .feature 行為規格（獨立檔案） | ❌ | ❌ | ❌ | **新增**（Gherkin 標準格式） |
| Spec 模板（技術設計導向） | ✅（技術導向） | ✅（workflow 導向） | ✅（業務導向） | 合併三者，聚焦 HOW |
| AC-auto 指向 .feature | ❌ | ❌ | ❌ | **新增** |
| AC-manual checklist | ✅ | ❌ | ❌ | 採用 Velarch |
| 任務拆解（2-5 min + [P]） | ❌ | ❌ | ❌ | **新增**（參考 Spec Kit/Superpowers） |
| 影響檔案清單 + 變更程度 | ✅ | ❌ | ❌ | 採用 Velarch |
| Feature Map | ✅ | ❌ | ✅（specs-overview） | 保留兩種 |
| progress.md（進度+決策合併） | ✅ | ✅（詳細） | ❌ | 合併 Velarch/Albedo |
| 4+2 Agent 分工 | ❌ | ❌ | ✅（4 agent） | 擴展 Proji（+2 輔助） |
| Agent 編排協議 | ❌ | ❌ | ❌ | **新增**（參考 Superpowers） |
| 測試金字塔 + 覆蓋率 | ❌ | ❌ | ✅ | 採用 Proji |
| 設計原則 + 理由 | ✅ | ❌ | ❌ | 採用 Velarch |
| Schema 單一權威來源 | ❌ | ❌ | ✅ | 採用 Proji |
| Verification Loop | ❌ | ❌ | ❌ | **新增**（參考 ECC） |
| Reviewer 審查清單 | ❌ | ❌ | ✅ | 採用 Proji |

---

## 7. 統一開發流程設計

### 7.1 流程概覽（六階段 Phase 0-5）

```
Phase 0     Phase 1        Phase 2         Phase 3     Phase 4      Phase 5
 PRD    ──▶  Spec       ──▶  Develop    ──▶  Verify  ──▶  Review  ──▶  Close
 探索       規格與設計     開發(TDD)       驗證         審查         完成
 ─────     ─────────     ──────────     ─────       ─────        ─────
 Human     Human+AI      AI 主導        自動化       Human        Human+AI
            → Review     (per-task)                  → Approve
```

**Human 介入點**（僅三個）：

| 介入點 | 何時 | 做什麼 |
|--------|------|--------|
| ① PRD Approve | Phase 0 結束 | 確認問題定義與方向 |
| ② Spec Review | Phase 1 結束 | 審查 .feature + spec.md |
| ③ Final Review | Phase 4 | 審查程式碼 + approve merge |

Phase 2（Develop）和 Phase 3（Verify）之間由 AI 自主驅動，Human 不需介入，除非 AI escalate。

**文件流**：

```
prd-NNN.md → features/*.feature → specs/NNN/spec.md → specs/NNN/progress.md
```

### 7.2 文件架構與三層職責

```
docs/
├── prd-NNN.md                       ← WHY + WHAT（需求規格）
├── features/                        ← 行為規格（按業務領域）
│   ├── auth/
│   │   ├── login.feature
│   │   ├── password-reset.feature
│   │   └── rate-limiting.feature
│   └── payment/
│       ├── checkout.feature
│       └── refund.feature
├── specs/                           ← 技術設計（按實作單元）
│   ├── specs-overview.md
│   ├── NNN-feature-name/
│   │   ├── spec.md
│   │   └── progress.md
│   └── templates/
│       ├── prd-template.md
│       ├── spec-template.md
│       └── progress-template.md
├── feature-map.md                   ← 功能追蹤
└── architecture-report.md           ← 架構決策

guideline/                           ← 開發規範
├── README.md
├── testing-guideline.md
└── [language-or-framework]/

.claude/agents/                      ← Agent 定義
├── spec-writer.md
├── implementer.md
├── test-writer.md
├── reviewer.md
├── verifier.md
└── security-reviewer.md
```

**三層文件的職責**：

| 文件 | 職責 | 回答什麼 | 順序 |
|------|------|---------|------|
| `prd-NNN.md` | 需求規格 | WHY + WHAT（為什麼做、做什麼） | ① 最先 |
| `features/*.feature` | 行為規格 | WHAT 的具體化（系統應該怎麼表現） | ② 中間 |
| `specs/NNN/spec.md` | 技術設計 | HOW（怎麼做到） | ③ 最後 |

> 先探索行為（.feature），再做技術設計（spec.md）。你要先知道「系統該怎麼表現」，才能決定「技術上怎麼做到」。

**features 和 specs 的關係**：多對多

- 一個 `.feature` 可被多個 spec 實作（大功能拆多個 spec）
- 一個 spec 可實作多個 `.feature` 的場景（相關行為一起做）
- spec.md 中用 reference 指向對應的 `.feature` scenario

### 7.3 Phase 0: PRD — 產品探索

**Agent**：`spec-writer`（擴展職責）或 PM 自行撰寫

**可跳過條件**：< 1 人天的需求、bug fix、技術債、config 變更

**流程**：

```
需求/想法
  ├─ 小需求（< 1 人天）→ 跳過 PRD，直接進 Phase 1
  └─ 中大需求
       ├─ 1. Problem Statement（一句話描述問題）
       ├─ 2. Evidence（為什麼知道這是問題？）
       ├─ 3. Outcome（成功長什麼樣？可衡量指標）
       ├─ 4. Solution Options（2-3 方案 + 推薦）
       └─ 5. Not Doing（明確排除項目）
```

**產出物**：`docs/prd-NNN.md`

**退出條件**：PRD approved + 拆解為 feature / spec 清單

### 7.4 Phase 1: Spec — 規格與設計

本階段整合原本分開的 BDD Discovery、BDD Formulation 和 SDD 規格撰寫。先探索行為（.feature），再做技術設計（spec.md），確保技術方案基於完整的行為理解。

**Agent**：`spec-writer`

```
Step 1              Step 2              Step 3                    Step 4
Example Mapping ──▶ .feature 撰寫 ──▶ spec.md 撰寫           ──▶ Review
  探索情境            行為規格化          技術設計 + 任務拆解         審查
```

#### Step 1: Example Mapping（探索情境）

四色卡片法：

| 顏色 | 代表 | 說明 |
|------|------|------|
| 🟡 黃色 | Story | 要實作的功能 |
| 🔵 藍色 | Rule | 驗收條件 / 業務規則 |
| 🟢 綠色 | Example | 具體情境（正面 + 反面） |
| 🔴 紅色 | Question | 未解決的疑問 |

**可跳過條件**：

| 情境 | Example Mapping 深度 |
|------|---------------------|
| Config / UI 微調 | 跳過（直接寫 .feature） |
| 純 CRUD | 輕量（列出 happy path + error path） |
| 業務規則複雜 | **完整 Example Mapping** |
| 多角色 / 多狀態流轉 | **完整 Example Mapping** |

#### Step 2: 撰寫 .feature（行為規格）

將 Example Mapping 的成果寫成 Gherkin 格式的 `.feature` 檔案，放在 `docs/features/` 下按業務領域組織：

```gherkin
Feature: 密碼重設

  Rule: Token 有效期 1 小時

    Example: 有效期內重設成功
      Given 用戶 "alice@example.com" 已請求密碼重設
      When 用戶在 30 分鐘內使用 token 重設密碼
      Then 密碼應更新成功

    Example: 過期 token 被拒絕
      Given 用戶 "alice@example.com" 已請求密碼重設
      When 用戶在 2 小時後使用 token 重設密碼
      Then 應顯示 "連結已過期，請重新申請"

  Rule: 防濫用限制

    Example: 超過頻率限制
      Given 用戶在過去 1 小時內已請求 3 次密碼重設
      When 用戶再次請求密碼重設
      Then 應顯示 "請稍後再試"
```

**每條 Rule 至少要有正面和反面範例。**

#### Step 3: 撰寫 spec.md（技術設計 + 任務拆解）

基於 `.feature` 已確立的行為，設計技術方案。spec.md 聚焦於 **HOW**（怎麼做到），不重複 .feature 已定義的行為：

- 架構選型與理由
- 資料結構 / Schema 設計
- API / 介面定義
- 影響檔案 + 變更程度
- 約束與限制
- **實作任務清單**（參考 Spec Kit / Superpowers）

**任務拆解範例**：

```markdown
## 實作任務

### 依賴圖
task-1, task-2 [P] → task-3 (depends: 1,2) → task-4 (depends: 3)

### 任務清單
1. [P] 定義 ResetToken model — 影響: src/models/token.ts — ~2 min
2. [P] 定義 TokenService interface — 影響: src/services/token.ts — ~3 min
3. [ ] 實作 POST /reset-password — 依賴: 1, 2 — ~5 min
   - feature ref: features/auth/password-reset.feature#有效期內重設成功, #過期token被拒絕
4. [ ] 加入 rate limiting — 依賴: 3 — ~5 min
   - feature ref: features/auth/password-reset.feature#超過頻率限制
```

- **任務粒度**：每個任務 2-5 分鐘（參考 Superpowers），AI 單次成功率最高
- **`[P]` 標記**：可平行執行的任務（參考 Spec Kit）
- **feature ref**：每個任務對應的 `.feature` scenario，供 test-writer 生成測試

#### Step 4: Review

Reviewer agent 或 Human 審查 `.feature` + `spec.md`。

**退出條件**：

- 🔴 Question = 0（Example Mapping 的紅色卡片全部解決）
- `.feature` 覆蓋每條 Rule 的正面 + 反面範例
- `spec.md` 任務清單完整，依賴關係明確
- Review approved

> **Enterprise 擴展**：如果團隊有非技術 stakeholder 需要閱讀行為規格，
> 可搭配 Cucumber / SpecFlow 將 `.feature` 接上自動化驗收測試。
> `.feature` 檔案不需修改，只需額外撰寫 step definition code。

### 7.5 Phase 2: Develop — 開發（逐任務 TDD）

本階段整合 TDD 和實作，採用 **逐任務的 TDD 迴圈**（參考 Superpowers），而非「先寫完所有測試再實作」。每個任務完成後立即驗證，AI 的 context 保持小而精準。

**Agent**：`test-writer` + `implementer`（per-task 交替）

#### 核心迴圈

```
for each task in spec.md 任務清單:
  ┌─────────────────────────────────────────────┐
  │  1. test-writer:                            │
  │     讀取 task 的 feature ref                │
  │     → 生成對應測試 → 確認 RED              │
  │                                             │
  │  2. implementer:                            │
  │     讀取 spec.md 技術設計 + RED test        │
  │     → 寫最小實作 → 確認 GREEN              │
  │                                             │
  │  3. 重構（測試保持 GREEN）                   │
  │                                             │
  │  4. 輕量驗證（lint + type check）           │
  │     ├── 通過 → 下一個 task                  │
  │     └── 失敗 → 重試（最多 3 次）            │
  │              └── 仍失敗 → escalate 給 Human │
  └─────────────────────────────────────────────┘
```

#### 平行執行

標記 `[P]` 的任務可由多個 subagent 同時處理：

```
task-1 [P] ──→ subagent A ──→ ✅
task-2 [P] ──→ subagent B ──→ ✅
                                 ├──→ task-3（依賴 1+2）──→ subagent C
```

#### 測試金字塔

```
        ╱╲
       ╱ E2E ╲         少量（Phase 3 Verify 做）
      ╱────────╲
     ╱ Integration╲    適量（跨模組任務做）
    ╱──────────────╲
   ╱  Unit Tests    ╲  大量（每個任務都做）
  ╱──────────────────╲
```

**覆蓋率目標**：整體 ≥ 80%，核心邏輯 ≥ 90%。細分模組目標放在各專案的 `testing-guideline.md`。

**退出條件**：所有任務 GREEN + Lint / Type check 通過

### 7.6 Phase 3: Verify — 驗證

> 整合 ECC Verification Loop 概念，在人工 Review 前自動化完成機械性品質檢查。

**Agent**：`verifier`（工具限制：僅 Bash + Read）

**六階段驗證流水線**（來自 ECC）：

```
1. Build     → 確認專案可建構
2. Type Check → 型別檢查通過（tsconfig / mypy / go vet）
3. Lint      → 風格規範通過（ESLint / Ruff / golangci-lint）
4. Test Suite → 所有測試通過 + 覆蓋率達標
5. Security  → 無已知漏洞（依賴掃描 + 硬編碼密鑰檢查）
6. Diff Review → 變更差異合理性（檔案數、行數、是否觸碰敏感路徑）
```

**產出**：結構化驗證報告

```markdown
### Verification Report
- Build: ✅ PASS
- Type Check: ✅ PASS (0 errors)
- Lint: ✅ PASS (0 warnings)
- Test Suite: ✅ PASS (46/46, coverage 82%)
- Security: ✅ PASS (0 vulnerabilities)
- Diff Review: ⚠️ 12 files changed, 340 additions
```

**可跳過條件**：config 變更、文件更新等不涉及程式碼的變更

**失敗處理**：Verify 失敗 → AI（implementer）自動修復 → 重新 Verify（最多 3 次）→ 仍失敗 → escalate 給 Human

**退出條件**：六階段全部 PASS（或 ⚠️ 項目已確認可接受）

### 7.7 Phase 4: Review — 審查

**Agent**：`reviewer` + `security-reviewer`

Phase 3 的自動化驗證已覆蓋基礎品質檢查（build、lint、test、security scan）。Phase 4 應聚焦於 **需要人類判斷** 的面向。

**審查 1 — Spec 合規性**：

- `.feature` 的每個 scenario 都有對應測試且通過
- AC-manual 都已手動驗證
- 沒有超出 spec 範圍的變更

**審查 2 — 程式碼品質（需要人類判斷）**：

- 架構分層是否合理
- 命名是否表達意圖
- 錯誤處理是否完善
- 程式碼可讀性

**審查 3 — 測試品質**：

- 測試名稱描述行為
- 邊界案例有覆蓋

**回饋嚴重性**（沿用 Proji）：

| 級別 | 定義 | 處理 |
|------|------|------|
| 🔴 Critical | 安全漏洞、資料損壞、架構違反 | 必須修復 |
| 🟡 Major | 規範違反、缺少測試、效能問題 | 應該修復 |
| 🟢 Minor | 風格建議、優化建議 | 可選修復 |

**團隊 PR Review 規範**：至少 1 人 approve，🔴 Critical = block merge

**退出條件**：Review approved

### 7.8 Phase 5: Close — 完成

**完成 Checklist**：

```markdown
### 驗收
- [ ] .feature 的每個 scenario 都有對應測試且通過
- [ ] AC-manual 全數驗證

### 品質
- [ ] Verification Report 全部 PASS（Phase 3）
- [ ] 覆蓋率達標（整體 ≥ 80%）

### 文件
- [ ] progress.md 已更新至最終狀態（含決策紀錄）
- [ ] feature-map.md / specs-overview.md 已同步
- [ ] 若有架構變更 → architecture 文件已更新
- [ ] 若有 Schema 變更 → schema-reference 已更新

### 版控
- [ ] PR merged / commit 完成
- [ ] Git tag 已標記（如適用）
```

### 7.9 Phase Transition Gates

| 轉換 | 觸發方式 | Human 必須動作 | 可自動化 |
|------|---------|---------------|---------|
| Phase 0 → 1 | Human approve PRD | ✅ 必須 approve | 否 |
| Phase 1 → 2 | Reviewer approve spec + feature | ✅ 必須 approve | 否 |
| Phase 2 → 3 | 所有任務 GREEN + lint pass | 可自動判斷 | ✅ 是 |
| Phase 3 → 4 | Verify 六階段全 PASS | 可自動判斷 | ✅ 是 |
| Phase 4 → 5 | Human approve review | ✅ 必須 approve | 否 |

**設計原則**：Phase 0→1 和 Phase 1→2 需要 Human 判斷（確認意圖和設計）；Phase 2→3→4 由 AI 自主推進；Phase 4→5 需要 Human 最終確認。

### 7.10 失敗路徑與回退機制

| 失敗點 | 回退到 | 機制 | 最大重試 |
|--------|-------|------|---------|
| Phase 2 單一任務失敗 | 同任務重試 | AI 自動重試 | 3 次 |
| Phase 2 任務反覆失敗 | Human 介入 | Escalate：調整 spec 或 Human 接手 | — |
| Phase 3 Verify 失敗 | Phase 2 對應項目 | AI 自動修復 → 重新 Verify | 3 次 |
| Phase 4 Review 🔴 Critical | Phase 2（重新實作） | 修復後重跑 Phase 3-4 | — |
| Phase 4 Review 🟡 Major | Phase 2（修正） | 修復後重跑 Phase 3-4 | — |
| Phase 4 Review 需改 spec | Phase 1（修改 spec） | 回到 Phase 1 Step 3-4 | — |

**Escalation Protocol**：

```
AI 嘗試 3 次仍失敗
  → 產出失敗報告（嘗試了什麼、失敗原因、建議）
  → 通知 Human
  → Human 選擇：
      a. 提供提示讓 AI 重試
      b. Human 手動修復
      c. 調整 spec / task 拆分
      d. 放棄此任務，標記為 blocked
```

### 7.11 跳過判斷速查表

| 需求規模 | PRD | Spec | Develop | Verify | Review |
|---------|:---:|:----:|:-------:|:------:|:------:|
| Bug fix | 跳 | 輕量（AC-auto only） | **寫重現測試 → 修復** | 輕量 | AI |
| Config 變更 | 跳 | 跳 | 直接改 | 跳 | 跳 |
| UI 微調 | 跳 | 輕量 | Widget test + 實作 | 輕量 | AI |
| 小功能 (< 1天) | 跳 | **必須**（可省 Example Mapping） | **必須** | **必須** | PR |
| 中功能 (1-5天) | **必須** | **必須**（含 Example Mapping） | **必須** | **必須** | PR |
| 大功能 (> 5天) | **必須** | **必須**（完整 Example Mapping） | **必須** | **完整** | PR + TL |

### 7.12 Profile 制

流程結構不變，深度依 profile 調整：

| Profile | 適用 | Discovery 深度 | .feature | Cucumber | 任務 Review |
|---------|------|---------------|----------|----------|------------|
| **Solo** | 個人開發 | 輕量 Example Mapping | ✔ | ✗ | AI 自動 |
| **Team** | 小團隊（2-5 人） | 完整 Example Mapping | ✔ | ✗ | AI + 同儕 |
| **Enterprise** | 大團隊 / 有 PM·QA | 完整 + Three Amigos | ✔ | ✔ 可選 | AI + 人工 + QA |

---

## 8. Agent 分工模型

### 8.1 4+2 Agent 模型

在 Proji 原有的 4 個核心 Agent 基礎上，參考 ECC 的 16 agent 架構，新增 2 個輔助 Agent：

```
┌──────────────┐    ┌──────────────┐
│ spec-writer  │───▶│  reviewer    │───┐
│ Phase 0-1    │    │ (spec 審查)   │   │
│ PRD+Feature  │    │ Phase 1      │   │
│ +Spec+Tasks  │    └──────────────┘   │
└──────────────┘                       │
                                       ▼  approve
                    ┌─────────────────────────────────────────┐
                    │  Phase 2: per-task TDD loop              │
                    │                                          │
                    │  ┌──────────┐    ┌──────────────┐       │
                    │  │test-writer│───▶│ implementer  │ ×N    │
                    │  │  (RED)    │    │   (GREEN)    │       │
                    │  └──────────┘    └──────────────┘       │
                    └──────────────────────┬──────────────────┘
                                           │ all GREEN
                    ┌──────────────┐       ▼
                    │  verifier    │  Phase 3: Verify
                    │ Phase 3      │
                    │ 六階段驗證    │
                    └──────┬───────┘
                           │ all PASS
                    ┌──────▼───────┐    ┌──────────────┐
                    │  reviewer    │    │  security-   │
                    │ (code 審查)   │    │  reviewer    │
                    │ Phase 4      │    │ Phase 3-4    │
                    └──────────────┘    └──────────────┘
```

| Agent | Phase | 職責 | 工具限制 |
|-------|-------|------|---------|
| spec-writer | 0-1 | PRD、Example Mapping、.feature、spec.md、任務拆解 | 完整 |
| reviewer | 1, 4 | Spec + Feature 審查、Code 審查 | 完整 |
| test-writer | 2 | 從 .feature scenario 生成 test（RED） | 完整 |
| implementer | 2 | 從 spec + RED test 生成實作（GREEN） | 完整 |
| verifier | 3 | 六階段自動化驗證 | **僅 Bash + Read** |
| security-reviewer | 3-4 | 漏洞掃描、依賴檢查、密鑰偵測 | **僅 Read**（不可 Edit） |

> **工具沙箱**（來自 ECC）：security-reviewer 只有 Read 權限，確保安全審查不會意外修改程式碼。verifier 只需執行建構和測試命令。

#### 與 ECC 16 Agent 的對應

| 本流程 Agent | 對應 ECC Agent | 差異說明 |
|-------------|---------------|---------|
| spec-writer | planner + architect | ECC 拆成規劃和架構兩個 agent |
| reviewer | code-reviewer + 語言特定 reviewer | ECC 按語言細分（go-reviewer、python-reviewer 等） |
| test-writer | tdd-guide | ECC 的 tdd-guide 偏引導而非直接撰寫 |
| implementer | （無直接對應） | ECC 預設 AI 直接實作，不設專門 agent |
| verifier | e2e-runner + build-error-resolver | ECC 按問題類型拆分 |
| security-reviewer | security-reviewer | 完全一致，包含工具沙箱設計 |

**選擇建議**：小型團隊（1-5 人）用 4+2 模型即可；大型團隊或多語言專案可參考 ECC 的細粒度 agent 分工。

### 8.2 Agent 編排協議

```
Phase 0-1（Human 觸發）:
  Human: "開始 spec"
    → spec-writer 執行 Step 1-3（Example Mapping → .feature → spec.md）
    → reviewer 審查
    ├── approve → 自動進入 Phase 2
    └── reject → spec-writer 修正（最多 3 次）→ escalate

Phase 2（AI 自主驅動）:
  for each task in spec.md:
    [P] 標記 → 可平行 spawn subagent
    → test-writer(task) → 確認 RED
    → implementer(task) → 確認 GREEN
    ├── pass → next task
    └── fail → retry (max 3) → escalate to Human
  all tasks done → 自動進入 Phase 3

Phase 3（自動化）:
  → verifier 執行六階段驗證
  → security-reviewer 安全掃描
  ├── all pass → 自動進入 Phase 4
  └── fail → implementer 修復 → 重驗（max 3）→ escalate

Phase 4（Human 觸發）:
  → reviewer 產出審查報告
  → Human review + approve
  ├── approve → Phase 5 Close
  └── reject → 回到 Phase 2 或 Phase 1
```

### 8.3 個人開發模式

個人開發時，不需要模擬角色切換。AI agent 自動串接，Human 只在關鍵點介入：

```
Human: 撰寫/確認 PRD
Human: "/spec" → AI 自動完成 Phase 1 Step 1-3
Human: Review .feature + spec.md → Approve
  → AI 自主完成 Phase 2（TDD per task）
  → AI 自主完成 Phase 3（Verify）
Human: Review → Approve → Close
```

Human 實際操作只有：**定義需求 → 審查規格 → 審查成果**。中間全部由 AI 驅動。

### 8.4 團隊角色對應（5-10 人）

| 角色 | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|------|---------|---------|---------|---------|---------|---------|
| PM / Tech Lead | 主導 | Review | — | — | Final approve | — |
| 開發者 | 參與 | 主導 + Review | 觸發 + 監控 | 觸發 | 提 PR | Close |
| 測試（如有） | — | 參與 Discovery | 協助 | Review 報告 | Review | — |
| AI | Brainstorm | 草擬全部 | **主導開發** | **自動化** | 品質檢查 | Checklist |

---

## 9. 統一模板設計

### 9.1 PRD 模板

```markdown
# PRD-NNN: [功能名稱]

## Meta
- 提案人：
- 日期：
- 狀態：proposal / approved / rejected

## 1. 問題描述
[一句話：誰遇到什麼問題？]

## 2. 證據
- [數據 / 使用者回饋 / 觀察]

## 3. 預期成果
- [可衡量的成功指標]

## 4. 方案選項
| 方案 | 優點 | 缺點 | 工時估算 |
|------|------|------|---------|
| A    |      |      |         |
| B    |      |      |         |
→ 推薦：[X]，理由：[...]

## 5. 不在範圍內
- [明確排除項目]

## 6. 拆解為 Feature / Spec
- [ ] features/[domain]/[name].feature
- [ ] spec-NNN: [子功能]

## 7. 依賴與影響
- 依賴哪些既有功能/spec
- 影響哪些既有功能/spec
```

### 9.2 統一 Spec 模板

spec.md 聚焦於 **技術設計（HOW）**，行為規格由 `.feature` 檔案承載。

```markdown
# Spec-NNN: [功能名稱]

## Meta
- 類型：Feature / Workflow / Infra / Refactor
- 狀態：draft / approved / in-progress / done
- PRD：prd-NNN（如有）
- 實現的行為規格：
  - features/[domain]/[name].feature
  - features/[domain]/[name].feature
- 依賴：spec-001, spec-003
- 建立：YYYY-MM-DD
- 更新：YYYY-MM-DD

## 1. 背景與目的
[對應 PRD 哪個問題，要達成什麼目標]

## 2. 設計原則
- [決策 1 + 理由]
- [決策 2 + 理由]

## 3. 不在範圍內
- [明確排除項目]

## 4. 技術設計
### 架構
[模組劃分、依賴關係]

### 資料結構
[Interface / Schema 變更，diff 格式]

### API / 介面
[CLI 指令 / API endpoints / 頁面設計]

## 5. 影響檔案
| 檔案 | 變更程度 | 說明 |
|------|---------|------|
| src/xxx.ts | 小 (< 30 行) | Add interface |
| src/yyy.ts | 大 (> 150 行) | New module |

## 6. 實作任務
### 依賴圖
task-1, task-2 [P] → task-3 (depends: 1,2) → task-4 (depends: 3)

### 任務清單
1. [P] [任務描述] — 影響: [檔案] — ~[N] min
2. [P] [任務描述] — 影響: [檔案] — ~[N] min
3. [ ] [任務描述] — 依賴: 1, 2 — ~[N] min
   - feature ref: features/[domain]/[name].feature#[scenario]
4. [ ] [任務描述] — 依賴: 3 — ~[N] min
   - feature ref: features/[domain]/[name].feature#[scenario]

## 7. 驗收標準
### AC-auto
見 `實現的行為規格` 中列出的 .feature 檔案。

### AC-manual（人工驗證）
- [ ] [步驟 + 預期結果]

## 8. 約束與限制
- [技術約束]
- [效能期望]

## 9. 成功標準
- 驗收標準全數通過
- [商業成功指標（如有）]
```

### 9.3 Progress 模板

合併原本分開的 progress.md（進度追蹤）和 process.md（決策紀錄）為單一檔案：

```markdown
# Spec-NNN: [功能名稱] — Progress

## 進度
- [x] Phase 1: Spec approved (YYYY-MM-DD)
- [ ] Phase 2: Develop
  - [x] Task 1: 定義 model ✅
  - [ ] Task 2: 實作 API
  - [ ] Task 3: 加入 rate limiting
- [ ] Phase 3: Verify
- [ ] Phase 4: Review
- [ ] Phase 5: Close

## 決策紀錄

### YYYY-MM-DD: [決策標題]
- 考慮：[選項與比較]
- 決定：[選擇與理由]

### YYYY-MM-DD: [問題排查]
- 問題：[描述]
- 原因：[根因]
- 解法：[怎麼修的]
```

### 9.4 文件結構

```
docs/
├── prd-NNN.md                         ← Phase 0 產出（需求規格）
├── features/                          ← Phase 1 Step 2 產出（行為規格）
│   ├── auth/
│   │   ├── login.feature
│   │   └── password-reset.feature
│   └── payment/
│       └── checkout.feature
├── specs/
│   ├── specs-overview.md              ← Spec 索引與依賴圖
│   ├── NNN-feature-name/
│   │   ├── spec.md                    ← Phase 1 Step 3 產出（技術設計）
│   │   └── progress.md               ← Phase 2-5 持續更新（進度+決策）
│   └── templates/
│       ├── prd-template.md
│       ├── spec-template.md
│       └── progress-template.md
├── feature-map.md                     ← 功能追蹤
├── architecture-report.md             ← 架構決策
└── reference/                         ← 技術規格

guideline/                             ← 開發規範
├── README.md
├── testing-guideline.md
├── [language-or-framework]/
└── database/

.claude/agents/                        ← Agent 定義
├── spec-writer.md
├── implementer.md
├── test-writer.md
├── reviewer.md
├── verifier.md
└── security-reviewer.md
```

---

## 10. 工具與 Skills 建議

### 推薦安裝

```bash
# Phase 0: 產品探索（中大需求時使用）
npx skills add phuryn/pm-skills@brainstorm-ideas-new -g -y
npx skills add phuryn/pm-skills@identify-assumptions-new -g -y

# Phase 2-3: BDD + TDD（繁體中文，與現有 spec 風格相容）
npx skills add samzhu/agent-skills@bdd -g -y
npx skills add samzhu/agent-skills@tdd -g -y
```

### ECC 選用策略

ECC 是模組化設計，不需要全部安裝。根據需求選用：

```bash
# 方式 1: NPM 套件（推薦，最簡單）
npm install -g ecc-universal          # 通用配置
npm install -g ecc-agentshield        # 安全掃描（選用）

# 方式 2: 手動挑選組件
# 從 https://github.com/affaan-m/everything-claude-code 複製需要的檔案
```

| ECC 組件 | 建議 | 理由 |
|---------|------|------|
| `rules/common/testing.md` | **推薦** | 強制 TDD 流程的基礎規則 |
| `agents/tdd-guide.md` | 推薦 | TDD 引導 agent |
| `agents/code-reviewer.md` | 推薦 | 程式碼審查 agent |
| `agents/security-reviewer.md` | 推薦 | 安全審查（只讀沙箱） |
| `skills/verification-loop/` | **推薦** | 六階段驗證流水線 |
| `hooks/hooks.json` | 選用 | 事件驅動自動化（需依專案調整） |
| `skills/eval-harness/` | 選用 | EDD 指標（適合 AI 大量生成時） |
| `skills/continuous-learning-v2/` | 選用 | Instinct 持續學習（進階） |
| `skills/autonomous-loops/` | 選用 | 自主迴路（進階） |
| 語言特定 TDD skills | 按需 | Django/Spring Boot/Go/Rust 等 |

### 不建議安裝

**Spec Kit / Superpowers / OpenSpec** — 三個專案已有等效且更貼合的 SDD 流程，安裝這些框架會造成重複和衝突。但可參考其設計理念融入自有流程。

### 搭配建議

| 方案 | 組合 | 適用情境 |
|------|------|---------|
| A 最完整 | pm-skills + samzhu/bdd + samzhu/tdd + ECC（rules + agents + verification） | 正式專案、重視品質 |
| B 務實 + 品質 | samzhu/bdd + samzhu/tdd + ECC（rules + verification） | 既有專案迭代 + 品質保障 |
| C 最務實 | samzhu/bdd + samzhu/tdd | 既有專案迭代 |
| D 最輕量 | samzhu/tdd only | 個人開發、快速迭代 |
| E AI 密集 | samzhu/tdd + ECC（全套） | AI 大量生成程式碼的專案 |

---

## 11. 導入策略與改動摘要

### 各專案改動程度

| 改動 | Velarch | Albedo | Proji |
|------|---------|--------|-------|
| 新增 PRD 階段 | 新增 | 新增 | **已有**，不變 |
| .feature 檔案（行為規格獨立） | **新增** | **新增** | **新增** |
| Example Mapping | 新增 | 新增 | 新增（複雜規則時） |
| spec.md 改為技術設計（移除 AC-auto GWT） | **微調** | **微調** | **微調** |
| 任務拆解（2-5 min 粒度 + [P] 標記） | **新增** | **新增** | **新增** |
| 逐任務 TDD（test → impl per task） | **強化** | **強化** | **調整順序** |
| 4+2 Agent 模型 + 編排協議 | 新增 | 新增 | **微調**（+2 輔助 agent） |
| 影響檔案清單 | **已有** | 新增 | 新增 |
| progress.md（合併 process.md） | 微調 | 微調 | 新增 |
| Verification Loop（Phase 3） | **新增** | **新增** | **新增** |
| Phase Transition Gates + 失敗回退 | **新增** | **新增** | **新增** |

### 導入優先順序

建議分四階段導入：

**第一階段（立即可做）**：

1. 建立 `docs/features/` 目錄，開始用 `.feature` 檔案寫行為規格
2. 安裝 samzhu/agent-skills@bdd + @tdd

**第二階段（下個 spec 開始）**：

3. 統一 spec 模板（技術設計導向，AC-auto 指向 .feature）
4. 加入任務拆解（2-5 min 粒度 + [P] 標記 + feature ref）
5. 嘗試逐任務 TDD 迴圈

**第三階段（品質強化）**：

6. 導入 ECC Verification Loop（Phase 3 自動化驗證）
7. 導入 ECC testing rules（`rules/common/testing.md`）
8. 設定 verifier + security-reviewer agent（工具沙箱）
9. 定義 Phase Transition Gates + 失敗回退機制

**第四階段（團隊導入時）**：

10. 新增 PRD 階段
11. Agent 編排協議正式化
12. PR Review 規範 + 角色分工
13. Profile 制（Solo → Team → Enterprise）

---

## 12. 參考資料

### BDD / TDD 與 AI 協作

- [TDD: The Missing Protocol for Effective AI Collaboration (8th Light)](https://8thlight.com/insights/tdd-effective-ai-collaboration)
- [Why Does TDD Work So Well In AI-assisted Programming? (Codemanship, 2026)](https://codemanship.wordpress.com/2026/01/09/why-does-test-driven-development-work-so-well-in-ai-assisted-programming/)
- [AI for Better BDD (Humanizing Work)](https://www.humanizingwork.com/ai-for-better-bdd/)
- [Test-Driven Development with AI (Builder.io)](https://www.builder.io/blog/test-driven-development-ai)
- [TDD in the Age of Vibe Coding (Medium)](https://medium.com/@rupeshit/tdd-in-the-age-of-vibe-coding-pairing-red-green-refactor-with-ai-65af8ed32ae8)
- [Pair Programming & TDD in 2025 (Medium)](https://medium.com/@pravir.raghu/pair-programming-tdd-in-2025-evolving-or-obsolete-in-an-ai-first-era-00680ce93695)
- [Test-Driven AI Development (Awesome Testing)](https://www.awesome-testing.com/2025/10/test-driven-ai-development-tdaid)

### Spec-Driven Development

- [Spec-driven development with AI (GitHub Blog)](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Spec-Driven Development (Thoughtworks)](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- [SDD Tools: Kiro, spec-kit, Tessl (Martin Fowler)](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Spec-Driven Development: From Code to Contract (arXiv)](https://arxiv.org/abs/2602.00180)
- [Spec-Driven Development with Claude Code (Agent Factory)](https://agentfactory.panaversity.org/docs/General-Agents-Foundations/spec-driven-development)
- [6 Best SDD Tools for AI Coding in 2026 (Augment Code)](https://www.augmentcode.com/tools/best-spec-driven-development-tools)
- [SDD Comparison: BMAD vs spec-kit vs OpenSpec vs PromptX](https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/)

### SDD 框架與 Agent Harness

- [GitHub Spec Kit](https://github.com/github/spec-kit) — 75,859 stars
- [Superpowers](https://github.com/obra/superpowers) — 77,683 stars
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) — 29,513 stars
- [Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code) — 72,072 stars
- [ECC 官網](https://ecc.tools)
- [Superpowers Complete Guide 2026](https://pasqualepillitteri.it/en/news/215/superpowers-claude-code-complete-guide)
- [Diving Into SDD With Spec Kit (Microsoft)](https://developer.microsoft.com/blog/spec-driven-development-spec-kit)
- [ECC External Evaluation (claude-code-ultimate-guide)](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/docs/resource-evaluations/015-everything-claude-code-github-repo.md)

### Claude Code Skills

- [phuryn/pm-skills](https://github.com/phuryn/pm-skills) — 6,472 stars（PM 工具箱）
- [wondelai/skills](https://github.com/wondelai/skills) — 202 stars（經典書籍方法論）
- [thebushidocollective/han](https://github.com/thebushidocollective/han) — 106 stars（250+ skills 生態系）
- [anton-abyzov/specweave](https://github.com/anton-abyzov/specweave) — 87 stars（TDD + brainstorming）
- [samzhu/agent-skills](https://github.com/samzhu/agent-skills) — 0 stars（繁體中文 BDD + TDD）
- [bobmatnyc/claude-mpm-skills](https://github.com/bobmatnyc/claude-mpm-skills) — 20 stars（通用 TDD）
- [majiayu000/claude-arsenal](https://github.com/majiayu000/claude-arsenal) — 10 stars（Product Discovery）

### 其他

- [AI-Powered Development Workflow 2026 (DEV Community)](https://dev.to/devactivity/the-ai-powered-development-workflow-a-glimpse-into-2026-4h68)
- [AI-DLC 2026 (Han Research)](https://han.guru/papers/ai-dlc-2026/)
- [Best Claude Code Skills 2026 Rankings (OpenAI Tools Hub)](https://www.openaitoolshub.org/en/blog/best-claude-code-skills-2026)

---

> 本報告基於 2026 年 3 月的公開資料與實際專案經驗整理。
> 工具和框架的 star 數、版本號為撰寫時的快照，可能隨時間變化。
