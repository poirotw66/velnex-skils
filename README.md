# vif — AI-Driven Development Flow

Claude Code plugin，提供 14 個 skills + 6 個 agents 的結構化開發流程。

支援兩種模式：
- **完全自動化** — 一人驅動 AI 完成整個開發流程（Solo / 小團隊）
- **輔助自動化** — 各角色各自驅動 AI 處理自己負責的工作（企業團隊）

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

## Skills

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
| 規範 | `/vif-guideline` | 專案規範解析（被其他 skill 引用） |
| 總覽 | `/vif-flow` | 流程編排 + routing |

## Agents

Skills 在特定階段會派遣 agents（subagents）執行工作：

| Agent | 用途 | 工具限制 | 派遣者 |
|-------|------|---------|--------|
| `test-writer` | TDD RED：寫失敗測試 | 無限制 | `/vif-develop` |
| `implementer` | TDD GREEN + REFACTOR：最小實作 | 無限制 | `/vif-develop` |
| `spec-auditor` | 審查 spec + 設計文件 | 無限制 | `/vif-spec` |
| `reviewer` | 程式碼審查（合規 + 品質） | 無限制 | `/vif-review` |
| `verifier` | 驗證 pipeline（Build → Test → Diff） | Bash + Read | `/vif-verify` |
| `security-reviewer` | OWASP Top 10 安全性檢查 | Read only | `/vif-verify` |

> `/vif-verify` 的 Code Quality 檢查使用 Claude Code 內建的 `/simplify` skill（非 Claude Code 環境不適用）。

**為什麼需要分 agent？**

- **test-writer / implementer** — TDD 紀律：強制 RED 和 GREEN 分離，防止「一邊想實作一邊寫測試」
- **verifier / security-reviewer** — 工具限制：只檢測不修復，防止驗證過程意外修改程式碼
- **spec-auditor / reviewer** — Context 隔離：獨立審查視角，不受開發者偏見影響

---

## 模式一：完全自動化

AI 為主力開發，Human 為審查角色。適合 solo 或小團隊。

### 流程

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
    │  └─ commit（per-scenario）
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

### Human 介入點

**3 個 Approval Gate（必須 approve 才能進入下一階段）：**

| Gate | Skill | Human 行為 |
|------|-------|-----------|
| PRD → Spec | `/vif-prd` | Approve PRD |
| Spec → Develop | `/vif-spec` | Approve Spec |
| Review → Close | `/vif-review` | Approve Code |

**12 個互動點（需要 Human 回應）：**

| # | 時機 | Skill | 內容 |
|---|------|-------|------|
| 1 | 架構討論 | `/vif-arch` | 與 Human 討論技術選型 |
| 2 | 設計基礎 | `/vif-uiux` | 與 Human 逐項討論色系、字型等 |
| 3 | BDD Discovery | `/vif-bdd` | 與 Human 解決 Question、確認 Example |
| 4 | Spec 展開選擇 | `/vif-spec` Step 3 | 選擇展開哪些設計文件 |
| 5 | 原型範圍 | `/vif-prototype` Step 1 | 確認要做原型的頁面 |
| 6 | 原型確認 | `/vif-prototype` Step 3 | 看畫面、給回饋 |
| 7 | API Spec 確認 | `/vif-api-spec` Step 5 | 確認 API 規格 |
| 8 | UI Spec 確認 | `/vif-ui-spec` Step 3 | 確認頁面規格 |
| 9 | 測試策略 | `/vif-develop` | 確認測試策略 |
| 10 | WARN 評估 | `/vif-verify` | 評估 WARN 要修還是記錄理由 |
| 11 | TDD 例外 | `/vif-develop` | 確認是否可不走 TDD |
| 12 | Escalation | `/vif-develop` | 3 次失敗後 Human 決定 |

---

## 模式二：輔助自動化

各角色各自驅動 AI。適合企業團隊。

### 角色 × Skill 對應

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
├── Backend ──── /vif-api-spec（PRD + Figma + Spec → API + openapi + dbschema）
│
PGs ──────────── /vif-develop → /vif-verify → /vif-review
│
All ──────────── /vif-close
```

### 流程

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
                                       │  per-scenario commit
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

### 各角色如何使用

| 角色 | 使用的 Skill | 輸入 | 產出 |
|------|-------------|------|------|
| **Architect** | `/vif-arch` | 架構需求 | `docs/architecture/adr-NNN.md` |
| **Designer** | `/vif-uiux` | 產品領域 | `guideline/ui/ui-guideline.md` |
| **Designer** | `/vif-prototype`（可選） | PRD + ui-guideline | `docs/prototypes/*.html` |
| **PD/PM** | `/vif-prd` | 需求想法 | `docs/prd-NNN.md` |
| **PD/PM** | `/vif-bdd`（可選） | PRD | `docs/features/**/*.feature` |
| **SA/SD** | `/vif-spec` | PRD + Figma/Prototype | `docs/specs/NNN/spec.md` |
| **Frontend** | `/vif-ui-spec` | Figma/Prototype + Spec | `docs/ui-specs/**/*.md` |
| **Backend** | `/vif-api-spec` | PRD + Figma + Spec | `docs/api-specs/**/*.md` + `openapi.yaml` + `docs/schema/*.md` |
| **PGs** | `/vif-develop` | Spec + 設計文件 | 程式碼 + 測試 |
| **PGs** | `/vif-verify` | 程式碼 | Verification Report |
| **PGs** | `/vif-review` | 程式碼 + Spec | Review Report |

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
│   │       └── progress.md
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

### Guideline 映射（可選，覆蓋目錄慣例，支援檔案或資料夾）
# - api-spec → guideline/backend/
# - ui-spec → guideline/frontend/
# - testing → guideline/testing/
```

---

## Commit Points

| 時機 | Message 範例 |
|------|-------------|
| PRD approved | `docs: add prd-001 user-login` |
| BDD 完成 | `docs: add feature iam/user-login` |
| Spec approved | `docs: add spec-001 user-login` |
| 設計文件完成 | `docs: add api-spec iam/auth/login` |
| 開發 per-scenario | `feat: implement login API (spec-001)` |
| Review 修復 | `fix: address review feedback (spec-001)` |
| 收尾 | `docs: close spec-001` |

## Skip Decision

| 需求規模 | Arch | PRD | BDD | Spec | Design | Develop | Verify | Review |
|---------|:----:|:---:|:---:|:----:|:------:|:-------:|:------:|:------:|
| Bug fix | — | 跳 | 跳 | 輕量 | 跳 | 寫重現測試→修復 | Core | AI |
| Config 變更 | — | 跳 | 跳 | 跳 | 跳 | 直接改 | Core | 跳 |
| UI 微調 | — | 跳 | 跳 | 輕量 | 更新 ui-spec | 實作 | Core | AI |
| 小功能 (<1天) | — | 跳 | 可選 | 必須 | 必須 | TDD | Core+選 | 必須 |
| 中功能 (1-5天) | — | 必須 | 可選 | 必須 | 必須 | TDD | 全部 | 必須 |
| 大功能 (>5天) | 檢查 | 必須 | 建議 | 必須 | 必須 | TDD | 全部 | 必須 |

---

## 核心原則

1. **行為先於設計** — 先理解「系統該做什麼」再設計「怎麼做到」
2. **影響分析是核心** — 判斷新增 vs 修改既有，修改比新增更危險
3. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **驗證即誠實** — 每一個聲明都要有新鮮的證據支撐
6. **最多重試 3 次** — 超過就 escalate 給 Human

## Repo 結構

```
velnex/
├── README.md                          ← 本文件
├── research/                          ← 研究資料
│   ├── 00-background.md               ← 研究背景 + 索引
│   ├── 01-skills-ecosystem.md         ← Skills 生態系調查
│   ├── 02-trends.md                   ← BDD/TDD/SDD/EDD 趨勢
│   ├── 03-framework-analysis.md       ← 五大框架分析
│   ├── 04-methodology-relationships.md ← 方法論關聯性
│   ├── 05-project-baseline.md         ← 專案盤點
│   └── 06-design-decisions.md         ← 設計決策
├── .claude-plugin/
│   └── marketplace.json               ← marketplace 定義
├── .claude/
│   └── CLAUDE.md                      ← repo 開發規範
└── plugins/vif/
    ├── .claude-plugin/
    │   └── plugin.json                ← plugin manifest
    ├── skills/                        ← 14 個 skills
    │   ├── vif-arch/                  ← 架構決策 + ADR
    │   ├── vif-uiux/                  ← UI/UX 設計基礎
    │   ├── vif-prd/                   ← PRD 撰寫
    │   ├── vif-bdd/                   ← BDD Discovery
    │   ├── vif-spec/                  ← 影響分析 + 技術規劃
    │   ├── vif-prototype/             ← HTML 原型
    │   ├── vif-ui-spec/               ← UI 頁面規格
    │   ├── vif-api-spec/              ← API + openapi + dbschema
    │   ├── vif-guideline/             ← 專案規範解析
    │   ├── vif-develop/               ← TDD 開發
    │   ├── vif-verify/                ← 自動化驗證
    │   ├── vif-review/                ← 程式碼審查
    │   ├── vif-close/                 ← 收尾
    │   └── vif-flow/                  ← 流程編排
    └── agents/                        ← 6 個 agents
        ├── test-writer.md             ← TDD RED
        ├── implementer.md             ← TDD GREEN + REFACTOR
        ├── spec-auditor.md           ← Spec 審查
        ├── reviewer.md                ← Code Review
        ├── verifier.md                ← 驗證 pipeline
        └── security-reviewer.md       ← 安全性檢查

```

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

詳細研究分析見 [research/00-background.md](research/00-background.md)。
