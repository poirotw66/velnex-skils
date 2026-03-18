# Velnex — vif Plugin 開發規範

Velnex 是 vif plugin 的 marketplace repo。

## Plugin 結構

```
velnex/
├── .claude-plugin/
│   └── marketplace.json           ← marketplace 定義
├── plugins/vif/
│   ├── .claude-plugin/
│   │   └── plugin.json            ← plugin manifest
│   ├── skills/                    ← 14 個 skills
│   │   ├── vif-arch/              ← 架構決策 + ADR
│   │   ├── vif-uiux/             ← UI/UX 設計基礎
│   │   ├── vif-prd/               ← PRD 撰寫
│   │   ├── vif-bdd/               ← BDD Discovery（可選）
│   │   ├── vif-spec/              ← 影響分析 + 技術規劃
│   │   ├── vif-prototype/         ← HTML 原型（可選）
│   │   ├── vif-ui-spec/           ← UI 頁面規格
│   │   ├── vif-api-spec/          ← API 規格 + openapi + dbschema
│   │   ├── vif-guideline/         ← 專案規範解析
│   │   ├── vif-develop/           ← TDD 開發
│   │   ├── vif-verify/            ← 自動化驗證
│   │   ├── vif-review/            ← 程式碼審查
│   │   ├── vif-close/             ← 收尾
│   │   └── vif-flow/              ← 流程編排 + routing
│   └── agents/                    ← 6 個 agents
│       ├── test-writer.md
│       ├── implementer.md
│       ├── spec-auditor.md
│       ├── reviewer.md
│       ├── verifier.md
│       └── security-reviewer.md
├── research/                      ← 研究資料
└── README.md
```

## 版本控制規則

### Semantic Versioning

plugin 和所有 skills 使用相同版本號（`plugin.json` 的 version = 所有 SKILL.md 的 version）。

- **MAJOR（X.0.0）**：架構性變更（新增/移除 skill、重新定義流程）
- **MINOR（x.Y.0）**：功能性變更（skill 內容強化、新增 reference、agent 更新）
- **PATCH（x.y.Z）**：修正（文字修正、checklist 補充、bug fix）

### 修改 skill 時的版本更新規則

1. 修改任何 skill 的 SKILL.md 或 reference → **必須更新版本號**
2. 修改 agent prompt → **必須更新版本號**
3. 版本號更新範圍：
   - 只改了一個 skill → 更新該 skill + `plugin.json` 的 PATCH 版本
   - 改了多個 skill 或 agent → 更新所有被改的 skill + `plugin.json` 的 MINOR 版本
   - **所有 skill 的版本號必須與 `plugin.json` 同步**
4. 更新步驟：
   - 修改 skill / agent 內容
   - 更新被修改的 SKILL.md 的 `metadata.version`
   - 更新 `plugin.json` 的 `version`
   - 同步更新其他未被修改的 SKILL.md 版本號（保持全部一致）

> **CRITICAL：版本更新必須在 commit 之前完成，不是交給 commit subagent。**
> 準備 commit 時，第一步就是判斷版本號並更新所有檔案，確認後再呼叫 git-commit subagent。

### Git 規範

- Conventional Commits 格式
- 中文撰寫 commit body
- 不主動 commit，等待使用者明確指示
- 使用 git-commit subagent 執行 commit

## 兩種使用模式

### 模式一：完全自動化（Solo / 小團隊）

```
/vif-arch + /vif-uiux → /vif-prd → /vif-bdd → /vif-spec → /vif-prototype(可選) → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

### 模式二：輔助自動化（企業團隊）

各角色各自驅動 AI，使用對應的 skill。
