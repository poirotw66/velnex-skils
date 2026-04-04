---
name: vul-cleanup
description: >-
  管理和清理漏洞修復的 Git worktree，列出所有 worktree、檢查 PR 狀態、並選擇性刪除。當使用者要求清理 worktree、或執行 /vul-cleanup 時使用此 skill。
metadata:
  version: 1.2.0
---

# Vul Cleanup

管理和清理 Git worktree。

## Prerequisites

- 在主專案目錄中執行
- 已安裝 `gh` CLI（用於檢查 PR 狀態）

## Configuration

> 讀取專案 `.claude/CLAUDE.md` 中 `vul 設定` 的 `scan-branch` 值作為 `SCAN_BRANCH` 變數（預設：`develop`）。狀態更新會提交到此分支。

## Workflow

### 1. 確認在主專案目錄

#### 1.1 確認並切換到主目錄

```bash
# 確認不在 worktree 中
git_common_dir=$(git rev-parse --git-common-dir)

if echo "$git_common_dir" | grep -q "worktrees"; then
    echo "⚠️  目前在 worktree 目錄中"
    # 取得主目錄路徑
    MAIN_DIR=$(echo "$git_common_dir" | sed 's/\/\.git\/worktrees\/.*$//')
    echo "📂 切換到主目錄: $MAIN_DIR"
    cd "$MAIN_DIR"
else
    echo "✅ 已在主專案目錄"
fi

# 確認當前目錄
echo "📍 目前位置: $(pwd)"
```

#### 1.2 檢查並切換到主分支

```bash
# 取得當前分支
current_branch=$(git branch --show-current)
echo "🌿 當前分支: $current_branch"

# 檢查是否在主分支（SCAN_BRANCH）
if [ "$current_branch" != "${SCAN_BRANCH}" ]; then
    echo ""
    echo "⚠️  目前不在 ${SCAN_BRANCH} 分支"
    echo "   狀態更新需要在 ${SCAN_BRANCH} 分支上進行"
    echo ""
fi
```

**使用 AskUserQuestion 工具**詢問使用者：

| 選項 | 說明 |
|------|------|
| 選項 1 | 切換到 ${SCAN_BRANCH} 分支並繼續（推薦） |
| 選項 2 | 留在當前分支並繼續（狀態更新會提交到當前分支） |
| 選項 3 | 取消執行 |

如果選擇切換：
```bash
# 檢查當前分支是否有未提交的變更
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  當前分支有未提交的變更"
    # 使用 AskUserQuestion 詢問：
    # 選項 1: 暫存變更 (git stash)
    # 選項 2: 取消執行
fi

# 切換到主分支
git checkout ${SCAN_BRANCH}

echo "✅ 已切換到 ${SCAN_BRANCH} 分支"
```

#### 1.3 同步最新狀態

```bash
# 拉取最新變更
echo "🔄 更新 ${SCAN_BRANCH} 分支..."
git pull origin ${SCAN_BRANCH}

if [ $? -ne 0 ]; then
    echo "❌ 拉取失敗，請手動處理衝突或檢查網路連線"
    exit 1
fi

echo "✅ 分支已同步到最新狀態"
```

> [!IMPORTANT]
> **為什麼要在主分支執行？**
>
> vul-cleanup 會更新 scan-status.json 的狀態為 `completed`，這個變更應該提交到 `SCAN_BRANCH` 分支，因為：
> 1. PR 已 merge，修復分支的變更已合併到 `SCAN_BRANCH`
> 2. `SCAN_BRANCH` 上的 scan-status.json 狀態目前是 `review`（來自 PR merge）
> 3. 狀態更新為 `completed` 需要提交到 `SCAN_BRANCH`，讓其他人能看到最新狀態

### 2. 列出所有 Worktree

```bash
# 列出所有 worktree
git worktree list --porcelain
```

解析輸出並顯示：

| Worktree 路徑 | 分支 | Commit | 狀態 |
|--------------|------|--------|------|
| ../my-project-security-4602399 | security/fix-4602399 | abc1234 | 待檢查 |
| ../my-project-security-d1f8977 | security/fix-d1f8977 | def5678 | 待檢查 |

### 3. 檢查每個 Worktree 的狀態

對每個 worktree（排除主目錄）執行檢查：

```bash
for worktree_path in $(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2 | tail -n +2); do
    worktree_name=$(basename "$worktree_path")

    # 1. 檢查目錄是否存在
    if [ ! -d "$worktree_path" ]; then
        status="⚠️  目錄不存在（已被手動刪除）"
        pr_status="N/A"
    else
        # 2. 取得分支名稱
        branch=$(cd "$worktree_path" && git branch --show-current 2>/dev/null || echo "unknown")

        # 3. 從分支名稱提取 commit hash
        commit_hash=$(echo "$branch" | sed 's/security\/fix-//')

        # 4. 檢查 scan-status.json 狀態
        if [ -f "docs/security/scan-status.json" ] && [ "$commit_hash" != "$branch" ]; then
            scan_status=$(jq -r --arg commit "$commit_hash" '.[$commit].status // "unknown"' docs/security/scan-status.json 2>/dev/null)

            if [ "$scan_status" = "no_action" ]; then
                # 決策後全部不修復，可以清理
                status="✅ 決定不修復，可安全清理"
                pr_status="no_action"
            else
                # 5. 檢查 PR 狀態
                if command -v gh &> /dev/null && [ "$branch" != "unknown" ]; then
                    pr_info=$(gh pr list --head "$branch" --json state,number,url 2>/dev/null)

                    if [ -n "$pr_info" ] && [ "$pr_info" != "[]" ]; then
                        pr_state=$(echo "$pr_info" | jq -r '.[0].state')
                        pr_number=$(echo "$pr_info" | jq -r '.[0].number')
                        pr_url=$(echo "$pr_info" | jq -r '.[0].url')

                        case "$pr_state" in
                            "MERGED")
                                status="✅ PR #${pr_number} 已 merged，可安全清理"
                                pr_status="merged"

                                # 更新 scan-status.json 狀態為 completed
                                if [ -f "docs/security/scan-status.json" ]; then
                                    jq --arg commit "$commit_hash" \
                                       --arg completed_at "$(date -Iseconds)" \
                                       '.[$commit].status = "completed" |
                                        .[$commit].completed_at = $completed_at' \
                                       docs/security/scan-status.json > /tmp/scan-status.tmp && \
                                    mv /tmp/scan-status.tmp docs/security/scan-status.json

                                    echo "✅ 已更新 $commit_hash 狀態為 completed"
                                fi
                                ;;
                            "OPEN")
                                status="🔄 PR #${pr_number} 進行中"
                                pr_status="open"
                                ;;
                            "CLOSED")
                                status="❌ PR #${pr_number} 已關閉（未 merge）"
                                pr_status="closed"
                                ;;
                        esac
                    else
                        status="📝 尚未建立 PR"
                        pr_status="no_pr"
                    fi
                else
                    status="📝 無法檢查 PR 狀態"
                    pr_status="unknown"
                fi
            fi
        else
            # 沒有 scan-status.json 或無法提取 commit hash，檢查 PR 狀態
            if command -v gh &> /dev/null && [ "$branch" != "unknown" ]; then
                pr_info=$(gh pr list --head "$branch" --json state,number,url 2>/dev/null)

                if [ -n "$pr_info" ] && [ "$pr_info" != "[]" ]; then
                    pr_state=$(echo "$pr_info" | jq -r '.[0].state')
                    pr_number=$(echo "$pr_info" | jq -r '.[0].number')
                    pr_url=$(echo "$pr_info" | jq -r '.[0].url')

                    case "$pr_state" in
                        "MERGED")
                            status="✅ PR #${pr_number} 已 merged，可安全清理"
                            pr_status="merged"
                            ;;
                        "OPEN")
                            status="🔄 PR #${pr_number} 進行中"
                            pr_status="open"
                            ;;
                        "CLOSED")
                            status="❌ PR #${pr_number} 已關閉（未 merge）"
                            pr_status="closed"
                            ;;
                    esac
                else
                    status="📝 尚未建立 PR"
                    pr_status="no_pr"
                fi
            else
                status="📝 無法檢查 PR 狀態"
                pr_status="unknown"
            fi
        fi
    fi

    echo "Worktree: $worktree_name"
    echo "分支: $branch"
    echo "狀態: $status"
    echo "---"
done
```

顯示摘要：

```
🌳 Worktree 管理

找到 3 個 worktree（排除主目錄）：

1. my-project-security-4602399
   🌿 分支: security/fix-4602399
   📊 狀態: ✅ PR #123 已 merged，可安全清理

2. my-project-security-d1f8977
   🌿 分支: security/fix-d1f8977
   📊 狀態: 🔄 PR #124 進行中

3. my-project-security-abc1234
   🌿 分支: security/fix-abc1234
   📊 狀態: ✅ 決定不修復，可安全清理
```

### 4. 讓使用者選擇要清理的 Worktree

**使用 AskUserQuestion 工具**（multiSelect: true）讓使用者多選：

每個選項應包含：
- Worktree 名稱
- 狀態標識（merged/進行中/已刪除等）
- 建議動作

範例選項：
```
選項 1: my-project-security-4602399 (✅ PR 已 merged - 建議清理)
選項 2: my-project-security-d1f8977 (🔄 PR 進行中 - 保留)
選項 3: my-project-security-abc1234 (⚠️  目錄已刪除 - 清理記錄)
```

> [!CAUTION]
> **清理警告**：
> - PR 已 merged 的 worktree：安全清理
> - PR 進行中的 worktree：清理後如需修改需重新 checkout
> - 目錄已刪除的 worktree：只清理 git 記錄

### 5. 確認清理

如果使用者選擇了要清理的 worktree，顯示確認訊息：

```
即將清理以下 worktree：
- my-project-security-4602399 (security/fix-4602399)
- my-project-security-abc1234 (security/fix-abc1234)
```

**使用 AskUserQuestion 再次確認**：
- 選項 1：確認清理
- 選項 2：取消

### 6. 執行清理

對每個選中的 worktree 執行清理：

```bash
for worktree_path in $SELECTED_WORKTREES; do
    worktree_name=$(basename "$worktree_path")

    echo "🗑️  處理: $worktree_name"

    # 檢查目錄是否存在
    if [ ! -d "$worktree_path" ]; then
        # 目錄已被手動刪除，強制刪除 git 記錄
        echo "   ⚠️  目錄不存在，清理 git 記錄..."
        git worktree remove "$worktree_path" --force
        echo "   ✅ Git 記錄已清理"
    else
        # 正常刪除 worktree
        echo "   🗑️  刪除 worktree..."

        # 檢查是否有未 commit 的變更
        if ! git -C "$worktree_path" diff-index --quiet HEAD --; then
            echo "   ⚠️  Worktree 有未 commit 的變更"
            # 使用 AskUserQuestion 詢問：
            # 選項 1: 強制刪除（丟棄變更）
            # 選項 2: 跳過此 worktree

            # 如果選擇強制刪除
            git worktree remove "$worktree_path" --force
        else
            git worktree remove "$worktree_path"
        fi

        echo "   ✅ Worktree 已刪除"
    fi

    # 詢問是否刪除對應的本地分支
    branch=$(git worktree list --porcelain | grep -A3 "worktree $worktree_path" | grep "^branch" | cut -d'/' -f3- || echo "")

    if [ -n "$branch" ]; then
        echo "   🌿 分支: $branch"

        # 檢查分支是否還有其他 worktree 使用
        branch_usage=$(git worktree list --porcelain | grep -c "branch refs/heads/$branch" || true)

        if [ "$branch_usage" -eq 0 ]; then
            # 使用 AskUserQuestion 詢問是否刪除分支：
            # 選項 1: 刪除本地分支
            # 選項 2: 保留本地分支

            # 如果選擇刪除
            if git branch -d "$branch" 2>/dev/null; then
                echo "   ✅ 本地分支已刪除"
            else
                echo "   ⚠️  分支包含未 merge 的變更，使用 -D 強制刪除？"
                # 再次詢問是否強制刪除
                # git branch -D "$branch"
            fi
        else
            echo "   ℹ️  分支被其他 worktree 使用，保留"
        fi
    fi

    echo ""
done
```

### 7. 清理殘留記錄

執行 prune 清理所有無效的 worktree 記錄：

```bash
echo "🧹 清理殘留記錄..."
git worktree prune -v

echo "✅ 所有殘留記錄已清理"
```

### 7.5 提交狀態變更

如果有更新 scan-status.json 的狀態（PR merged → completed），提交變更：

```bash
# 檢查 scan-status.json 是否有變更
if ! git diff --quiet docs/security/scan-status.json 2>/dev/null; then
    echo "📝 提交狀態更新..."

    git add docs/security/scan-status.json

    # 使用 git-commit agent 提交，dispatch context：
    # - 目的：安全掃描狀態清理
    # - 範圍：已 merge 的 PR 狀態更新為 completed
    # - 主要變更：scan-status.json 狀態更新
    #
    # Fallback（如果 git-commit agent 不可用）：
    git commit -m "$(cat <<EOF
docs: update security scan status after cleanup

已 merge 的 PR 狀態已更新為 completed
EOF
)"

    git push

    echo "✅ 狀態變更已提交並 push"
else
    echo "ℹ️  無狀態變更需要提交"
fi
```

### 8. 顯示清理結果

```
✅ Worktree 清理完成

清理統計:
- 已刪除 worktree: 2 個
- 已清理 git 記錄: 1 個
- 已刪除本地分支: 1 個

剩餘 worktree: 1 個
- my-project-security-d1f8977 (PR #124 進行中)
```

### 9. 檢查 Remote 分支清理

檢查 GitHub 上是否有已 merge 的 PR 對應的 remote 分支未被刪除：

```bash
# 列出所有 security/fix-* 的 remote 分支
remote_branches=$(git branch -r | grep "origin/security/fix-" | sed 's/origin\///' | xargs)

for branch in $remote_branches; do
    # 檢查對應的 PR 狀態
    pr_state=$(gh pr list --head "$branch" --json state -q '.[0].state')

    if [ "$pr_state" = "MERGED" ]; then
        echo "⚠️  Remote 分支 $branch 對應的 PR 已 merged，但分支未刪除"
        # 提示使用者可手動刪除或由 GitHub 自動清理
    fi
done
```

## 使用場景

### 場景 1：PR 已 merged，清理 worktree

```
執行 /vul-cleanup
→ 選擇已 merged 的 worktree
→ 確認清理
→ 刪除 worktree 和本地分支
```

### 場景 2：手動刪除了 worktree 目錄

```
使用者手動: rm -rf ../my-project-security-4602399
執行 /vul-cleanup
→ 檢測到目錄不存在
→ 選擇清理 git 記錄
→ 執行 prune
```

### 場景 3：批量清理多個已 merge 的 worktree

```
執行 /vul-cleanup
→ 多選所有已 merged 的 worktree
→ 批量清理
```

## 安全檢查

- ✅ 檢查 worktree 是否有未 commit 的變更
- ✅ 檢查 PR 狀態避免誤刪進行中的工作
- ✅ 詢問確認避免誤操作
- ✅ 分支有未 merge 變更時警告
- ✅ 處理手動刪除目錄的情況

## Notes

- 主目錄的 worktree 永遠不會被清理
- Remote 分支不會被此 skill 刪除（由 GitHub 自動管理）
- 如果 PR 進行中但需要清理，使用者需明確確認
