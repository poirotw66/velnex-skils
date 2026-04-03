---
name: vul-decision
description: >-
  審查漏洞分析報告，與 AI 協作決策後續處理方式（修復或不修復），並記錄決策理由。當使用者要求審查漏洞、決定修復策略、或執行 /vul-decision 時使用此 skill。
metadata:
  version: 1.1.0
---

# Vul Decision

審查漏洞分析報告，與 AI 協作決策處理方式。

## Prerequisites

- 已執行 `/vul-analyze` 完成分析
- 目前在 worktree 目錄中
- 狀態為 `analyzed`

## Workflow

### 1. 確認環境

#### 1.1 檢查當前狀態

```bash
# 確認在 worktree 中
pwd
git branch --show-current  # 應該是 security/fix-{COMMIT_7}

# 取得 commit hash
COMMIT_7=$(git branch --show-current | sed 's/security\/fix-//')
```

#### 1.2 檢查狀態和報告

```bash
# 檢查狀態是否為 analyzed
if [ -f "docs/security/scan-status.json" ]; then
    current_status=$(jq -r --arg commit "${COMMIT_7}" '.[$commit].status' docs/security/scan-status.json)

    if [ "$current_status" != "analyzed" ]; then
        echo "⚠️  當前狀態為 $current_status，預期應為 analyzed"
        echo "請先執行 /vul-analyze"
        exit 1
    fi
fi

# 檢查是否已有決策報告
if [ -f "docs/security/${COMMIT_7}/decision-${COMMIT_7}.md" ]; then
    echo "⚠️  已存在決策報告"
    # 使用 AskUserQuestion 詢問：
    # 選項 1: 查看現有決策
    # 選項 2: 重新決策（覆蓋）
    # 選項 3: 取消
fi

# 確認分析報告存在
if [ ! -d "docs/security/${COMMIT_7}/analyses" ]; then
    echo "❌ 找不到分析報告"
    echo "請先執行 /vul-analyze"
    exit 1
fi

echo "✅ 環境檢查完成"
```

### 2. 讀取分析報告

讀取 3 份分析報告：

```bash
# 讀取報告檔案
REPORTS_DIR="docs/security/${COMMIT_7}/analyses"
CXO_REPORT="${REPORTS_DIR}/vul-cxo-${COMMIT_7}.md"
MEND_REPORT="${REPORTS_DIR}/vul-mend-${COMMIT_7}.md"
MEND_IMG_REPORT="${REPORTS_DIR}/vul-mend-img-${COMMIT_7}.md"
```

解析並統計漏洞數量：
- Checkmarx: Critical, High, Medium, Low
- Mend 依賴: Critical, High, Medium, Low
- Mend Image: Critical, High, Medium, Low

### 3. AI 協助分析

> [!IMPORTANT]
> **AI 協作角色**：
>
> AI 協助使用者理解漏洞並做出決策，但修復建議已在 analyze 報告中。

#### 3.1 提取關鍵資訊

從分析報告中提取：
- 每個漏洞的詳細資訊（CVE、嚴重度、來源）
- 按嚴重度分組統計

#### 3.2 協助評估

對漏洞進行分析：

**風險識別**：
- 嚴重度分類（Critical/High/Medium/Low）
- 影響範圍（程式碼/依賴/Docker Image）

**可能的不修復情境**：
- False Positive
- 漏洞不適用於目前使用情境
- 已有其他緩解措施
- 修復成本過高且風險可接受

### 4. 與使用者討論

#### 4.1 呈現漏洞統計

```
📊 漏洞統計摘要

| 來源 | Critical | High | Medium | Low | 總計 |
|------|----------|------|--------|-----|------|
| Checkmarx | 0 | 2 | 3 | 1 | 6 |
| Mend 依賴 | 1 | 3 | 5 | 2 | 11 |
| Mend Image | 0 | 1 | 2 | 0 | 3 |
| **總計** | **1** | **6** | **10** | **3** | **20** |
```

#### 4.2 呈現漏洞分類

```
📋 漏洞分類

🔴 Critical (1 項)
  - CVE-2024-1234: commons-fileupload RCE

🟠 High (6 項)
  - SQL Injection x 2
  - XSS x 3
  - 敏感資訊洩漏 x 1

🟡 Medium (10 項)
  - 各類中等風險漏洞

🔵 Low (3 項)
  - 低風險漏洞
```

> 詳細修復建議請參考 `docs/security/{commit}/analyses/` 中的分析報告

#### 4.3 討論處理方式

**使用 AskUserQuestion 工具**詢問處理方式：

| 選項 | 說明 |
|------|------|
| 選項 1 | 接受 AI 建議，修復 9 項，其他評估後決定（推薦）|
| 選項 2 | 逐項審查並決定（詳細模式，適合複雜情況）|
| 選項 3 | 全部修復（適合時間充裕且要求嚴格的情況）|
| 選項 4 | 全部不修復（需說明原因）|

#### 4.4 收集決策（根據選擇）

**選項 1 - 接受 AI 建議**：
- 自動標記 9 項為「修復」
- 對其他 11 項逐一詢問或批量處理

**選項 2 - 逐項審查**：
- 逐一顯示漏洞資訊
- 呈現 AI 建議
- 詢問：修復 / 不修復（需原因）/ 稍後決定

**選項 3 - 全部修復**：
- 所有漏洞標記為「修復」
- 按優先順序排序

**選項 4 - 全部不修復**：
- 詢問整體原因（例如：「此 commit 僅用於測試環境」）
- 所有漏洞標記為「不修復」

### 5. 生成決策報告

建立 `docs/security/${COMMIT_7}/decision-${COMMIT_7}.md`

> [!NOTE]
> 報告格式參考 `references/decision-template.md`

**報告必須包含**：

1. **基本資訊**
   - Commit, 決策日期, 決策者

2. **漏洞統計**
   - 按來源和嚴重度分類

3. **決策摘要**
   - 修復數量 vs 不修復數量
   - 提示查看 analyses 報告以了解修復建議

4. **決策明細**
   - **決定修復的項目**：
     - 按嚴重度分組
     - 每項包含：來源、CVE/CWE、決策理由

   - **決定不修復的項目**：
     - 按嚴重度分組
     - 每項包含：來源、CVE/CWE、決策理由

5. **後續行動**
   - 如果有要修復的 → 建議執行 `/vul-fix`
   - 如果全部不修復 → 記錄在狀態中

### 6. 更新狀態追蹤

#### 6.1 計算統計資料

```bash
# 從決策報告或記憶中計算
TOTAL_VULNS=20
TO_FIX=15
NO_ACTION=5
```

#### 6.2 更新 scan-status.json

```bash
# 更新狀態
jq --arg commit "${COMMIT_7}" \
   --arg decision_at "$(date -Iseconds)" \
   --argjson total "$TOTAL_VULNS" \
   --argjson to_fix "$TO_FIX" \
   --argjson no_action "$NO_ACTION" \
   '.[$commit].status = "decision" |
    .[$commit].decision_at = $decision_at |
    .[$commit].decision_report = "decision-\($commit).md" |
    .[$commit].vulnerability_count = {
      "total": $total,
      "to_fix": $to_fix,
      "no_action": $no_action
    }' \
   docs/security/scan-status.json > /tmp/scan-status.tmp && \
mv /tmp/scan-status.tmp docs/security/scan-status.json
```

**如果全部不修復**，額外更新狀態為 `no_action`：

```bash
# 全部不修復時
jq --arg commit "${COMMIT_7}" \
   --arg decision_reason "{整體原因}" \
   '.[$commit].status = "no_action" |
    .[$commit].decision_reason = $decision_reason' \
   docs/security/scan-status.json > /tmp/scan-status.tmp && \
mv /tmp/scan-status.tmp docs/security/scan-status.json
```

### 7. 提交變更

```bash
# 加入決策報告和狀態
git add docs/security/${COMMIT_7}/decision-${COMMIT_7}.md
git add docs/security/scan-status.json
```

使用 **git-commit agent** 提交變更，提供以下 dispatch context：
- 目的：漏洞決策報告
- 範圍：commit ${COMMIT_7} 的漏洞決策
- 決策統計：總漏洞數 ${TOTAL_VULNS}，決定修復 ${TO_FIX}，決定不修復 ${NO_ACTION}
- 主要變更：決策報告 + scan-status.json 更新

**Fallback**（如果 git-commit agent 不可用）：

```bash
git commit -m "$(cat <<EOF
docs: add security vulnerability decision for ${COMMIT_7}

決策摘要：
- 總漏洞數: ${TOTAL_VULNS}
- 決定修復: ${TO_FIX}
- 決定不修復: ${NO_ACTION}

決策報告: docs/security/${COMMIT_7}/decision-${COMMIT_7}.md
EOF
)"
```

提交後推送到 remote：

```bash
git push
```

### 8. 輸出摘要

```
✅ 漏洞決策完成

📊 決策統計:
- 總漏洞數: 20
- 決定修復: 15 (包含 1 Critical, 6 High, 8 Medium)
- 決定不修復: 5 (5 Low)

📄 決策報告: docs/security/{commit_7}/decision-{commit_7}.md

後續步驟:
1. 📖 Review 決策報告，確認修復計畫
2. 🔧 執行修復: /vul-fix（將根據決策報告進行修復）
3. ⏭️  如全部不修復，流程結束（已標記為 no_action）
```

**如果全部不修復**：

```
✅ 漏洞決策完成

📊 決策統計:
- 總漏洞數: 5
- 決定不修復: 5 (全部)
- 原因: {決策理由}

📄 決策報告: docs/security/{commit_7}/decision-{commit_7}.md
🏁 狀態: no_action

流程結束。可執行 /vul-cleanup 清理 worktree。
```

## Interaction Guidelines

- AI 應扮演安全專家角色，提供專業建議但不強制決策
- 使用清晰的視覺化呈現漏洞資訊
- 對於複雜的技術細節，提供易懂的說明
- 尊重使用者的風險承受度和專案限制
- 記錄完整的決策理由，便於未來追溯

## Resources

### 模板
- **references/decision-template.md** - 決策報告模板
