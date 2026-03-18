# Agent Dispatch Contract

派遣 agent 時的標準 context block。確保 handoff 不遺漏關鍵資訊。

## Context Block

```
## Dispatch Context

### Task（must）
- task_id: spec-001-task-3
- description: 實作登入 API endpoint
- spec_ref: docs/api-specs/auth/login.md
- feature_ref: docs/features/auth/login.feature#happy-path（may）

### Workspace（must if multi-repo，monorepo 省略）
- docs_repo: /absolute/path/to/project-docs
- code_repo: /absolute/path/to/project-frontend

### Guideline（should，如有相關 guideline）
--- guideline/backend/api-design.md ---
[內容]

### Additional Context（may）
[任何額外補充，例如 implementer 的 NEEDS_CONTEXT 回饋]
```

## 欄位說明

| 層級 | 欄位 | 說明 |
|------|------|------|
| **must** | task_id | 任務識別碼（spec-NNN-task-N） |
| **must** | description | 任務描述 |
| **must** | spec_ref | 對應的設計文件路徑 |
| may | feature_ref | 對應的 .feature scenario（如有） |
| must (multi-repo) | docs_repo | docs repo 絕對路徑 |
| must (multi-repo) | code_repo | code repo 絕對路徑 |
| should | guideline | 相關的 guideline 內容（由 /vif-guideline 解析） |
| may | additional context | 額外補充（例如前次 NEEDS_CONTEXT 的回饋） |

## 各 Agent 的 Dispatch 來源

| Agent | 派遣者 | 必要欄位 |
|-------|--------|---------|
| test-writer | vif-develop | task_id, spec_ref, guideline(testing) |
| implementer | vif-develop | task_id, test file path, guideline(coding) |
| spec-auditor | vif-spec | spec.md path, design doc paths |
| reviewer | vif-review | spec.md path, design doc paths, guideline |
| verifier | vif-verify | code repo path, progress.md path |
| security-reviewer | vif-verify | changed files list |
