# PRD / BDD / SDD / TDD / EDD 在 AI 協作時代的趨勢

> 順序對齊 vif 的開發流程：PRD → BDD → SDD → TDD → EDD

## 方法論的層次與實踐順序

### 概念層次（抽象到具體）

```
┌─────────────────────────────────────────────┐
│  PRD（Product Requirements）                │  ← 意圖層：定義「為什麼」和「做什麼」
│  產品需求                                    │     需求探索 → PRD 文件
├─────────────────────────────────────────────┤
│  BDD（Behavior-Driven Development）         │  ← 行為層：定義「系統應該怎麼表現」
│  行為驅動開發                                │     Example Mapping → Gherkin .feature
├─────────────────────────────────────────────┤
│  SDD（Spec-Driven Development）             │  ← 設計層：定義「技術上怎麼做到」
│  規格驅動開發                                │     影響分析 → spec.md + 設計文件
├─────────────────────────────────────────────┤
│  TDD（Test-Driven Development）             │  ← 實作層：定義「程式碼應該怎麼運作」
│  測試驅動開發                                │     RED → GREEN → REFACTOR
├─────────────────────────────────────────────┤
│  EDD（Eval-Driven Development）             │  ← 驗證層：定義「AI agent 是否可靠」
│  評估驅動開發（ECC 原創）                     │     pass@k/pass^k → Agent 可靠性量化
└─────────────────────────────────────────────┘
```

### 實踐順序（vif 的開發流程）

```
PRD     ──探索──▶  BDD 場景  ──驅動──▶  SDD 規格  ──拆解──▶  TDD 測試  ──驗證──▶  EDD
(WHY+WHAT)        (HOW behaves)        (HOW to build)        (RED→GREEN)          (AI 可靠性)
   │                    │                    │                   │                │
   │     回饋發現       │    回饋遺漏        │    回饋設計       │   回饋品質     │
   ◀────────────────────◀────────────────────◀───────────────────◀────────────────┘
```

**向下**是「分解」：需求 → 行為場景 → 技術規格 → 單元測試。**向上**是「回饋」：寫測試時發現規格不足 → 寫規格時發現行為遺漏 → 寫行為時發現需求模糊。

### 比較

| 面向 | PRD | BDD | SDD | TDD | EDD |
|------|-----|-----|-----|-----|-----|
| 回答的問題 | 為什麼做？做什麼？ | 系統該怎麼表現？ | 技術上怎麼做到？ | 程式碼是否正確？ | AI agent 是否可靠？ |
| 產出物 | PRD 文件 | .feature 檔案 | spec.md + 設計文件 | Unit Test | Eval report |
| 參與者 | PM + PD | PM + SA + QA | SA + SD | PG + AI | PG + AI |
| 粒度 | 功能級 | 場景級 | 模組/API 級 | 函式級 | Agent 任務級 |
| vif skill | `/vif-prd` | `/vif-bdd` | `/vif-spec` | `/vif-develop` | — |

---

## BDD + AI 的最佳實踐

### Humanizing Work 的研究：AI 是 Reviewer，不是 Author

> Copilot 可以生成 Gherkin scenario，但生成的結果常常失敗於 BDD 的核心目的 — 對人類清楚表達行為。

**問題根源**：AI 訓練資料中充滿品質差的 Gherkin 範例。

**建議作法**：

| 原則 | 說明 |
|------|------|
| AI 不從零寫 scenario | 讓 AI review 和改寫現有的 Gherkin |
| 建立自己的 BDD 規範 | 放在 CLAUDE.md 或 project instructions |
| 三原則 | 具體的領域語言、去除雜訊、術語一致性 |
| AI 的最佳角色 | 協作 reviewer，而非主要作者 |

---

## SDD — Spec-Driven Development（規格驅動）

SDD 是 2025 年 Thoughtworks Technology Radar 列出的重要趨勢：

> 使用結構化的軟體需求規格作為 prompt，由 AI coding agent 生成可執行程式碼。

在 vif 流程中，BDD 的 .feature 是 SDD 的重要輸入。先透過 BDD 探索行為、建立共識，再進入 SDD 撰寫技術規格。

### SDD 在 vif 中的對應

| SDD 概念 | vif skill | 說明 |
|---------|----------|------|
| 影響分析 + 技術規劃 | `/vif-spec` | 判斷新增 vs 修改，撰寫 spec.md |
| API 設計規格 | `/vif-api-spec` | API 邏輯 + openapi.yaml + dbschema |
| UI 頁面規格 | `/vif-ui-spec` | 頁面欄位 + 互動 + API 呼叫 |

### SDD vs Vibe Coding

- **Vibe Coding** = 快速但缺乏紀律，直接讓 AI 寫程式碼
- **SDD** = 用結構化規格約束 AI，保持速度的同時確保品質
- 關鍵差異：SDD 要求「先寫規格再寫碼」

---

## TDD 作為 AI 協作的通訊協定

### 8th Light 的觀點：TDD 是人與 AI 的溝通協定

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

### Codemanship 的觀點：為什麼 TDD 在 AI 輔助下效果更好

> 用測試來 prompt，幫助模型釘住需求的含義，產生更精確的 pattern matching。

關鍵洞察：

- **小步驟**：AI 一次處理一個測試案例，比一次給整個規格準確度高很多
- **持續測試**：壞掉的程式碼讓 AI 產出 5 倍的 token 去處理不必要的複雜度
- **快速 code review**：小差異讓人更容易 review AI 的產出
- **具體範例**：比抽象規格更能限縮 AI 的搜索空間

DORA 數據顯示：頂尖效能團隊幾乎都在做 TDD，搭配 AI 後效果更顯著。

### Builder.io 的觀點：AI 讓 TDD 從「知道該做但跳過」變成「真正可行」

> AI 把 TDD 從 best-practice-you-skip 變成了 powerful way to scale resilient applications。

AI 解決了 TDD 最大的摩擦：

- **時間成本**：AI 大幅加速 boilerplate 和測試撰寫
- **維護負擔**：AI 可以幫助重構測試
- **覆蓋率**：AI 能建議人類遺漏的邊界案例

---

## EDD — Eval-Driven Development

Everything Claude Code（ECC）提出的原創方法論，將 **eval 視為 AI 開發的 unit test**：

### 定義

> 在讓 AI agent 寫程式碼之前，先定義 eval（評估標準），用量化指標驗證 AI 產出的可靠性。

### 與 TDD 的類比

| TDD | EDD |
|-----|-----|
| 先寫 unit test | 先定義 eval criteria |
| 跑測試 → RED | 跑 eval → 不通過 |
| 寫實作 → GREEN | 調整 prompt/agent → 通過 |
| Refactor | 最佳化 agent 配置 |
| 覆蓋率指標 | pass@k / pass^k 指標 |

### 核心指標

- **pass@k**：在 k 次嘗試中至少有一次成功的機率。衡量 AI agent 是否「有能力」完成任務
- **pass^k**：在 k 次嘗試中全部成功的機率。衡量 AI agent 的「可靠性」

```
pass@k = 1 - (1 - p)^k     ← 至少成功一次
pass^k = p^k                ← 每次都成功
```

例：一個 agent 的單次成功率 p = 0.8：
- pass@3 = 1 - (0.2)^3 = 99.2%（三次內幾乎一定會成功一次）
- pass^3 = (0.8)^3 = 51.2%（但三次都成功的機率只有一半）

### 三種 Grader

| Grader 類型 | 適用場景 | 說明 |
|------------|---------|------|
| Code-Based | 確定性輸出 | 字串比對、正則匹配、結構驗證 |
| Model-Based | 主觀品質 | 用另一個 LLM 評分（0-10） |
| Human | 最終驗收 | 人工審查，通常用於高風險場景 |

### EDD 在開發流程中的位置

```
SDD → BDD → TDD → Implement → EDD（驗證 AI 產出品質）→ Review
                                  ↑
                          新增的驗證層
```

EDD 不取代 TDD，而是在 TDD 之上加一層：TDD 驗證「程式碼是否正確」，EDD 驗證「AI agent 是否可靠」。

---

## TDAID — Test-Driven AI Development

Awesome Testing 提出的擴展模型：

```
Plan → Red → Green → Refactor → Validate
```

- **Plan**（新增）：定義 AI 生成的範圍與約束
- **Validate**（新增）：驗證 AI 產出是否符合原始意圖（不只是測試通過）

---

## Autonomous Loops 與 Continuous Learning

ECC 歸納了 6 種複雜度遞增的自主迴路模式，代表 AI 輔助開發從「人驅動」到「AI 自主」的光譜：

| 等級 | 模式 | 複雜度 | 說明 |
|------|------|--------|------|
| L1 | Sequential Pipeline | 最低 | 簡單的 `claude -p` 指令串接 |
| L2 | NanoClaw REPL | 低 | 內建持久化 session 的互動迴路 |
| L3 | Infinite Agentic Loop | 中 | 平行 sub-agent 生成 |
| L4 | Continuous PR Loop | 中高 | 自動建立 PR → 等待 CI → 合併 |
| L5 | De-Sloppify Pattern | 高 | 獨立清理步驟，避免負面指令汙染 |
| L6 | RFC-Driven DAG | 最高 | RFC 分解 → DAG → 多 agent 平行 → merge queue |

### Continuous Learning v2.1

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

---

## AI 協作實用原則總結

| 原則 | 具體作法 |
|------|---------|
| SDD 作為上層框架 | Markdown 規格文件作為 AI 的 prompt，BDD/TDD 在下層驗證 |
| BDD scenario 人主導 | Example Mapping 探索需求 → 人寫 Gherkin → AI review 品質 |
| 人寫測試意圖，AI 寫實作 | 你定義 test description，AI 生成 test body 和 production code |
| TDD 作為護欄 | 測試先行確保 AI 生成的程式碼始終在你定義的邊界內 |
| 微迭代 | 一次只給 AI 一個測試案例，不要一次丟整個需求 |
| 持續驗證 | 每次 AI 生成後立即跑測試，不累積未驗證的程式碼 |
| EDD 驗證 AI 可靠性 | 用 pass@k / pass^k 量化 AI agent 的能力與可靠性 |
| 規範放進 project context | BDD/TDD 規則寫入 CLAUDE.md，讓 AI 每次對話都遵守 |
| 研究先於實作 | 寫程式碼前先搜尋現有解決方案（search-first principle） |
