# vif (Velocity AI Flow) — AI-Driven Development Flow

Claude Code plugin，提供 15 個 skills + 6 個 agents 的結構化開發流程。針對 LLM 的運作特性設計，覆蓋從需求到交付的完整 SDLC。

支援三種模式：
- **完全自動化** — 一人驅動 AI 完成整個開發流程（Solo / 小團隊）
- **輔助自動化** — 各角色各自驅動 AI 處理自己負責的工作（企業團隊）
- **God Mode** — PRD 確認後全自動執行 Spec→Review，最終看結果做調整（既有專案）

## 安裝

```bash
# 加入 marketplace
/plugin marketplace add /path/to/velnex
# 或 GitHub
/plugin marketplace add your-org/velnex

# 安裝 plugin
/plugin install vif@velnex
```

## 快速開始

```
# 模式一：直接告訴 AI 你想做什麼
> 我想加一個使用者登入功能

# 模式二：用對應的 skill
> /vif-spec    ← SA 規劃技術 spec
> /vif-api-spec ← Backend 撰寫 API 規格
```

---

## 核心原則

1. **行為先於設計** — 先理解「系統該做什麼」再設計「怎麼做到」
2. **影響分析是核心** — 判斷新增 vs 修改既有，修改比新增更危險
3. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **驗證即誠實** — 每一個聲明都要有新鮮的證據支撐
6. **最多重試 3 次** — 超過就 escalate 給 Human

## 為 AI 而設計

vif 不只是把傳統 SDLC 搬進 AI 工作流，而是針對 LLM 的運作特性進行架構設計。

### Context Window 管理

設計文件帶有 YAML Frontmatter（name、description、domain、module、spec 等 metadata）。AI 透過標準掃描流程檢索相關文件：

```
Glob 找檔案 → 讀 frontmatter 判斷相關性 → 只載入相關文件全文
```

模擬資深工程師的檢索行為：先看檔名、再掃標頭、最後才深入閱讀。避免載入無關文件造成注意力稀釋（Lost in the middle）。

開發階段進一步採用兩層載入：
- **第一層（確定）**：直接載入 progress.md 明確列出的設計文件
- **第二層（探索）**：frontmatter scan 發現跨域、跨 spec 的關聯文件

### progress.md 即狀態機

progress.md 不只是追蹤文件 — 它就是 Phase Gate 的判斷依據。有未完成項目就進不了下一個 Phase，不需要額外的 gate 邏輯。回溯也自然發生：清除受影響項目的狀態，gate 就重新生效。

### Agent 隔離

每個 agent 有明確的職責邊界，防止角色混淆：

- **test-writer / implementer** — 強制 RED 和 GREEN 分離，防止「一邊想實作一邊寫測試」
- **verifier / security-reviewer** — 只檢測不修改，防止驗證過程意外改到程式碼
- **spec-auditor / reviewer** — 獨立 context 審查，不受開發偏見影響

### 單一真實來源

- Frontmatter 活在檔案自身，不需要維護額外索引
- specs-overview 是唯一的 spec 追蹤入口
- 歷史交給 git，progress.md 只負責當前狀態

### 模組高內聚

每個 skill 的 template 和 reference 放在自己的目錄下，不跨 skill 引用資源。降低 AI 的路徑計算成本，減少幻覺（Hallucination）風險。

---

## 流程

### Skills

| Phase | Skill | 說明 |
|-------|-------|------|
| 0 — 探索 | `/vif-prd` | PRD 撰寫 |
| 0 — 探索 | `/vif-arch` | 架構決策 + ADR 記錄 |
| 0 — 探索 | `/vif-uiux` | UI/UX 設計基礎（色系、字型、元件規範） |
| 0 — 探索 | `/vif-bdd` | BDD Discovery → .feature（可選） |
| 1 — 規劃與設計 | `/vif-spec` | 影響分析 + 技術規劃 |
| 1 — 規劃與設計 | `/vif-prototype` | HTML 原型（可選，無 Figma 時使用） |
| 1 — 規劃與設計 | `/vif-api-spec` | API 規格 + openapi.yaml + dbschema |
| 1 — 規劃與設計 | `/vif-ui-spec` | UI 頁面規格 |
| 2 — 開發 | `/vif-develop` | TDD 開發（含測試策略選擇） |
| 3 — 驗證 | `/vif-verify` | 自動化驗證（Core + Optional） |
| 4 — 審查 | `/vif-review` | 程式碼審查（合規 + 品質） |
| 5 — 收尾 | `/vif-close` | 文件同步 + 完成檢查清單 |
| 跨階段 | `/vif-god` | God Mode：PRD 確認後全自動開發 |
| 跨階段 | `/vif-guideline` | 專案規範解析（被其他 skill 引用） |
| 跨階段 | `/vif-flow` | 流程編排 + routing |

### Agents

Skills 在特定階段會派遣 agents（subagents）執行工作：

| Agent | 用途 | 工具限制 | 派遣者 |
|-------|------|---------|--------|
| `test-writer` | TDD RED：寫失敗測試 | 無限制 | `/vif-develop` |
| `implementer` | TDD GREEN + REFACTOR：最小實作 | 無限制 | `/vif-develop` |
| `spec-auditor` | 審查 spec + 設計文件 | Read + Grep + Glob | `/vif-spec` |
| `reviewer` | 程式碼審查（合規 + 品質） | Read + Bash + Grep + Glob | `/vif-review` |
| `verifier` | 驗證 pipeline（Build → Test → Diff） | Read + Bash | `/vif-verify` |
| `security-reviewer` | OWASP Top 10 安全性檢查 | Read + Grep + Glob | `/vif-verify` |

> `/vif-verify` 的 Code Quality 檢查使用 Claude Code 內建的 `/simplify` skill（非 Claude Code 環境不適用）。

### 模式一：完全自動化

AI 為主力開發，Human 為審查角色。適合 solo 或小團隊。

兩種起始路徑：

- **技術先行**（先定技術邊界再寫需求）：`/vif-arch` + `/vif-uiux` → `/vif-prd` → ...
- **產品先行**（先定需求再選技術）：`/vif-prd` → `/vif-arch` + `/vif-uiux` → ...

> `/vif-arch` 會自動偵測是否已有 PRD，有的話會讀取作為技術選型的參考依據。

以下以技術先行為例：

```
/vif-arch + /vif-uiux（首次）
    │
    ▼
/vif-prd ────────────────────────────── AI 直接
    │ Human approve → commit
    ▼
/vif-bdd ────────────────────────────── AI 直接
    │ commit
    ▼
/vif-spec ───────────────────────────── AI 直接
    │  影響分析 → 撰寫 spec.md
    │  Step 4 Review ──▶ 派遣 spec-auditor
    │  選擇器 → 展開設計文件？
    │ Human approve → commit
    ▼
/vif-prototype（可選）─────────────────── AI 直接
    │ Human 確認畫面
    ▼
/vif-api-spec + /vif-ui-spec ────────── AI 直接
    │ commit
    ▼
/vif-develop ────────────────────────── 每個任務循環：
    │  ┌─ RED ────▶ 派遣 test-writer
    │  ├─ GREEN ──▶ 派遣 implementer
    │  ├─ REFACTOR ▶ 派遣 implementer
    │  └─ commit（per-task）
    ▼
/vif-verify ─────────────────────────── Core stages：
    │  Stage 1-6 ──▶ 派遣 verifier（含 Dependency Audit）
    │  Stage 7 ────▶ 派遣 security-reviewer（Read only）
    │  Optional:
    │    Stage 8 ──▶ /simplify（Claude Code）
    ▼
/vif-review ─────────────────────────── 派遣 reviewer
    │  Stage 1: Spec + Design Compliance
    │  Stage 2: Code Quality
    │  有問題 → 回 /vif-develop → 重跑（max 3）
    │ Human approve
    ▼
/vif-close ──────────────────────────── AI 直接
    │  Design Doc Sync + Checklist → commit
    ▼
  Done
```

**3 個 Approval Gate（必須 approve 才能進入下一階段）：**

| Gate | Skill | Human 行為 |
|------|-------|-----------|
| PRD → Spec | `/vif-prd` | Approve PRD |
| Spec → Develop | `/vif-spec` | Approve Spec |
| Review → Close | `/vif-review` | Approve Code |

**15 個互動點（需要 Human 回應）：**

| # | 時機 | Skill | 內容 |
|---|------|-------|------|
| 1 | 架構討論 | `/vif-arch` | 與 Human 討論技術選型、確認架構決策 |
| 2 | 設計基礎 | `/vif-uiux` | 與 Human 逐項討論色系、字型、佈局等 |
| 3 | 需求探索 | `/vif-prd` | 與 Human 對話釐清問題、影響、動機 |
| 4 | BDD Discovery | `/vif-bdd` | 與 Human 解決 Question、確認 Example |
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

> 不是每個互動點都會觸發，依專案設定和實際流程決定。

### 模式二：輔助自動化

各角色各自驅動 AI。適合企業團隊。

**角色 × Skill 對應：**

```
PO
├── PD / PM ──── /vif-prd → /vif-bdd（可選）
│
Designer ─────── /vif-uiux（設計基礎）→ Figma（手動）或 /vif-prototype（AI 產出原型）
│
Architecture ─── /vif-arch
│
SA / SD ──────── /vif-spec（PRD + Figma → 影響分析 → 規劃範圍）
│
├── Frontend ─── /vif-ui-spec（Figma + Spec → 頁面規格）
├── Backend ──── /vif-api-spec（Figma + Spec → API + openapi + dbschema）
│
PGs ──────────── /vif-develop → /vif-verify → /vif-review
│
All ──────────── /vif-close
```

**流程：**

```
Architect    Designer              PD/PM              SA/SD             Frontend     Backend
  │             │                    │                  │                  │            │
  ▼             ▼                    ▼                  ▼                  ▼            ▼
/vif-arch    /vif-uiux            /vif-prd           /vif-spec         /vif-ui-spec  /vif-api-spec
(架構決策)   (設計基礎)            /vif-bdd(可選)     (影響分析+規劃)    (頁面規格)    (API+openapi
              │                    │                  │                  │         +dbschema)
              ▼                    │                  │                  │            │
        Figma（手動）              │                  │                  │            │
        或 /vif-prototype          │                  │                  │            │
              │                    │                  │                  │            │
              └────────────────────┴────────┬─────────┘                  │            │
                                            │                            │            │
                                     Figma/Prototype 是共同輸入 ────────┘            │
                                                                                      │
                                            ┌────────────────────────────────────────┘
                                            ▼
                                     PGs: /vif-develop
                                       │  各自開發（選擇測試策略）
                                       │  per-task commit
                                       ▼
                                     PGs: /vif-verify
                                       │  自動化檢核（隨時可跑）
                                       ▼
                                     PGs: /vif-review
                                       │  對照 spec + 設計文件審查
                                       ▼
                                     /vif-close
                                       │  文件同步 + 收尾
                                       ▼
                                     Done
```

**各角色如何使用：**

| 角色 | 使用的 Skill | 輸入 | 產出 |
|------|-------------|------|------|
| **Architect** | `/vif-arch` | 架構需求 | `docs/architecture/adr-NNN.md` |
| **Designer** | `/vif-uiux` | 產品領域 | `guideline/ui/ui-guideline.md` |
| **Designer** | `/vif-prototype`（可選） | PRD + ui-guideline | `docs/prototypes/*.html` |
| **PD/PM** | `/vif-prd` | 需求想法 | `docs/prd-NNN.md` |
| **PD/PM** | `/vif-bdd`（可選） | PRD | `docs/features/**/*.feature` |
| **SA/SD** | `/vif-spec` | PRD + Figma/Prototype | `docs/specs/NNN/spec.md` |
| **Frontend** | `/vif-ui-spec` | Figma/Prototype + Spec | `docs/ui-specs/**/*.md` |
| **Backend** | `/vif-api-spec` | Figma + Spec | `docs/api-specs/**/*.md` + `openapi.yaml` + `docs/schema/*.md` |
| **PGs** | `/vif-develop` | Spec + 設計文件 | 程式碼 + 測試 |
| **PGs** | `/vif-verify` | 程式碼 | Verification Report |
| **PGs** | `/vif-review` | 程式碼 + Spec | Review Report |

### 模式三：God Mode

既有專案（架構 ✓、UI/UX ✓、Guideline ✓），PRD 確認後全自動執行。適合基底穩定、只需決定做什麼的場景。

```
/vif-prd
    │ Human approve → commit
    ▼
/vif-god ───────────────────────────── 全自動（無 Human 介入）
    │
    │  Phase 1: Spec + Design Docs
    │    影響分析 → spec.md → progress.md
    │    spec-auditor 自動審查（max 5 輪）
    │    撰寫全部設計文件 → spec-auditor Pass 1+2+3
    │    自動 commit
    │
    │  Phase 2: Develop
    │    測試策略自動決定
    │    per-task TDD: test-writer → implementer → refactor
    │    per-task 自動 commit
    │
    │  Phase 3: Verify
    │    verifier（Stage 1-7）+ security-reviewer
    │    所有 findings（🔴🟠🟡🟢）AI 直接修復
    │    自動 commit
    │
    │  Phase 4: Review
    │    reviewer（Stage 1+2）
    │    所有 findings AI 直接修復
    │    自動 commit
    │
    │  Results Report
    │    god-mode-report.md 彙整所有決策與修復紀錄
    │
    ▼
Human 檢視結果
    │  審查 AI 決策、確認修復合理、執行 Manual Testing
    │  不滿意 → 直接調整
    ▼
/vif-close ──────────────────────────── AI 直接
    │  Design Doc Sync + Checklist → commit
    ▼
  Done
```

**God Mode vs 正常流程：**

| 項目 | 正常流程 | God Mode |
|------|---------|----------|
| Approval Gate | Human approve | 品質門檻自動放行 |
| 🟡🟢 Findings | Human 決定修或跳 | AI 直接修復 |
| Manual Testing | Human 執行後再 close | 列入報告，close 前執行 |
| 互動點 | 15 個 | 0 個（PRD approve 後全自動） |

> CLAUDE.md 可設定 `flow_mode: god` 預設走 God Mode。詳見 `/vif-god`。

---

## 導入新專案

### 1. 建立目錄結構

```
project/
├── .claude/
│   └── CLAUDE.md                      ← 專案規範 + vif 設定
│
├── docs/
│   ├── architecture/                  ← ADR 架構決策記錄
│   ├── prd-NNN.md                     ← 需求規格（WHY + WHAT）
│   ├── features/                      ← BDD .feature（可選）
│   │   └── [domain]/
│   │       └── [name].feature
│   ├── specs/                         ← 技術規劃（per-feature）
│   │   ├── specs-overview.md
│   │   └── NNN-name/
│   │       ├── spec.md                ← 作戰計畫
│   │       ├── progress.md
│   │       ├── verification-report.md ← Phase 3 驗證報告
│   │       ├── review-report.md       ← Phase 4 審查報告
│   │       └── god-mode-report.md     ← God Mode Results Report（如使用）
│   ├── api-specs/                     ← API 設計（累積型）
│   │   └── [module]/
│   │       ├── openapi.yaml
│   │       └── [domain]/[name].md
│   ├── ui-specs/                      ← UI 設計（累積型）
│   │   └── [module]/[page]/[name].md
│   ├── schema/                        ← DB Schema（累積型）
│   │   └── [domain].md
│
├── guideline/                         ← 開發規範（專案特定）
│   ├── backend/                       ← 後端開發規範
│   ├── frontend/                      ← 前端開發規範
│   ├── ui/                            ← UI/UX 設計基礎（由 /vif-uiux 產出）
│   ├── database/                      ← 資料庫規範
│   └── testing/                       ← 測試規範
│
└── src/
```

> 不是每個目錄都需要。CLI 工具可能不需要 `ui-specs/`，純前端可能不需要 `schema/`。依專案性質選用。

### 2. 文件性質

| 目錄 | 性質 | 誰產出 | 更新頻率 |
|------|------|--------|---------|
| `docs/architecture/` | 累積型 | Architect / SA | 少（重大決策時） |
| `docs/prd-*.md` | per-feature | PD / PM | 寫完不改 |
| `docs/features/` | per-feature（可選） | PD / PM | 偶爾修正 |
| `docs/specs/` | per-feature | SA / SD / AI | 開發中更新 |
| `docs/api-specs/` | 累積型 | Backend / SA | 隨功能迭代 |
| `docs/ui-specs/` | 累積型 | Frontend / PD | 隨功能迭代 |
| `docs/schema/` | 累積型 | Backend / SA | 隨功能迭代 |
| `guideline/ui/` | 穩定型 | Designer（`/vif-uiux`） | 偶爾調整 |
| `guideline/backend/` | 穩定型 | 專案初期建立 | 很少 |
| `guideline/frontend/` | 穩定型 | 專案初期建立 | 很少 |
| `guideline/database/` | 穩定型 | 專案初期建立 | 很少 |
| `guideline/testing/` | 穩定型 | 專案初期建立 | 很少 |

### 3. CLAUDE.md 設定範例

```markdown
# [專案名稱]

## AI-Driven Development Flow

本專案採用 vif。

### Skills

| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | `/vif-arch` | 架構決策 + ADR |
| 設計基礎 | `/vif-uiux` | UI/UX 設計基礎 |
| 需求 | `/vif-prd` | PRD 撰寫 |
| 行為 | `/vif-bdd` | BDD Discovery（可選） |
| 規劃 | `/vif-spec` | 影響分析 + 技術規劃 |
| 原型 | `/vif-prototype` | HTML 原型（可選） |
| 設計 | `/vif-ui-spec` | UI 頁面規格 |
| 設計 | `/vif-api-spec` | API + openapi + dbschema |
| 開發 | `/vif-develop` | TDD 開發 |
| 驗證 | `/vif-verify` | 自動化驗證 |
| 審查 | `/vif-review` | 程式碼審查 |
| 收尾 | `/vif-close` | 完成檢查清單 |
| 全自動 | `/vif-god` | God Mode：PRD 確認後全自動開發 |
| 規範 | `/vif-guideline` | 專案規範解析 |

### 技術棧
- 語言：[TypeScript / Python / ...]
- 框架：[Next.js / FastAPI / ...]
- 測試：[Jest / pytest / ...]

### 專案指令
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Type Check: `npx tsc --noEmit`

### 測試策略
- Backend: Unit + Integration
- Frontend: Unit + 關鍵流程 E2E

### vif-verify 設定
# - Code Quality: true

### AI Cross-Review（可選，取消註解啟用）
# - mode: solo
# - design: codex
# - verify: codex
# - review: codex

### Guideline 映射（可選，覆蓋目錄慣例，支援檔案或資料夾）
# - api-spec → guideline/backend/
# - ui-spec → guideline/frontend/
# - testing → guideline/testing/
```

---

## 參考

### Commit Points

| 時機 | Message 範例 |
|------|-------------|
| PRD approved | `docs: add prd-001 user-login` |
| BDD 完成 | `docs: add feature iam/user-login` |
| Spec approved | `docs: add spec-001 user-login` |
| 設計文件完成 | `docs: add api-spec iam/auth/login` |
| 開發 per-task | `feat: implement login API (spec-001)` |
| Verify 完成 | `docs: verify spec-001 PASS` |
| Review APPROVED | `docs: review spec-001 APPROVED` |
| Review 修復 | `fix: address review feedback (spec-001)` |
| 收尾 | `docs: close spec-001` |

### Skip Decision

| 需求規模 | Arch | PRD | BDD | Spec | Design | Develop | Verify | Review |
|---------|:----:|:---:|:---:|:----:|:------:|:-------:|:------:|:------:|
| Bug fix | — | 跳 | 跳 | 輕量 | 跳 | 寫重現測試→修復 | Core | AI |
| Config 變更 | — | 跳 | 跳 | 跳 | 跳 | 直接改 | Core | 跳 |
| UI 微調 | — | 跳 | 跳 | 輕量 | 更新 ui-spec | 實作 | Core | AI |
| 小功能 (<1天) | — | 跳 | 可選 | 必須 | 必須 | TDD | Core+選 | 必須 |
| 中功能 (1-5天) | — | 必須 | 可選 | 必須 | 必須 | TDD | 全部 | 必須 |
| 大功能 (>5天) | 檢查 | 必須 | 建議 | 必須 | 必須 | TDD | 全部 | 必須 |

---

## 參考框架

vif 整合了以下框架的精華：

| 框架 | 採用的概念 |
|------|-----------|
| **Spec Kit**（GitHub） | 規格驅動開發、Power Inversion |
| **Superpowers**（obra） | Hard Gate、Verification Principle、Don't Trust the Report |
| **OpenSpec**（Fission AI） | Explore Stance、Curious not Prescriptive、Brownfield Delta |
| **ECC**（Affaan-M） | De-Sloppify、OWASP Top 10、Verification Loop |
| **gstack**（Garry Tan） | 認知模式轉換、Error Mapping、Nine Prime Directives |
| **ui-craft**（samzhu） | Intent First、Product Domain Exploration、Craft Quality Tests |
