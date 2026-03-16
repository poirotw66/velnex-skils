# Skills 生態系調查

## BDD / TDD 相關 Skills

透過 `npx skills find` 搜尋，並讀取各 repo 的 SKILL.md 進行內容分析。

### BDD Skills

| Skill | Repo | Stars | 安裝數 | 特色 |
|-------|------|-------|--------|------|
| bdd-patterns | [thebushidocollective/han](https://github.com/thebushidocollective/han) | 106 | 72 | 模組化 BDD plugin（4 個 skill），融入 250+ skills 大生態系 |
| bdd-principles | thebushidocollective/han | 106 | 38 | BDD 核心概念、Three Amigos、Discovery-Development-Delivery |
| bdd | [samzhu/agent-skills](https://github.com/samzhu/agent-skills) | 0 | — | 完整三階段工作流（Discovery → Formulation → Automation），原生繁體中文 |
| doc-bdd | [vladm3105/aidoc-flow-framework](https://github.com/vladm3105/aidoc-flow-framework) | 9 | 37 | 文件驅動的 BDD |
| bdd-gherkin-specification | [jzallen/fred_simulations](https://github.com/jzallen/fred_simulations) | 1 | 26 | Gherkin 語法撰寫專用 |

### TDD Skills

| Skill | Repo | Stars | 安裝數 | 特色 |
|-------|------|-------|--------|------|
| test-driven-development | [bobmatnyc/claude-mpm-skills](https://github.com/bobmatnyc/claude-mpm-skills) | 20 | 91 | 通用 TDD，含 progressive disclosure，附帶子文件 |
| tdd | [samzhu/agent-skills](https://github.com/samzhu/agent-skills) | 0 | — | 嚴格 Red-Green-Refactor，「鐵律」設計，原生繁體中文 |
| test-driven-development | [thebushidocollective/han](https://github.com/thebushidocollective/han) | 106 | — | han 生態系 TDD plugin，偏 Elixir/TypeScript |
| tdd-expert | [anton-abyzov/specweave](https://github.com/anton-abyzov/specweave) | 87 | 16 | TDD 專家指導 |

### samzhu/agent-skills 深度分析

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

## 產品發想 / Discovery 相關 Skills

| Skill | Repo | Stars | 安裝數 | 特色 |
|-------|------|-------|--------|------|
| brainstorm-ideas-new | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | 6,472 | 118 | 三視角腦力激盪（PM/Designer/Engineer），背後是 ProductCompass 方法論 |
| brainstorm-ideas-existing | phuryn/pm-skills | 6,472 | 113 | 既有產品改善 |
| identify-assumptions-new | phuryn/pm-skills | 6,472 | 109 | 識別產品假設 |
| product-discovery | [majiayu000/claude-arsenal](https://github.com/majiayu000/claude-arsenal) | 10 | 118 | JTBD、Kano model，Hard Rules 設計（禁止 solution-first） |
| inspired-product | [wondelai/skills](https://github.com/wondelai/skills) | 202 | 91 | Empowered Teams + Discovery/Delivery 雙軌，附帶評分機制 |
| continuous-discovery | wondelai/skills | 202 | — | OST + 每週訪談節奏，與 inspired-product 互補 |
| spec-driven-brainstorming | [anton-abyzov/specweave](https://github.com/anton-abyzov/specweave) | 87 | 43 | 規格驅動的腦力激盪 |

### phuryn/pm-skills 深度分析

以 6,472 stars 遙遙領先，是目前最完整的 PM 工具箱，涵蓋 70+ skills：

- **Product Discovery**：brainstorm、assumptions、experiments、interview、OST
- **Product Strategy**：lean canvas、SWOT、pricing、vision
- **Market Research**：competitor analysis、personas、journey map
- **Go-to-Market**：GTM strategy、battlecard、growth loops
- **Execution**：PRD、OKR、sprint plan、retro

每個 skill 獨立、可單獨安裝。

### wondelai/skills 深度分析

每個 skill 對應一本經典書的框架：

- `inspired-product`：Marty Cagan《Inspired》
- `continuous-discovery`：Teresa Torres《Continuous Discovery Habits》
- `lean-startup`、`jobs-to-be-done`、`mom-test`、`blue-ocean-strategy` 等

有 references 子文件和互相交叉引用，附帶 0-10 評分機制。

## 綜合型生態系：Everything Claude Code（ECC）

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

## Skills 比較分析

### 按使用階段推薦

| 階段 | 推薦 Skill | 理由 |
|------|-----------|------|
| 產品發想 | phuryn/pm-skills | 6,472 stars，最完整的 PM 工具箱 |
| 持續探索 | wondelai/skills（continuous-discovery + inspired-product） | 理論最紮實，OST、雙軌制 |
| BDD | samzhu/agent-skills@bdd | 繁體中文、三階段完整、與 TDD 明確銜接 |
| TDD | samzhu/agent-skills@tdd | 繁體中文、嚴格紀律、反藉口設計 |
| TDD（多語言） | ECC tdd-workflow + 語言特定 skills | 7 種語言框架的 TDD 最佳實踐 |
| Agent Harness | ECC（完整安裝） | 72,072 stars，最完整的 agent 基礎設施 |
| 驗證與品質 | ECC verification-loop + eval-harness | 六階段驗證 + EDD 指標 |

### han 生態系的取捨

- han (106 stars) 規模龐大（250+ skills），適合「全家桶」團隊
- BDD skill 拆太細（4 個），且 `user-invocable: false` 不能直接用 slash command 觸發
- 適合 Elixir/Phoenix 技術棧的團隊
