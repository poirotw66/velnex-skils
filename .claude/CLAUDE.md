# Velnex — Plugin Marketplace 開發規範

Velnex 是 Agentic Engineering Lifecycles 的 plugin marketplace，包含 3 個 plugin。

## Repo 結構

```
velnex/
├── .claude-plugin/
│   └── marketplace.json               ← marketplace 定義
├── .claude/
│   └── CLAUDE.md                      ← repo 開發規範（本文件）
├── docs/
│   └── vif/                           ← vif 文件
├── plugins/
│   ├── vif/                           ← Velocity AI Flow
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/                    ← 15 個 skills
│   │   │   ├── vif-prd/              ← Phase 0: PRD 撰寫
│   │   │   ├── vif-arch/             ← Phase 0: 架構決策 + ADR
│   │   │   ├── vif-uiux/            ← Phase 0: UI/UX 設計基礎
│   │   │   ├── vif-prototype/       ← Phase 0: HTML 原型（可選）
│   │   │   ├── vif-bdd/             ← Phase 0: BDD Discovery（可選）
│   │   │   ├── vif-spec/            ← Phase 1: 影響分析 + 技術規劃
│   │   │   ├── vif-api-spec/        ← Phase 1: API 規格 + openapi + dbschema
│   │   │   ├── vif-ui-spec/         ← Phase 1: UI 頁面規格
│   │   │   ├── vif-develop/         ← Phase 2: TDD 開發
│   │   │   ├── vif-verify/          ← Phase 3: 自動化驗證
│   │   │   ├── vif-review/          ← Phase 4: 程式碼審查
│   │   │   ├── vif-close/           ← Phase 5: 收尾
│   │   │   ├── vif-god/             ← 跨階段: God Mode 全自動開發
│   │   │   ├── vif-guideline/       ← 跨階段: 專案規範解析
│   │   │   └── vif-flow/            ← 跨階段: 流程編排 + routing
│   │   └── agents/                    ← 6 個 agents
│   │       ├── test-writer.md
│   │       ├── implementer.md
│   │       ├── spec-auditor.md
│   │       ├── reviewer.md
│   │       ├── verifier.md
│   │       └── security-reviewer.md
│   ├── vul/                           ← Vulnerability Unified Lifecycle
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/                    ← 5 個 skills
│   │       ├── vul-analyze/          ← 掃描報告分析
│   │       ├── vul-decision/         ← 漏洞決策
│   │       ├── vul-fix/              ← 漏洞修復
│   │       ├── vul-pr/              ← 建立 PR
│   │       └── vul-cleanup/          ← Worktree 清理
│   └── vex/                           ← Velnex Extensions
│       ├── .claude-plugin/plugin.json
│       └── agents/                    ← 共用 agents
│           └── git-commit.md
└── README.md
```

## 版本控制規則

### Semantic Versioning

plugin 和所有 skills 使用相同版本號（`plugin.json` 的 version = 所有 SKILL.md 的 version）。

- **MAJOR（X.0.0）**：架構性變更（新增/移除 skill、重新定義流程）
- **MINOR（x.Y.0）**：功能性變更（skill 內容強化、新增 reference、agent 更新）
- **PATCH（x.y.Z）**：修正（文字修正、checklist 補充、bug fix）

### 版本更新規則

**版本號在 commit 時決定，不是在修改檔案時。** 同一個版本號可以累積多次修改，直到 commit 時才確認最終版本。

**Commit 前的版本檢查流程：**

1. 檢查待 commit 的變更是否包含 skill（SKILL.md / reference）或 agent 的修改
2. **有** → 判斷升版層級：
   - 只改了一個 skill → PATCH
   - 改了多個 skill 或 agent → MINOR
   - 架構性變更 → MAJOR
3. 比對當前 `plugin.json` 版本與上一個 git tag 的版本：
   - **版本已升過**（當前版本 > 上次 tag 版本）→ 不需要再升，直接 commit
   - **版本未升**（當前版本 = 上次 tag 版本）→ 依判斷的層級升版，同步所有檔案後再 commit
4. **所有 skill 的版本號必須與 `plugin.json` 同步**
5. **不交給 commit subagent** — 版本更新在呼叫 git-commit subagent 之前完成

### 發版流程

當使用者說「發版」、「release」、「上 tag」時，依序執行：

1. **確認所有變更已 commit** — `git status` 確認 working tree clean，有未 commit 的變更則先提醒
2. **確認版本號一致** — 檢查 `plugin.json` 與所有 SKILL.md 的版本號是否同步
3. **建立 git tag** — 格式：`{plugin}/v{version}`（例如 `vif/v3.3.0`）
   - 同時更新多個 plugin → 各自建 tag
   - 不使用裸版本號（如 `v3.3.0`），必須帶 plugin 前綴
4. **不主動 push tag** — 等使用者明確指示才 `git push --tags`

### Git 規範

- Conventional Commits 格式
- 中文撰寫 commit body
- 不主動 commit，等待使用者明確指示
- 使用 git-commit subagent 執行 commit
- dispatch git-commit 時，附上當前模型名稱（供 Co-Authored-By 使用）

## 三種使用模式

### 模式一：完全自動化（Solo / 小團隊）

技術先行（先定技術邊界再寫需求）：
```
/vif-arch + /vif-uiux → /vif-prd → /vif-bdd → /vif-prototype(可選) → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

產品先行（先定需求再選技術）：
```
/vif-prd → /vif-arch + /vif-uiux → /vif-bdd → /vif-prototype(可選) → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

> vif-arch 會自動偵測是否已有 PRD，有的話會讀取作為技術選型的參考依據。

### 模式二：輔助自動化（企業團隊）

各角色各自驅動 AI，使用對應的 skill。

### 模式三：God Mode（PRD-to-Review 全自動）

既有專案（架構 ✓、UI/UX ✓、Guideline ✓），PRD approved 後一路自動執行到 Review：
```
/vif-prd → Human approve → /vif-god → Results Report → Human 檢視 → /vif-close
```
