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
│   ├── skills/                    ← 11 個 skills
│   │   ├── vif-arch/              ← 架構決策 + ADR
│   │   ├── vif-prd/               ← PRD 撰寫
│   │   ├── vif-bdd/               ← BDD Discovery（可選）
│   │   ├── vif-spec/              ← 影響分析 + 技術規劃
│   │   ├── vif-ui-spec/           ← UI 頁面規格
│   │   ├── vif-api-spec/          ← API 規格 + openapi + dbschema
│   │   ├── vif-develop/           ← TDD 開發
│   │   ├── vif-verify/            ← 自動化驗證
│   │   ├── vif-review/            ← 程式碼審查
│   │   ├── vif-close/             ← 收尾
│   │   └── vif-flow/              ← 流程編排 + routing
│   └── agents/                    ← 6 個 agents
│       ├── test-writer.md
│       ├── implementer.md
│       ├── spec-reviewer.md
│       ├── reviewer.md
│       ├── verifier.md
│       └── security-reviewer.md
├── guideline/                     ← 流程參考文件（人類閱讀）
└── docs/                          ← velnex 自身的文件
```

## 兩種使用模式

### 模式一：完全自動化（Solo / 小團隊）

```
/vif-arch → /vif-prd → /vif-bdd → /vif-spec → /vif-api-spec + /vif-ui-spec → /vif-develop → /vif-verify → /vif-review → /vif-close
```

### 模式二：輔助自動化（企業團隊）

各角色各自驅動 AI，使用對應的 skill。

## 版本控制

- Conventional Commits 格式
- 中文撰寫 commit body
- 不主動 commit，等待使用者明確指示
- 使用 git-commit subagent 執行 commit
