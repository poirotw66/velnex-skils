# vul (Vulnerability Unified Lifecycle)

Vulnerability remediation pipeline，提供 5 個 skills 覆蓋從掃描分析到 PR 建立與清理的完整流程。

## Prerequisites

- **GCS 存取權限** — 已安裝 `gsutil` CLI 並可存取存放掃描報告的 bucket
- **Git** — 使用 worktree 隔離修復工作
- **Platform CLI** — `gh`（GitHub）或 `az`（Azure DevOps），用於建立 PR
- **jq** — JSON 處理
- **pdfplumber**（選用）— PDF 報告解析（`pip3 install pdfplumber`）

## 安裝

```bash
# 加入 marketplace
/plugin marketplace add /path/to/velnex

# 安裝 plugin
/plugin install vul@velnex
```

## 專案設定

在專案的 `.claude/CLAUDE.md` 加入：

```markdown
### vul 設定
- scan-bucket: gs://your-scan-bucket-name
```

## Pipeline

```
/vul-analyze  →  /vul-decision  →  /vul-fix  →  /vul-pr  →  /vul-cleanup
  下載報告          決策修復策略        執行修復        建立 PR        清理 worktree
  產出分析          記錄理由           提交+推送       支援 GH/ADO     檢查 PR 狀態
```

## Skills

| Skill | 功能 | 狀態轉換 |
|-------|------|----------|
| `/vul-analyze` | 從 GCS 下載掃描報告，產出 3 份分析（Checkmarx、Mend 依賴、Mend Image） | → analyzed |
| `/vul-decision` | AI 協作決策：逐筆審查漏洞，決定修復或不修復 | → decision |
| `/vul-fix` | 依決策執行修復（程式碼、套件升級、Docker Image） | → fixed |
| `/vul-pr` | 建立 Pull Request（自動偵測 GitHub / Azure DevOps） | → review |
| `/vul-cleanup` | 列出 worktree、檢查 PR 狀態、選擇性清理 | → completed |

## 狀態追蹤

Pipeline 透過 `docs/security/scan-status.json` 追蹤進度：

```
analyzed → decision → in_progress → fixed → review → completed
                   ↘ no_action (全部不修復時)
```

## 工作目錄模型

每個 commit 的修復在獨立 worktree 中進行：

- Worktree 路徑：`../{PROJECT}-security-{COMMIT_7}`
- 分支名稱：`security/fix-{COMMIT_7}`
- 報告存放：`docs/security/{COMMIT_7}/`
