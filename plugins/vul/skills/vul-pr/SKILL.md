---
name: vul-pr
description: >-
  為漏洞修復建立 Pull Request，支援 Azure DevOps 和 GitHub 平台。用於漏洞修復完成後建立 PR 提交審核。當使用者要求建立 PR、或執行 /vul-pr 時使用此 skill。
metadata:
  version: 1.2.0
---

# Vul PR

建立 Pull Request，支援 Azure DevOps 和 GitHub 平台。

## Prerequisites

- 已執行 `/vul-fix` 完成修復
- 修復分支已 push 到 remote
- 目前在 worktree 目錄中
- 已安裝對應 CLI 工具（`az` 或 `gh`）

## Configuration

> 讀取專案 `.claude/CLAUDE.md` 中 `vul 設定` 的 `scan-branch` 值作為 `SCAN_BRANCH` 變數（預設：`develop`）。PR 的 target branch 使用此值。

## Workflow

### 1. 確認環境

```bash
# 確認當前位置和分支
pwd  # 應該在 worktree 目錄
git branch --show-current  # 應該是 security/fix-{COMMIT_7}

# 取得 commit hash（7 碼）
COMMIT_7=$(git branch --show-current | sed 's/security\/fix-//')
```

如果不在 worktree 中，提示使用者：
```
⚠️  請先執行 /vul-analyze 建立 worktree
並執行 /vul-fix 完成修復
```

### 1.1 檢查修復狀態

```bash
# 檢查當前狀態是否為 fixed
if [ -f "docs/security/scan-status.json" ]; then
    current_status=$(jq -r --arg commit "${COMMIT_7}" '.[$commit].status' docs/security/scan-status.json)

    if [ "$current_status" != "fixed" ]; then
        echo "⚠️  當前狀態為 $current_status，預期應為 fixed"
        echo "建議先執行 /vul-fix 完成修復並更新狀態"
        echo ""
        echo "是否仍要繼續建立 PR？"
        # 由使用者決定是否繼續
    else
        echo "✅ 修復狀態確認：fixed"
    fi
fi
```

> [!NOTE]
> 前置狀態應該是 `fixed`（修復已完成並 push）。如果狀態不符，建議先完成修復流程。

### 2. 偵測平台

```bash
git remote get-url origin
```

| URL 模式 | 平台 |
|---------|------|
| `dev.azure.com`, `*.visualstudio.com`, `ssh.dev.azure.com` | Azure DevOps |
| `github.com` | GitHub |

### 3. 檢查 CLI 工具

**Azure DevOps**
```bash
az --version
az extension show --name azure-devops
```

**GitHub**
```bash
gh --version
gh auth status
```

### 4. 確認分支狀態

確認在正確的分支且已 push：
```bash
git branch --show-current
git log origin/security/fix-{COMMIT_7}..HEAD
```

如果有未 push 的 commit，提示使用者先 push：
```bash
git push -u origin security/fix-{COMMIT_7}
```

### 5. 讀取決策報告和修復摘要

讀取相關報告以建立完整的 PR 描述：

```bash
# 決策報告
DECISION_REPORT="docs/security/${COMMIT_7}/decision-${COMMIT_7}.md"

# 修復摘要報告
FIX_SUMMARY="docs/security/${COMMIT_7}/fix-summary-${COMMIT_7}.md"

# 檢查檔案是否存在
if [ -f "$DECISION_REPORT" ]; then
    echo "✅ 找到決策報告"
else
    echo "⚠️  未找到決策報告"
fi

if [ -f "$FIX_SUMMARY" ]; then
    echo "✅ 找到修復摘要"
else
    echo "⚠️  未找到修復摘要"
fi
```

從報告中提取關鍵資訊：
- 決策統計（修復項目數、跳過項目數）
- 修復結果（成功、失敗、跳過）
- 測試狀態

### 6. 更新狀態為 review

在建立 PR 之前，先更新狀態：

```bash
# 更新狀態為 review
jq --arg commit "${COMMIT_7}" \
   --arg review_started_at "$(date -Iseconds)" \
   '.[$commit].status = "review" |
    .[$commit].review_started_at = $review_started_at' \
   docs/security/scan-status.json > /tmp/scan-status.tmp && \
mv /tmp/scan-status.tmp docs/security/scan-status.json

# 提交狀態更新
git add docs/security/scan-status.json
```

使用 **git-commit agent** 提交變更，提供以下 dispatch context：
- 目的：標記安全掃描狀態為 review
- 範圍：commit ${COMMIT_7} 準備建立 PR
- 主要變更：scan-status.json 狀態更新

**Fallback**（如果 git-commit agent 不可用）：

```bash
git commit -m "$(cat <<EOF
docs: mark security scan ${COMMIT_7} as review

準備建立 Pull Request
EOF
)"
```

提交後推送到 remote：

```bash
git push

echo "✅ 狀態已更新為 review 並提交"
```

### 7. 建立 PR

**Azure DevOps**
```bash
az repos pr create \
  --title "fix: 修復 commit {COMMIT_7} 的安全漏洞" \
  --description "$(cat <<'EOF'
{PR_DESCRIPTION}
EOF
)" \
  --source-branch "security/fix-{COMMIT_7}" \
  --target-branch "${SCAN_BRANCH}"
```

**GitHub**
```bash
gh pr create \
  --title "fix: 修復 commit {COMMIT_7} 的安全漏洞" \
  --body "$(cat <<'EOF'
{PR_DESCRIPTION}
EOF
)" \
  --base "${SCAN_BRANCH}" \
  --head "security/fix-{COMMIT_7}"
```

### 8. PR 描述模板

PR 描述應包含決策報告和修復摘要的關鍵資訊：

```markdown
## 概述
修復 commit `{commit}` 的弱掃漏洞。

## 📊 漏洞決策摘要

**總漏洞數**: {total_vulnerabilities}
- ✅ 決定修復: {to_fix_count}
- ⏸️ 暫不修復: {no_action_count}

詳見決策報告: `docs/security/{commit}/decision-{commit}.md`

## 📋 修復結果

| 結果 | 數量 | 說明 |
|------|------|------|
| ✅ 成功 | {success_count} | 已完成修復並通過測試 |
| ❌ 失敗 | {failed_count} | 修復失敗，需另行處理 |
| ⏭️ 跳過 | {skipped_count} | 依決策報告暫不修復 |

詳見修復摘要: `docs/security/{commit}/fix-summary-{commit}.md`

## 🔧 修復明細

### Checkmarx 漏洞修復 ({cxo_fixed_count} 項)
{checkmarx_fixes}

### 套件升級 (Mend 依賴) ({mend_fixed_count} 項)
{mend_fixes}

### Docker Image 修復 ({img_fixed_count} 項)
{docker_fixes}

## 🧪 測試

- [x] 單元測試通過
- [x] 整合測試通過
- [x] 本地建置成功

{test_notes}

## 📌 審核要點

{#has_failures}
- ⚠️  存在 {failed_count} 項修復失敗，詳見修復摘要報告
- 建議審核是否需要另開 issue 追蹤失敗項目
{/has_failures}

{#has_skipped}
- ℹ️  {skipped_count} 項漏洞依決策暫不修復，詳見決策報告
{/has_skipped}

## 📄 相關文件

- 決策報告: `docs/security/{commit}/decision-{commit}.md`
- 修復摘要: `docs/security/{commit}/fix-summary-{commit}.md`
- 分析報告:
  - Checkmarx: `docs/security/{commit}/analyses/vul-cxo-{commit}.md`
  - Mend 依賴: `docs/security/{commit}/analyses/vul-mend-{commit}.md`
  - Mend Image: `docs/security/{commit}/analyses/vul-mend-img-{commit}.md`

---

Generated with Claude Code
```

### 9. 更新 PR 資訊到狀態追蹤

PR 建立後，將 PR 資訊記錄到狀態追蹤：

```bash
# 取得 PR URL 和編號
PR_URL=$(gh pr view --json url -q .url)  # GitHub
PR_NUMBER=$(gh pr view --json number -q .number)

echo "✅ PR 已建立"
echo "🔗 PR URL: ${PR_URL}"
echo "📝 PR #${PR_NUMBER}"
echo "🌿 Source: security/fix-${COMMIT_7}"
echo "🎯 Target: ${SCAN_BRANCH}"

# 更新 PR 資訊到狀態追蹤
jq --arg commit "${COMMIT_7}" \
   --arg pr_created_at "$(date -Iseconds)" \
   --arg pr_url "${PR_URL}" \
   '.[$commit].pr_created_at = $pr_created_at |
    .[$commit].fix_pr = $pr_url' \
   docs/security/scan-status.json > /tmp/scan-status.tmp && \
mv /tmp/scan-status.tmp docs/security/scan-status.json

# 提交 PR 資訊更新
git add docs/security/scan-status.json
```

使用 **git-commit agent** 提交變更，提供以下 dispatch context：
- 目的：記錄 PR 資訊到狀態追蹤
- 範圍：commit ${COMMIT_7} 的 PR 已建立
- 主要變更：scan-status.json 新增 PR URL

**Fallback**（如果 git-commit agent 不可用）：

```bash
git commit -m "$(cat <<EOF
docs: update PR info for security scan ${COMMIT_7}

PR 已建立：${PR_URL}
EOF
)"
```

提交後推送到 remote：

```bash
git push

echo "✅ PR 資訊已記錄並提交"
```

更新後的 JSON 結構：

```json
{
  "{COMMIT_7}": {
    "status": "review",
    "analyzed_at": "2024-01-19T10:30:00Z",
    "fix_started_at": "2024-01-19T11:00:00Z",
    "fixed_at": "2024-01-19T15:00:00Z",
    "review_started_at": "2024-01-19T16:00:00Z",
    "pr_created_at": "2024-01-19T16:05:00Z",
    "completed_at": null,
    "reports": [...],
    "fix_branch": "security/fix-{COMMIT_7}",
    "fix_pr": "{PR_URL}"
  }
}
```

### 10. 詢問是否清理 Worktree

**使用 AskUserQuestion 工具**詢問使用者：

| 選項 | 說明 | 建議時機 |
|------|------|---------|
| 選項 1 | **保留 worktree（推薦）** | PR 審核期間可能需要修改，建議保留到 merge 後再用 `/vul-cleanup` 清理 |
| 選項 2 | 立即清理 worktree 和本地分支 | 確定不需要再修改，且 PR 可直接 merge |

#### 選項 1：保留 worktree

```
✅ Worktree 保留

📌 清理指令（PR merge 後執行）：
   cd {main_project_path}
   git worktree remove {worktree_path}
   git branch -d security/fix-{COMMIT_7}

或執行 /vul-cleanup 進行管理
```

#### 選項 2：立即清理

```bash
# 取得主目錄路徑和 worktree 路徑
MAIN_DIR=$(git rev-parse --show-toplevel)/../$(basename $(git rev-parse --show-toplevel | sed 's/-security-.*//'))
WORKTREE_DIR=$(pwd)

# 回到主目錄
cd "${MAIN_DIR}"

# 刪除 worktree
git worktree remove "${WORKTREE_DIR}"

# 刪除本地分支（remote 分支保留給 PR）
git branch -d security/fix-{COMMIT_7}

echo "✅ Worktree 已清理"
echo "⚠️  Remote 分支保留供 PR 使用"
echo "⚠️  PR merge 後 GitHub 會自動刪除 remote 分支"
```
