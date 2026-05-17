# Velnex Presentation Outline

## 核心故事線 (Storyline)

大模型就像一匹體能驚人但在荒野中橫衝直撞的**「野馬」**。過去我們專注於打造更好的「韁繩」（提示詞）與「馬鞍」（RAG）。但真正的 AI 落地，從來不是單點專案，而是長期治理工程。要跨越從「技術可行」到「生產可用」的距離，我們需要一套完整的**「馬具與賽道沙盒 (Harness Engineering)」**。而 Velnex (Velocity Nexus) 生態系，旨在為企業打造端到端的 AI 治理賽道。

---

## 第一張：破局 — 從技術可行邁向生產可用

> 核心概念：AI 工程的演進與 Harness 治理

### 故事說明

真正的 AI 落地，從來不是單點專案，而是長期治理工程。我們必須認知到，依賴單一模型的聰明程度已經遇到瓶頸。AI 軟體工程歷經了三個演進階段：

| 階段 | 角色定位 | 解決的問題 | 技術手段 |
|------|---------|-----------|---------|
| **提示詞工程 (Prompt Engineering)** | 人類作為「指令者」 | 一次性互動的模糊性 | Few-shot、Chain-of-Thought、結構化 Prompt |
| **上下文工程 (Context Engineering)** | 人類作為「知識管理者」 | 模型知識斷裂 | RAG、Memory、Tool Use、MCP |
| **駕馭工程 (Harness Engineering)** | 人類作為「治理架構師」 | AI 的「自我評估失靈」 | 工具授權、權限邊界、多 Agent 制衡、回饋閉環 |

#### 為什麼需要 Harness Engineering？

- **自我評估失靈**：AI 很難對自己寫的程式保持客觀批判。讓同一個 Agent 既寫程式又驗證，等於讓學生自己改自己的考卷
- **上下文漂移**：長時間的開發對話中，AI 可能逐漸偏離原始需求，做出未經授權的「改善」
- **幻覺累積**：沒有外部閘門驗證，錯誤會在後續階段被放大，直到生產環境才暴露

> Harness Engineering 不是取代前兩個階段，而是將 Prompt 與 Context Engineering 納入系統化的治理框架中。韁繩和馬鞍仍然重要，但光有它們不夠——還需要賽道和規則。

#### Harness Engineering 的核心原則

```
Human Steer, Agents Execute（人類掌舵，Agent 執行）
```

- 人類負責「方向」與「決策」（what & why）
- AI 負責「執行」與「產出」（how）
- 系統負責「約束」與「驗證」（guardrails）

### 講者備忘錄

> 「各位，我們不能指望大模型自己把系統寫好不出錯，因為 AI 很難對自己寫的程式保持客觀批判。Harness Engineering 的核心是：Human Steer, Agents Execute（人類掌舵，Agent 執行）。我們現在的挑戰，是怎麼為 AI 建構一套長期治理的賽道。」

---

## 第二張：生態全貌 — 認識 Velnex (Velocity Nexus)

> 核心概念：端到端的 Agentic Engineering Lifecycles

### 故事說明

為了落實長期治理，我們建構了 Velnex。它是一個 AI Agent 驅動的端到端工程流程，致力將 Harness Engineering 的理念落地為可操作的工程實踐。Velnex 不是單一工具，而是包含了三大核心 Plugins 的完整生態系：

| Plugin | 定位 | 涵蓋範圍 | 規模 |
|--------|------|---------|------|
| **vif** (Velocity AI Flow) | 核心開發引擎 | 從需求到交付的完整 SDLC | 15 Skills + 6 Agents |
| **vul** (Vulnerability Unified Lifecycle) | 資安修復引擎 | 從漏洞掃描分析到 PR 與清理完成 | 5 Skills |
| **vex** (Velnex Extensions) | 通用工具集 | 跨 Plugin 共用的 Agent 擴充 | 目前 1 Agent |

#### 生態系協作關係

```
┌─────────────────────────────────────────────────────┐
│                    Velnex Marketplace                │
│                                                     │
│   ┌──────────┐   ┌──────────┐   ┌──────────────┐   │
│   │   vif    │   │   vul    │   │     vex      │   │
│   │ 15 Skills│   │ 5 Skills │   │ Shared Agents│   │
│   │ 6 Agents │   │          │   │              │   │
│   └────┬─────┘   └────┬─────┘   └──────┬───────┘   │
│        │              │                 │           │
│        └──────────────┴────── uses ─────┘           │
│                                                     │
│   底層：Claude Code Plugin Architecture             │
└─────────────────────────────────────────────────────┘
```

#### vif 的三種使用模式

| 模式 | 適用場景 | 人類參與度 | 自動化程度 |
|------|---------|-----------|-----------|
| **完全自動化（Solo）** | Solo / 小團隊 | 關鍵決策點審核 | 高 |
| **輔助自動化（Team）** | 企業團隊 | 各角色各自驅動 AI | 中 |
| **God Mode** | 架構穩定的既有專案 | PRD 審核 + 成果檢視 | 極高 |

### 講者備忘錄

> 「Velnex 的核心價值，是為 AI 開發建構一套可重複、可治理的流程框架。讓團隊在這套框架裡驅動 AI，產出更快、品質更穩、風險更可控。」

---

## 第三張：開發引擎 — vif 的結構化開發流程

> 核心概念：將 SDLC 轉化為 AI 的防呆與治理賽道

### 故事說明

作為 Velnex 的核心，vif 提供了 **15 個 Skills 與 6 個 Agents**。它將完整的軟體開發生命週期拆解為 6 個階段，並在每個階段內針對大型語言模型的特性進行深度治理。

#### 六階段開發流程

```
Phase 0               Phase 1        Phase 2        Phase 3       Phase 4       Phase 5
探索定義          ──►   規劃設計  ──►   TDD 開發  ──►  自動驗證  ──►  程式審查  ──►  收尾
                                                                                
PRD                    Spec           Develop        Verify        Review        Close
Architecture           API Spec       RED→GREEN      Build         Spec 合規     文件同步
UI/UX                  UI Spec        →REFACTOR      Type Check    程式品質      Checklist
Prototype(optional)                                  Lint          手動測試清單
BDD(optional)                                        Test
                                                     Diff Review
                                                     Dep Audit
                                                     Security Scan
```

Phase 0 中標記為 optional 的 Skill 不做也不影響主流程，但有做能帶來額外效益：

- **`/vif-prototype`（HTML 原型）**：在寫程式前先產出可互動的 HTML 頁面，讓利害關係人直接在瀏覽器中體驗操作流程。可在 PRD 確認後或 Spec 完成後使用，適用於複雜 UX 或沒有 Figma 設計稿的場景，避免開發後才發現「這不是我要的」。
- **`/vif-bdd`（BDD Discovery）**：透過 Business、Developer、Tester 三視角探索，在開發前就暴露需求盲區，將模糊的期待轉化為可驗證的 `.feature` 行為規格。對於跨團隊協作或需求模糊的場景特別有價值。

#### 治理機制一：多 Agent 隔離防幻覺

負責實作的 `implementer` 與寫測試的 `test-writer` **強制分離**；負責驗證的 `verifier` 只能讀取檢測，**沒有修改程式碼的權限**，防止 AI 陷入盲目自信。

| Agent | 職責 | 權限 | 隔離目的 |
|-------|------|------|---------|
| **test-writer** | RED：撰寫失敗測試 | 完整（讀寫） | 強制測試先行 |
| **implementer** | GREEN + REFACTOR：最小實作 | 完整（讀寫） | 只實作，不碰測試 |
| **spec-auditor** | 規格文件審查（3 Pass） | 唯讀（Read + Grep + Glob） | 防止規格撰寫者自我合理化 |
| **verifier** | 驗證管線執行 | 唯讀（Bash + Read） | 只偵測，不修復 |
| **security-reviewer** | OWASP Top 10 安全掃描 | 唯讀（Read + Grep + Glob） | 獨立安全視角 |
| **reviewer** | 規格合規 + 程式品質 | 唯讀（Read + Bash + Grep + Glob） | 獨立審查，不可改 code |

> 核心原則：**寫程式的人不改自己的考卷**。test-writer 和 implementer 是不同 Agent；verifier 發現問題不能自己修，必須退回 Develop 階段。

#### 治理機制二：影響分析 (Brownfield Delta)

面對既有專案，vif 秉持**「修改比新增更危險」**的原則，強制 AI 在規劃前必須先評估新需求對既有模組的影響。

具體流程：
1. **Frontmatter 掃描** — glob 所有 `docs/api-specs/`、`docs/ui-specs/`、`docs/schema/`，讀取 YAML 元資料
2. **路徑比對** — 找到描述相同 endpoint / page / table 的既有文件
3. **風險分類** — 新增（低風險）vs. 修改（高風險，需標記 Breaking Change）
4. **影響分析表** — 列出所有受影響的 API、頁面、資料表及其現有規格文件

```markdown
### 影響分析範例
| 動作 | API | Path | 現有 ApiSpec |
|------|-----|------|-------------|
| 新增 | Login | POST /auth/login | — |
| 修改 | Get User | GET /users/:id | docs/api-specs/iam/user/get-user.md (adds lastLoginAt field) |
```

#### 治理機制三：progress.md 即狀態機

`progress.md` 是貫穿整個開發流程的狀態追蹤文件，扮演兩種閘門角色：

- **Exit Gate（出口閘門）**：確認當前階段的工作是否達到完成標準。例如：設計文件是否都通過 Self-Review？TDD 記錄是否完整？
- **Entry Gate（入口閘門）**：確認進入下一階段的前置條件是否滿足。例如：所有設計文件完成且通過 Pass 3 交叉審查，才允許進入開發階段。

```markdown
# Progress: Spec-001 User Login

## Design Documents
| Document | Status | Self-Review | Pass 3 |
|----------|--------|-------------|--------|
| spec.md | 完成 | ✓ | ✓ |          ← Exit Gate: Phase 1 完成標準
| api-spec auth/login | 完成 | ✓ | ✓ |  ← Entry Gate: Phase 2 前置條件
| ui-spec login-page | 完成 | ✓ | ✓ |

## Phase 2: Develop
- [x] Task 1: Implement POST /auth/login
  - RED: test/auth.test.ts — fails ✓
  - GREEN: src/auth.ts — passes ✓     ← Exit Gate: 每個 Task 的 TDD 完成記錄
  - REFACTOR: extract helper ✓
```

**閘門邏輯**：
- Design Documents 表格有任何「待撰寫」→ **BLOCK**（Entry Gate 未滿足）
- Self-Review 未完成 → **BLOCK**（Exit Gate 未通過）
- Pass 3 未通過 → 自動觸發 spec-auditor 交叉審查
- 全部 ✓ → 放行進入下一階段

**狀態管理的三個層次：**

- **`progress.md`**：管理單一 spec 的階段狀態（Exit Gate + Entry Gate）
- **`specs-overview.md`**：多 spec 的索引與排程入口，追蹤整個需求批次的完成進度
- **`/vif-flow`**：路由機制，負責判斷下一步該執行哪個 Skill、工作區如何切換

#### 治理機制四：模組高內聚的 Guideline 系統

既有專案的 API 或 UI 規範可獨立抽換，協助 AI 產出貼近既有技術棧，不需大改 Prompt。

```
guideline/
├── frontend/     ← 前端開發規範（注入 ui-spec、prototype 階段）
├── backend/      ← 後端開發規範（注入 api-spec 階段）
├── ui/           ← UI 設計規範（由 /vif-uiux 產出）
├── database/     ← 資料庫規範（注入 schema 階段）
└── testing/      ← 測試規範（注入 test-writer Agent）
```

各 Skill 依據上下文自動載入對應的 guideline 檔案，附加到 Agent dispatch prompt：

| Agent | 注入的 Guideline |
|-------|-----------------|
| test-writer | `guideline/testing/` |
| implementer | 依 api-spec/ui-spec 決定 `backend/` 或 `frontend/` |
| reviewer | 依檔案類型決定 |

> 設計原則：「Guideline 活在專案裡，不需要維護額外索引。」新專案只要放入對應的 guideline 檔案，AI 就會依據這些規範產出。

#### vif 的完整 Skill 與 Agent 總覽

| # | 階段 | Skill | 調度的 Agent | 關鍵產出 |
|---|------|-------|-------------|---------|
| 1 | Phase 0 | `/vif-prd` | — | prd-NNN.md, specs-overview |
| 2 | Phase 0 | `/vif-arch` | — | adr-NNN.md, CLAUDE.md 技術段 |
| 3 | Phase 0 | `/vif-uiux` | — | guideline/ui/ui-guideline.md |
| 4 | Phase 0 | `/vif-prototype` | — | docs/prototypes/*.html |
| 5 | Phase 0 | `/vif-bdd` | — | docs/features/**/*.feature |
| 6 | Phase 1 | `/vif-spec` | spec-auditor (Pass 1-3) | spec.md, progress.md |
| 7 | Phase 1 | `/vif-api-spec` | spec-auditor (Pass 1-2) | api-spec, openapi.yaml, schema |
| 8 | Phase 1 | `/vif-ui-spec` | spec-auditor (Pass 1-2) | ui-spec |
| 9 | Phase 2 | `/vif-develop` | test-writer, implementer, spec-auditor (Entry Gate) | src/, test/, progress TDD records |
| 10 | Phase 3 | `/vif-verify` | verifier (Stage 1-6), security-reviewer (Stage 7) | verification-report.md |
| 11 | Phase 4 | `/vif-review` | reviewer (Stage 1-2) | review-report.md, 手動測試清單 |
| 12 | Phase 5 | `/vif-close` | — | progress.md ✓, specs-overview ✓ |
| 13 | 跨階段 | `/vif-god` | 編排上述 Skills，間接驅動相關 Agents | god-mode-report.md |
| 14 | 跨階段 | `/vif-guideline` | — | guideline 內容注入 |
| 15 | 跨階段 | `/vif-flow` | — | 流程路由與工作區設定 |

### 講者備忘錄

> 「vif 的核心設計哲學是：不信任任何單一 Agent 的產出。寫測試和寫程式是不同的 Agent；驗證者只能看不能改；審查者獨立評估。這不是因為 AI 不好，而是因為任何 Agent——包括人類——都會有認知偏差。制度設計本身就是防幻覺的最佳手段。」

---

## 第四張：靈活調度與終極形態 — vif 的進階能力

> 核心概念：從彈性縮放到全自動化，再到跨 AI 協作

### 故事說明

vif 的治理賽道不是一成不變的。前一張講的是標準賽道與四大治理機制，這一張講賽道如何伸縮——從輕量 Bug fix 到全自動 God Mode，再到跨 AI 協作：

#### Skip Decision（流程縮放）

面對日常維護如 Bug fix，可動態跳過架構與設計階段，直接輕量化修復，兼顧敏捷與嚴謹。

> 以下為推薦的操作政策，團隊可依專案成熟度調整。

| 工作類型 | PRD | BDD | Spec | API/UI Spec | Develop | Verify | Review |
|---------|:---:|:---:|:----:|:------:|:-------:|:------:|:------:|
| **Bug fix** | skip | skip | light | skip | 寫重現測試 | Core only | AI only |
| **Config 修改** | skip | skip | skip | skip | 直接修改 | Core only | skip |
| **UI 微調** | skip | skip | light | update | 實作 | Core only | AI only |
| **小功能 (<1d)** | skip | optional | ✓ | ✓ | TDD | Core+opt | ✓ |
| **中功能 (1-5d)** | ✓ | optional | ✓ | ✓ | TDD | all | ✓ |
| **大功能 (>5d)** | ✓ | recommended | ✓ | ✓ | TDD | all | ✓ |

#### 終極形態 — God Mode（上帝模式）

這正是長期治理工程開花結果的展現。對於架構與規範已穩定收斂的既有專案，只要人類確認了 PRD（需求規格），vif 就能全自動執行。

```
/vif-prd → Human approve → /vif-god → Results Report → Human 檢視 → /vif-close
```

**Normal Mode vs. God Mode 關鍵差異：**

| 閘門 | Normal Mode | God Mode |
|------|------------|----------|
| Spec 審核 | 人類審核 | spec-auditor 自動收斂（最多 5 輪迭代） |
| Design 確認 | 人類確認 | spec-auditor Pass 1+2 通過即自動提交 |
| 測試策略 | 人類確認 | AI 依 CLAUDE.md 預設自動分類 |
| 🟡🟢 Findings | 人類決定（修改/略過） | AI 直接修復所有 |
| 手動測試 | 人類執行 | 列入 Results Report，人類後續處理 |
| Review 審核 | 人類審核 | 所有 findings 解決後自動提交 |

**自動化交付** — PRD approve 後到 Results Report 產出前，全程自動執行。人類的角色收斂為需求審核與成果檢視（含 Decisions Made 審計與手動測試清單確認）。

**安全閥**：如果任何自動閘門在最大重試次數後仍失敗（spec-auditor 5 輪、develop 3 次、verify/review 3 輪修復），God Mode 自動停止並產出 ESCALATED 狀態報告，交由人類介入。

**決策追蹤**：每個 AI 自主決策（規格方向、測試策略、哪些 🟡🟢 要修復）都記錄在 god-mode-report.md 的 Decisions Made 表格中，供人類事後審計。

#### 統一嚴重度系統（跨所有階段）

所有 findings 使用相同的四級分類：

| 嚴重度 | 處理方式 | 適用範圍 |
|-------|---------|---------|
| 🔴 Critical | 必須修復 | 安全漏洞、正確性問題、資料遺失 |
| 🟠 High | 必須修復 | 規格違反 |
| 🟡 Medium | 人類決定（修改 or 略過） | 可維護性、效能 |
| 🟢 Low | 人類決定（修改 or 略過） | 風格、偏好 |

適用於：Linting、Testing、Security Scan、Code Quality、Design Compliance — 全部統一語言。

#### 統一升級協議

所有 Skill 使用相同的升級格式，確保問題不會被吞掉：

```markdown
# Escalation Report

## 問題描述
[具體問題，不是「卡住了」]

## 已嘗試方案
1. [方案 A] → [結果]
2. [方案 B] → [結果]

## 建議選項
- a. 讓 AI 重試
- b. Human 手動處理
- c. 調整 spec / task
- d. 標記 blocked，跳過
```

#### 跨 AI 協作 — AI Cross-Review

Velnex 的治理不限於單一 AI 供應商。vif 設計了 **AI Cross-Review** 機制，讓第二個 AI（如 Codex）在不干擾原始管線的前提下，**並行獨立審查**，完成後合併 findings。

```yaml
### AI Cross-Review 設定（CLAUDE.md）
- design: codex           # Codex 獨立審查設計文件
- verify: codex           # Codex 獨立審查驗證結果
- review: codex           # Codex 獨立審查程式碼
```

**觸發時機（依模式不同）：**

| 設定 | Solo Mode 觸發時機 | Team Mode 觸發時機 |
|------|-------------------|-------------------|
| `design` | `/vif-develop` Entry Gate 統一觸發 | 各 design skill 完成時逐個觸發 |
| `verify` | `/vif-verify` 並行 | `/vif-verify` 並行 |
| `review` | `/vif-review` 並行 | `/vif-review` 並行 |

> 核心價值：同一個模型審查自己的產出，容易陷入相同的認知盲區。讓 Codex 作為獨立的第二意見，與 Claude 的審查結果交叉比對，能有效降低單一模型系統性偏差的風險。

### 講者備忘錄

> 「God Mode 不是憑空出現的魔術。當治理賽道建構得足夠完善、規範與影響分析都精準到位時，我們就能安心放手，讓 AI 全自動產出成果。而 Cross-Review 更進一步——讓不同的 AI 互相審查，降低單一模型的系統性偏差。這就是我們從『技術可行』邁向『生產可用』的方式。」

---

## 第五張：資安防護與共用工具 — vul 與 vex

> 核心概念：治理不只開發，還有安全與共用基礎設施

### 故事說明

當治理賽道、彈性調度、與全自動化都建立後，軟體交付仍不能只有功能開發。Velnex 透過 vul 與 vex 補足了長期治理的最後一哩路。

### vul (Vulnerability Unified Lifecycle)

提供 5 個階段的自動化修復 pipeline，涵蓋從漏洞掃描報告下載到建立 PR 與清理完成的完整安全生命週期。

#### 五階段漏洞修復管線

```
  /vul-analyze        /vul-decision       /vul-fix          /vul-pr           /vul-cleanup
  ┌──────────┐       ┌──────────┐       ┌──────────┐      ┌──────────┐      ┌──────────┐
  │ 下載掃描  │──►   │ AI 協助   │──►   │ 執行修復  │──►  │ 建立 PR   │──►  │ 清理     │
  │ 報告分析  │       │ 決策審查  │       │ 推送修復  │      │ 提交審核  │      │ Worktree │
  └──────────┘       └──────────┘       └──────────┘      └──────────┘      └──────────┘
   analyzed           decision            fixed             review            completed
                      ↘ no_action
```

#### 三大掃描來源整合

| 掃描工具 | 類型 | 漏洞分類 | 修復策略 |
|---------|------|---------|---------|
| **Checkmarx** (SAST) | 程式碼漏洞 | CWE 分類 (SQL Injection, XSS, Path Traversal...) | 原始碼層級修改（參數化查詢、輸出編碼等） |
| **Mend** (Dependencies) | 套件漏洞 | CVE 分類 + CVSS 評分 | 直接/間接依賴升級，constraints block |
| **Mend** (Docker Image) | 映像檔漏洞 | CVE 分類 + CVSS 評分 | Base Image 升級、Distroless 遷移、Alpine 替換 |

每個 commit 產出 3 份獨立分析報告，結合專案架構偵測（Gradle/Maven/Node.js/Go/Python）進行修復可行性評估。

#### Git Worktree 隔離機制

為了確保安全，每個漏洞修復被**隔離在獨立的 Git Worktree** 中：

```
Main Project (scan-branch, 預設 develop)  ← 不受修復影響
│
├── Worktree 1: project-security-abc1234
│   └── Branch: security/fix-abc1234   ← Commit A 的漏洞修復
│
├── Worktree 2: project-security-def5678
│   └── Branch: security/fix-def5678   ← Commit B 的漏洞修復（可並行）
│
└── docs/security/
    ├── scan-status.json               ← 狀態機（追蹤所有修復進度）
    └── {COMMIT_7}/
        ├── analyses/                  ← 3 份分析報告
        ├── decision-*.md              ← 決策報告
        └── fix-summary-*.md           ← 修復摘要
```

- 多個 commit 的修復可以**並行進行**，互不干擾
- 主專案始終保持乾淨的 scan-branch
- 每個 Worktree 有獨立的 branch、working directory、staging area

#### AI 協助決策流程

`/vul-decision` 實現了**人機協作決策**，AI 扮演安全專家角色：

| 決策模式 | 說明 | 適用場景 |
|---------|------|---------|
| **AI 建議** | AI 建議將 Critical/High 標記為修復，使用者確認後生效 | 快速處理大量漏洞 |
| **逐項審查** | 人類逐一審查每個漏洞 | 複雜專案、需精確判斷 |
| **全部修復** | 不審查直接修復所有漏洞 | 零容忍政策 |
| **全部略過** | 記錄理由後略過 | 計畫廢棄的舊系統 |

> 未來方向：對於規範成熟的專案，AI 可自動判斷並執行修復，僅在涉及重大風險或 Breaking Change 時才升級由人類決策。

支援的「不修復」理由：
- 誤報（工具設定問題）
- 不適用於實際使用場景
- 已有其他緩解措施
- 修復成本不合理
- 技術債接受

#### 跨平台 PR 建立

自動偵測 Git remote 並使用對應 CLI：

| 平台 | 偵測條件 | 使用工具 |
|------|---------|---------|
| **GitHub** | remote URL 含 `github.com` | `gh` CLI |
| **Azure DevOps** | remote URL 含 `dev.azure.com` | `az` CLI |

PR 內容自動包含：漏洞統計表、修復結果（成功/失敗/略過）、測試結果、審查重點、完整報告連結。

### vex (Velnex Extensions)

提供跨 plugin 的通用工具。目前聚焦於 **git-commit Agent**：

- **自動分析變更** — 自動判斷 staged/unstaged 變更，識別不相關的修改
- **規範化 Commit** — 自動產出符合 Conventional Commits 規範的 commit message
- **雙語格式** — 標題英文（imperative mood, max 50 chars）、body 繁體中文
- **Pre-commit Hook 處理** — 區分 formatter hook（自動重新 stage）與 lint hook（停止並報告）
- **安全防護** — 永不 commit 敏感檔案（.env, credentials）
- **跨 Plugin 呼叫** — 被 vif 和 vul 中需要 commit 的 Skill 呼叫

### 講者備忘錄

> 「vul 解決的是一個真實的企業痛點：當掃描報告一次丟出 200 個漏洞，人類工程師光是分類就要花一整天。vul 讓 AI 協助判斷哪些該修、哪些是誤報，然後自動執行修復、建立 PR。而 Worktree 隔離確保修復過程不會汙染主線程式碼。」

---

## 附錄：vif 補充細節

### A. TDD 開發循環（Phase 2 深入）

`/vif-develop` 嚴格執行 RED → GREEN → REFACTOR 循環：

```
Per-task loop:
  1. RED:    test-writer Agent 撰寫失敗測試 → 確認測試確實失敗
  2. GATE:   驗證測試存在且失敗（紅燈確認）→ 才放行 implementer
  3. GREEN:  implementer Agent 撰寫最小程式碼讓測試通過
  4. REFACTOR: implementer 重構（不可更動測試）
  5. COMMIT: 每個 task 獨立 commit → 更新 progress.md TDD 記錄
```

**嚴格約束**：沒有失敗測試 = 不准寫生產程式碼。違反者視為 TDD 完整性破壞。

**失敗處理**：3 次嘗試未成功 → 第 4 次自動升級交由人類介入。

### B. 驗證管線（Phase 3 深入）

`/vif-verify` 包含 7+1 個驗證 Stage，**即使前面的 Stage 失敗，後面仍然繼續執行**（全部跑完再統一報告）：

| Stage | 名稱 | 必須通過 | 執行者 |
|-------|------|---------|--------|
| 1 | Build | ✓ | verifier |
| 2 | Type Check | ✓ | verifier |
| 3 | Lint | ✓ | verifier |
| 4 | Test Suite + Coverage | ✓ | verifier |
| 5 | Diff Review（debug code、TDD records） | ✓ | verifier |
| 6 | Dependency Audit | ✓ | verifier |
| 7 | Security Code Review (OWASP Top 10) | ✓ | security-reviewer（唯讀） |
| 8 | Code Quality（`/simplify`，可選） | 建議 | Claude Code 內建 `/simplify` |

**原則**：「沒有新鮮的驗證證據 = 不准宣稱完成。」每次驗證都重新執行，不使用快取結果。

### C. 兩階段程式碼審查（Phase 4 深入）

`/vif-review` 的兩階段設計：

| 階段 | 審查內容 | 閘門性質 |
|------|---------|---------|
| **Stage 1: Spec 合規**（必須通過） | AC 覆蓋率、設計文件一致性、Scope 檢查 | 不通過 → 退回 Develop → 重新 Verify → 重新 Review |
| **Stage 2: 程式品質**（Stage 1 通過才執行） | 架構、可讀性、測試品質、意圖清晰度 | 不重複 lint/type/build 檢查 |

附帶產出**手動測試清單**：列出自動化無法驗證的項目（mock 邊界、平台特定、UX 視覺、外部整合）。

### D. BDD 三視角探索（Phase 0 選用）

`/vif-bdd` 不只是「寫需求」，而是從三個角度探索行為：

| 視角 | 關注焦點 |
|------|---------|
| **Business** | 解決什麼問題？價值是什麼？ |
| **Developer** | 技術約束？什麼可能壞掉？ |
| **Tester** | 什麼可能出錯？怎麼驗證？ |

然後轉化為 **Example Mapping**（四色卡片：Story / Rule / Example / Question），解決所有 🔴 Question 後才撰寫 `.feature` 檔案。

### E. 上下文視窗管理（LLM 原生設計）

vif 為 context window 有限的 AI Agent 量身設計：

| 層級 | 策略 | 目的 |
|------|------|------|
| **Layer 1（保證載入）** | progress.md 列出精確的設計文件路徑 → 全文讀取 | 核心文件不遺漏 |
| **Layer 2（按需發現）** | Frontmatter 掃描無關文件 → 僅載入相關者 | 避免「迷失在中間」問題 |
| **Guideline 注入** | dispatch 時一次性附加到 prompt | Agent 全程遵循 |

---

## 附錄：vul 補充細節

### A. 分析報告結構

每份分析報告包含：
- **統計表**：Critical / High / Medium / Low 數量
- **詳細漏洞清單**：CWE/CVE ID、檔案位置、影響分析
- **具體修復建議**：附程式碼範例
- **優先順序排列**：依嚴重度排序
- **相容性風險評估**：升級可能帶來的 breaking change

### B. 修復策略細節

**Checkmarx 程式碼修復範例：**

| CWE | 漏洞類型 | 修復方式 |
|-----|---------|---------|
| CWE-259/798 | 硬編碼憑證 | 移至環境變數 / Secret Manager |
| CWE-89 | SQL Injection | 參數化查詢或 ORM |
| CWE-79 | XSS | 輸出編碼或安全模板引擎 |
| CWE-22 | Path Traversal | 路徑驗證 + 白名單 |
| CWE-327 | 弱加密 | 現代加密演算法替換 |

**依賴升級策略：**
- **直接依賴** → 直接升級版本
- **間接依賴** → 使用 constraints block（Gradle）、dependencyManagement（Maven）、overrides（npm）
- 升級後自動執行依賴樹查詢確認修復已傳播

**Docker 映像檔修復策略（優先順序）：**
1. 升級 Base Image 至包含修補的版本
2. 在 Dockerfile RUN 中選擇性升級系統套件
3. 遷移至 Distroless（移除不必要的 OS 套件）
4. 切換至 Alpine（最小化 OS 套件）

### C. 狀態追蹤機制

`scan-status.json` 記錄每個 commit 的完整修復歷程：

```json
{
  "abc1234": {
    "status": "review",
    "analyzed_at": "2026-04-09T10:00:00Z",
    "decision_at": "2026-04-09T11:00:00Z",
    "fixed_at": "2026-04-09T14:00:00Z",
    "pr_url": "https://github.com/org/repo/pull/42",
    "vulnerability_count": { "total": 15, "to_fix": 12, "no_action": 3 },
    "worktree_path": "../project-security-abc1234"
  }
}
```

提供完整審計軌跡：時間戳、PR URL、漏洞統計、Worktree 路徑。
