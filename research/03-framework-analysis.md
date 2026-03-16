# 框架分析

本章分析五個主要的 AI 驅動開發框架，從中汲取 vif 的設計靈感。

## 總覽

| | Spec Kit | Superpowers | OpenSpec | ECC | gstack |
|---|---|---|---|---|---|
| GitHub | [github/spec-kit](https://github.com/github/spec-kit) | [obra/superpowers](https://github.com/obra/superpowers) | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | [garrytan/gstack](https://github.com/garrytan/gstack) |
| 維護者 | GitHub 官方 | Jesse Vincent | Fission AI | Affaan Mushtaq | Garry Tan |
| 定位 | SDD 工具箱 | 完整開發方法論 | 輕量 SDD 框架 | Agent Harness | 認知模式轉換工具 |

---

## Spec Kit（GitHub 官方）

### 核心理念：Power Inversion

> 過去幾十年，程式碼是王者，規格服務於程式碼。SDD 倒轉這個關係 — 規格不服務程式碼，程式碼服務規格。

### 工作流

```
/speckit.specify ──▶ /speckit.plan ──▶ /speckit.tasks ──▶ Implement
   建立規格            建立技術計劃         拆解任務          執行實作
```

| 階段 | 做什麼 | 產出 |
|------|--------|------|
| Specify | 從一句話描述生成完整規格 | `spec.md`（PRD） |
| Plan | 確保符合專案 constitution，轉化為技術架構 | `plan.md` + `data-model.md` + `contracts/` |
| Tasks | 拆解為可執行任務，標記可平行化 `[P]` | `tasks.md` |
| Implement | AI agent 逐一執行任務 | 程式碼 + 測試 |

### 核心原則

- **Specifications as the Lingua Franca** — 規格是主要產出物，程式碼只是表達
- **Executable Specifications** — 規格必須精確到可以生成可運作的系統
- **Continuous Refinement** — 持續驗證一致性
- **Bidirectional Feedback** — 生產環境的指標反過來影響規格演進

### vif 採用

- Power Inversion 哲學 → vif-spec 的 Hard Gate
- 任務平行化 `[P]` 標記 → spec.md 任務清單

---

## Superpowers（Jesse Vincent）

### 核心理念：完整 AI 協作方法論 + TDD 紀律

### 工作流

```
Brainstorm ──▶ Write Plan ──▶ Execute Plan（TDD）──▶ Code Review
  蘇格拉底式      拆解任務         Red-Green-Refactor     兩階段 review
  對話探索        2-5 分鐘粒度      subagent 執行          spec 合規 + 品質
```

### 關鍵 Prompt 語言

**Hard Gate：**
> 不可以寫任何程式碼，直到設計被人類批准。這適用於每一個專案，不管看起來多「簡單」。

**Anti-Pattern 防護：**
> 每個專案都需要設計。「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。

**TDD 硬性約束：**
> 如果 production code 出現在 test 之前，Superpowers 會刪掉它。這不是建議 — 這是約束。

**Verification Principle：**
> NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.
> 在驗證之前做出聲明是不誠實的，不是效率。

驗證五步閘門：辨識 → 執行 → 閱讀 → 驗證 → 只有之後才能聲明。

### vif 採用

- Hard Gate → vif-prd、vif-spec 的 Hard Gate
- Verification Principle → vif-verify 的五步閘門
- Don't Trust the Report → vif-review 的獨立驗證
- Spec Reviewer Loop（max 5 iterations）→ vif-spec Step 4
- Subagent 驅動 + 雙階段 review → vif-develop + vif-review

---

## OpenSpec（Fission AI）

### 核心理念：輕量、流動、Brownfield-first

```
fluid not rigid       — 沒有 phase gate，做有意義的事
iterative not waterfall — 邊建邊學，邊做邊精煉
easy not complex      — 輕量設定，最少儀式
brownfield-first      — 專為既有 codebase 設計
```

### 工作流

```
/opsx:explore ──▶ /opsx:propose ──▶ /opsx:apply ──▶ /opsx:archive
  探索想法           建立規格+計劃       實作任務          歸檔合併
```

### Explore 的 Stance

> **This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner.

- **Curious, not prescriptive** — 問自然浮現的問題，不要照腳本
- **Patient** — 不急著下結論，讓問題的輪廓自然顯現
- **Grounded** — 去看實際的 codebase，不要光靠理論
- **Don't fake understanding** — 如果不清楚，深入挖掘
- **Don't rush** — 探索是思考時間，不是任務時間
- **Do question assumptions** — 包括使用者的和你自己的

### Brownfield Delta 系統

```markdown
### Requirement: User Authentication [MODIFIED]
The system SHALL issue a JWT token upon successful login.
+ AND refresh tokens SHALL be rotated on each use.   ← ADDED
- AND tokens expire after 24 hours.                   ← REMOVED
```

### vif 採用

- Explore Stance → vif-prd 的「思考夥伴，不是問卷機器」
- Curious not Prescriptive → vif-prd 的探索指南
- 影響分析（新增 vs 修改）→ vif-spec 的影響分析表靈感來源

---

## Everything Claude Code — ECC（Affaan-M）

### 核心理念：AI Agent Harness 最佳化

> ECC 不是開發方法論，而是 AI agent 的作業系統層。它提供 agent 運作的基礎設施（harness），讓任何方法論都能更有效地執行。

```
Spec Kit / Superpowers / OpenSpec  →  定義「該做什麼」（方法論）
ECC                                →  定義「怎麼做得更好」（基礎設施）
```

### 核心架構

```
everything-claude-code/
├── agents/           ← 16 個專業化 subagent
├── skills/           ← 65+ 工作流程定義
├── commands/         ← 40+ slash commands
├── rules/            ← 分層規則系統（common + 語言特定）
├── hooks/            ← 事件驅動自動化
├── contexts/         ← 動態系統提示注入
└── examples/         ← 4 種技術棧範例配置
```

### 六階段驗證系統

```
Build → Type Check → Lint → Test Suite → Security Scan → Diff Review
```

### 特色

- **Agent 工具沙箱**：每個 agent 限制可用工具（如 security-reviewer 不能 Edit）
- **De-Sloppify Pattern**：獨立清理步驟取代負面指令
- **Hook Profile**：`minimal | standard | strict` 三種嚴格度

### vif 採用

- 六階段驗證 → vif-verify 的 Core pipeline
- De-Sloppify → vif-develop 的 De-Sloppify Pass
- Agent 工具沙箱 → verifier（Bash+Read）、security-reviewer（Read only）
- OWASP Top 10 → vif-verify Security Review

---

## gstack（Garry Tan）

### 核心理念：認知模式轉換

gstack 將通用 AI 助手轉變為**具有特定認知模式的專家團隊**。每個 skill 不是「功能」，而是「角色切換」。

由 Y Combinator 總裁 Garry Tan 開發。

### 8 個認知模式

| Skill | 角色 | 思維模式 |
|-------|------|---------|
| `/plan-ceo-review` | 創辦人 | 「這個需求裡隱藏的 10 倍產品是什麼？」 |
| `/plan-eng-review` | 工程經理 | 「每個 failure mode 的名字是什麼？」 |
| `/review` | 偏執的員工工程師 | 「什麼能通過 CI 卻在生產環境爆炸？」 |
| `/ship` | 發佈工程師 | 完全自動化 10 步驟 |
| `/qa` | QA 負責人 | 4 種模式（diff-aware / full / quick / regression） |
| `/retro` | 工程經理 | 數據驅動回顧，per-author 分析 |
| `/browse` | QA 工程師 | 持久化 Chromium daemon |
| `/setup-browser-cookies` | 會話管理器 | 瀏覽器 cookie 導入 |

### Nine Prime Directives

```
1. 零無聲失敗 — 每個失敗都必須可見
2. 每個錯誤都有名字 — 命名例外類別
3. 資料流有影子路徑 — nil、empty、upstream error
4. 互動有邊界案例 — 重複點擊、離開頁面、慢連線
5. 可觀測性是範圍，不是事後補救
6. 圖表是強制性的
7. 所有延遲的工作必須寫下來
8. 優化 6 個月後的狀態，不只是今天
9. 你有權說「刮掉重做」
```

### 三個範圍模式

| 模式 | 思維 |
|------|------|
| **SCOPE EXPANSION** | 「什麼會使這個 10 倍更好，只需 2 倍努力？」 |
| **HOLD SCOPE** | 最高嚴謹度，不默默縮小或擴大 |
| **SCOPE REDUCTION** | 外科醫生般的審視，找到絕對最小可行版本 |

### 推薦導向的互動設計

> 「用指令的方式帶出推薦：『做 B。原因是：』— 不要說『Option B 可能值得考慮。』」

> 「One issue = one AskUserQuestion. Never combine multiple issues into one question.」

### Error Mapping 表（強制性）

每支 API 必須有：

| 情境 | Exception | Rescued? | 救援動作 | 使用者看到 |
|------|-----------|----------|---------|-----------|
| API timeout | TimeoutError | Y | Retry 2x | 「暫時無法使用」 |
| Rate limit | RateLimitError | Y | Backoff | Nothing（透明） |
| Malformed JSON | ParseError | N ← GAP | — | 500 ← BAD |

> `rescue StandardError` is ALWAYS a smell. Name the specific exceptions.

### CRITICAL vs INFORMATIONAL 分層

| 類型 | 說明 | 處理 |
|------|------|------|
| **CRITICAL** | SQL Safety、Race Conditions、LLM Trust Boundary | 阻塞發佈 |
| **INFORMATIONAL** | Magic Numbers、Dead Code、Test Gaps 等 | 記錄在 PR |

### vif 採用

- 認知模式轉換概念 → vif 各 skill 的 Stance 設計
- Error Mapping → vif-api-spec 的錯誤映射表
- 推薦導向 → vif-prd 的「先說推薦再問」
- Nine Prime Directives → vif-spec 的檢核精神

---

## 比較總表

| 面向 | Spec Kit | Superpowers | OpenSpec | ECC | gstack |
|------|----------|-------------|---------|-----|--------|
| 核心定位 | SDD 工具箱 | 完整方法論 | 輕量 SDD | Agent Harness | 認知模式轉換 |
| Greenfield | 非常強 | 強 | 可用 | 中性 | 強 |
| Brownfield | 較弱 | 中等 | **最強** | 中性 | 強 |
| TDD | 不內建 | **硬性約束** | 不內建 | 多語言 | 不內建 |
| Brainstorming | 不內建 | **完整流程** | explore | planner agent | **CEO mode** |
| Review | 人工 | **雙階段** | verify | 6 種 reviewer | **分層** |
| 驗證 | 無 | spec 合規 | verify | **六階段** | checklist |
| 硬性約束 | 中等 | **最嚴格** | 最寬鬆 | 可調 | 嚴格 |
| 學習曲線 | 中等 | 較高 | **最低** | 中等 | 中等 |

### 框架定位

```
                    方法論完整度 高
                         │
         Superpowers     │     Spec Kit
         (方法論+紀律)    │     (SDD 工具箱)
                         │
  ─── Agent 導向 ────────┼──────── Spec 導向 ───
                         │
    ECC    gstack        │     OpenSpec
   (Harness)(認知模式)    │     (輕量 SDD)
                         │
                    方法論完整度 低
```

### vif 的定位

vif 不是第六個框架，而是**整合者**：

- 從 Spec Kit 取 Power Inversion 哲學
- 從 Superpowers 取 Hard Gate + Verification + TDD 紀律
- 從 OpenSpec 取 Explore Stance + 影響分析思維
- 從 ECC 取 Verification Loop + Agent 沙箱 + De-Sloppify
- 從 gstack 取認知模式轉換 + Error Mapping + 推薦導向

加上自己的：
- 兩種模式（完全自動化 + 輔助自動化）
- 11 skills + 6 agents 的完整架構
- 累積型設計文件（api-spec、ui-spec、schema）
- 影響分析（新增 vs 修改既有）
