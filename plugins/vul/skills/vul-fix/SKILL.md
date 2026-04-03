---
name: vul-fix
description: >-
  依據決策報告進行漏洞修復，包含 Checkmarx 程式碼漏洞、Mend 套件漏洞和 Docker Image 漏洞。當使用者要求修復安全漏洞、或執行 /vul-fix 時使用此 skill。
metadata:
  version: 1.1.0
---

# Vul Fix

依據決策報告進行漏洞修復。

## Prerequisites

- 已執行 `/vul-analyze` 並產出分析報告
- **建議**已執行 `/vul-decision` 並產出決策報告
- 目前在 vul-analyze 建立的 worktree 目錄中
- 分支為 `security/fix-{COMMIT_7}`
- 狀態為 `analyzed`（無 vul-decision）或 `decision`（正常流程）

## Workflow

### 1. 確認環境

#### 1.1 檢查當前位置和分支

```bash
# 確認當前位置和分支
pwd  # 應該在 worktree 目錄
git branch --show-current  # 應該是 security/fix-{COMMIT_7}
git status  # 確認工作目錄乾淨

# 取得 commit hash
COMMIT_7=$(git branch --show-current | sed 's/security\/fix-//')
```

如果不在 worktree 中，提示使用者：
```
⚠️  請先執行 /vul-analyze 建立 worktree
或切換到現有的 worktree 目錄
```

#### 1.2 檢查狀態

```bash
# 檢查當前狀態
if [ -f "docs/security/scan-status.json" ]; then
    current_status=$(jq -r --arg commit "${COMMIT_7}" '.[$commit].status' docs/security/scan-status.json)

    if [ "$current_status" != "analyzed" ] && [ "$current_status" != "decision" ]; then
        echo "⚠️  當前狀態為 $current_status，預期應為 analyzed 或 decision"

        if [ "$current_status" = "in_progress" ]; then
            echo "修復流程似乎已經開始，是否要繼續？"
        elif [ "$current_status" = "fixed" ]; then
            echo "修復已完成，是否要重新修復？"
        fi

        # 使用 AskUserQuestion 詢問是否繼續
    fi

    # 根據狀態決定修復策略
    if [ "$current_status" = "decision" ]; then
        echo "✅ 偵測到決策報告，將依據決策報告修復"
        HAS_DECISION=true
    elif [ "$current_status" = "analyzed" ]; then
        echo "ℹ️  無決策報告，將嘗試修復所有漏洞"
        HAS_DECISION=false
    fi
fi
```

### 2. 讀取決策報告

> [!IMPORTANT]
> **決策報告優先**：
>
> 修復應該根據決策報告進行，只修復「決定修復」的項目，
> 跳過「決定不修復」的項目，避免浪費時間。

#### 2.1 檢查是否有決策報告

```bash
# 檢查是否有決策報告
DECISION_REPORT="docs/security/${COMMIT_7}/decision-${COMMIT_7}.md"

if [ -f "$DECISION_REPORT" ]; then
    echo "✅ 找到決策報告"
    HAS_DECISION=true
else
    echo "⚠️  未找到決策報告"
    echo ""
    echo "建議先執行 /vul-decision 審查漏洞並制定修復計畫"
    echo ""
    HAS_DECISION=false
fi
```

#### 2.2 詢問處理方式

如果沒有決策報告，**使用 AskUserQuestion 工具**：

| 選項 | 說明 | 建議 |
|------|------|------|
| 選項 1 | 先執行 /vul-decision 進行審查（推薦）| 可以避免修復不必要的項目 |
| 選項 2 | 繼續（嘗試修復所有漏洞）| 適合確定要修復所有漏洞的情況 |
| 選項 3 | 取消 | 返回執行 /vul-decision |

如果選擇「取消」，停止執行。

#### 2.3 讀取修復清單

**如果有決策報告**：

```bash
# 讀取決策報告
# 提取「決定修復」的項目清單（按嚴重度）
# 提取「決定不修復」的項目清單（用於跳過）

echo "📋 修復計畫（根據決策報告）:"
echo "- 待修復: {to_fix_count} 項"
echo "- 跳過: {no_action_count} 項（已決定暫不修復）"
echo ""
echo "修復順序（按嚴重度）:"
echo "  🔴 Critical: {critical_count} 項"
echo "  🟠 High: {high_count} 項"
echo "  🟡 Medium: {medium_count} 項"
echo "  🔵 Low: {low_count} 項"
echo ""
```

**如果沒有決策報告**（選擇繼續）：

```bash
echo "ℹ️  未找到決策報告，將嘗試修復所有漏洞"
echo "   按嚴重度順序: Critical > High > Medium > Low"
```

### 3. 讀取分析報告

讀取當前 worktree 的 3 份分析報告（獲取修復細節）：
- `docs/security/{COMMIT_7}/analyses/vul-cxo-{COMMIT_7}.md`
- `docs/security/{COMMIT_7}/analyses/vul-mend-{COMMIT_7}.md`
- `docs/security/{COMMIT_7}/analyses/vul-mend-img-{COMMIT_7}.md`

顯示漏洞摘要：
```
📊 漏洞統計:
- Checkmarx: 🔴 {critical} | 🟠 {high} | 🟡 {medium} | 🔵 {low}
- Mend 依賴: 🔴 {critical} | 🟠 {high} | 🟡 {medium} | 🔵 {low}
- Docker Image: 🔴 {critical} | 🟠 {high} | 🟡 {medium} | 🔵 {low}
```

### 4. 更新狀態為 in_progress

```bash
# 更新狀態
jq --arg commit "${COMMIT_7}" \
   --arg fix_started_at "$(date -Iseconds)" \
   --arg fix_branch "security/fix-${COMMIT_7}" \
   '.[$commit].status = "in_progress" |
    .[$commit].fix_started_at = $fix_started_at |
    .[$commit].fix_branch = $fix_branch' \
   docs/security/scan-status.json > /tmp/scan-status.tmp && \
mv /tmp/scan-status.tmp docs/security/scan-status.json

echo "✅ 狀態已更新為 in_progress"
```

### 5. 依序修復漏洞

> [!IMPORTANT]
> **修復策略**：
> - **有決策報告**：只修復「決定修復」的項目，按嚴重度（Critical→High→Medium→Low）
> - **無決策報告**：嘗試修復所有漏洞，按嚴重度（Critical→High→Medium→Low）
> - **記錄結果**：記錄每個漏洞的修復狀態（成功/失敗/跳過）

根據決策或分析報告進行修復：

#### 5.1 Checkmarx 程式碼漏洞

從分析報告 `vul-cxo-{COMMIT_7}.md` 中讀取每個漏洞：
- 檔案位置和行號
- CWE 類型和說明
- 建議的修復方式

根據 CWE 類型參考以下常見修復模式（**僅供參考，實際修復需依據分析報告建議**）：

| CWE 類別 | 常見修復方向 |
|---------|------------|
| CWE-259/798 (硬編碼憑證) | 移至環境變數、Secret Manager 或設定檔 |
| CWE-89 (SQL Injection) | 使用參數化查詢或 ORM |
| CWE-79 (XSS) | 輸出編碼、使用安全的模板引擎 |
| CWE-22 (Path Traversal) | 路徑驗證、使用白名單 |
| CWE-327 (弱加密) | 使用現代加密演算法 |

> [!IMPORTANT]
> 具體修復方式必須參考分析報告中的詳細建議和程式碼範例

#### 5.2 Mend 依賴套件漏洞

從分析報告 `vul-mend-{COMMIT_7}.md` 中讀取：
- 有漏洞的套件名稱和版本
- 修復版本
- 依賴類型（直接 or 傳遞）
- 修復步驟（constraints 或直接升級）

根據專案類型執行修復：

**Gradle 專案**：
```groovy
// 在 build.gradle 中
dependencies {
    // 方式 1: 直接升級（直接依賴）
    implementation '{package}:{version}'

    // 方式 2: 使用 constraints（傳遞依賴）
    constraints {
        implementation('{package}:{version}') {
            because '{CVE}: {reason}'
        }
    }
}
```

**Maven 專案**：
```xml
<!-- 在 pom.xml 中 -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>...</groupId>
            <artifactId>...</artifactId>
            <version>...</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

**Node.js 專案**：
```bash
npm install {package}@{version}
# 或在 package.json 中使用 overrides
```

#### 5.3 Mend Docker Image 漏洞

從分析報告 `vul-mend-img-{COMMIT_7}.md` 中讀取：
- 有漏洞的系統套件
- 建議的修復方案（升級 base image / 遷移到 Alpine / Distroless）

根據分析報告建議選擇修復方式：
- 升級 base image 版本
- 在 Dockerfile 中升級特定套件
- 或遷移到更安全的 base image

### 6. 執行測試

確保修復後所有測試通過：

```bash
# 根據專案類型執行測試
./gradlew test          # Gradle
./mvnw test            # Maven
npm test               # Node.js
go test ./...          # Go
pytest                 # Python
```

如果測試失敗，繼續調整修復直到通過。

### 7. Commit 修復

將所有修復變更 commit。

**Commit Message 內容指引**：

根據實際修復的漏洞，commit body 應包含：

1. **Checkmarx 漏洞**（如有）：
   - 格式：`- 修復 {CWE-ID} {漏洞類型} 於 {檔案}:{行號}`
   - 範例：`- 修復 CWE-89 SQL Injection 於 UserService.java:45`

2. **Mend 依賴漏洞**（如有）：
   - 格式：`- 升級 {套件名稱} {舊版本} → {新版本} ({CVE})`
   - 範例：`- 升級 commons-fileupload 1.5 → 1.6.0 (CVE-2025-48976)`

3. **Docker Image 漏洞**（如有）：
   - 格式：`- 升級 base image 至 {新版本}` 或 `- 修復 {套件} {漏洞描述}`
   - 範例：`- 升級 base image 至 eclipse-temurin:17-jre-jammy`

```bash
git add .
```

使用 **git-commit agent** 提交變更，提供以下 dispatch context：
- 目的：安全漏洞修復
- 範圍：commit ${COMMIT_7} 的安全漏洞修復
- 修復項目清單：列出每項已修復的 CVE/CWE 編號、漏洞類型、修復方式
- 參考上方「Commit Message 內容指引」產生 commit body

**Fallback**（如果 git-commit agent 不可用）：

```bash
git commit -m "$(cat <<'EOF'
fix: 修復 commit {COMMIT_7} 的安全漏洞

{依照上方格式列出所有修復項目，每行一項}
EOF
)"
```

> [!NOTE]
> Commit message 內容應該根據**實際修復的漏洞**動態生成，而不是寫死的範例

### 8. Push 到 Remote

```bash
git push -u origin security/fix-{COMMIT_7}
```

### 9. 更新狀態為 fixed

修復完成並 push 後，更新狀態：

```bash
# 更新 scan-status.json 狀態
jq --arg commit "${COMMIT_7}" \
   --arg fixed_at "$(date -Iseconds)" \
   '.[$commit].status = "fixed" |
    .[$commit].fixed_at = $fixed_at' \
   docs/security/scan-status.json > /tmp/scan-status.tmp && \
mv /tmp/scan-status.tmp docs/security/scan-status.json

echo "✅ 狀態已更新為 fixed"
```

### 10. 提交狀態變更

```bash
# 提交狀態更新
git add docs/security/scan-status.json
```

使用 **git-commit agent** 提交變更，提供以下 dispatch context：
- 目的：標記安全掃描狀態為 fixed
- 範圍：commit ${COMMIT_7} 修復完成
- 主要變更：scan-status.json 狀態更新

**Fallback**（如果 git-commit agent 不可用）：

```bash
git commit -m "$(cat <<EOF
docs: mark security scan ${COMMIT_7} as fixed

修復完成並已 push 到 remote
EOF
)"
```

提交後推送到 remote：

```bash
git push

echo "✅ 狀態變更已提交並 push"
```

### 11. 生成修復摘要報告

建立 `docs/security/${COMMIT_7}/fix-summary-${COMMIT_7}.md` 記錄修復結果。

> [!NOTE]
> 報告格式參考 `references/fix-summary-template.md`

**報告必須包含**：

1. **基本資訊**
   - Commit、修復日期、執行者

2. **修復統計**
   - 成功修復數量
   - 失敗數量
   - 跳過數量（根據決策報告）

3. **修復明細**
   - **成功修復項目**：
     - 按來源（Checkmarx/Mend/Image）分組
     - 每項包含：漏洞編號、嚴重度、修復方式、commit hash

   - **修復失敗項目**：
     - 失敗原因（測試失敗、相容性問題等）
     - 建議的替代方案

   - **跳過項目**：
     - 來自決策報告的「決定不修復」項目
     - 引用決策理由

4. **測試結果**
   - 測試通過情況
   - 需要額外驗證的部分

5. **後續建議**
   - 失敗項目的處理建議
   - 需要人工確認的部分

```bash
# 生成修復摘要報告
# （根據修復過程中記錄的資訊生成）

echo "✅ 修復摘要報告已生成: docs/security/${COMMIT_7}/fix-summary-${COMMIT_7}.md"
```

### 12. 輸出摘要

```
✅ 漏洞修復完成

🌿 分支: security/fix-{COMMIT_7}
📝 Commit: {commit_hash}
🔗 Remote: 已 push

修復統計:
- ✅ 成功修復: {success_count} 個
  - Checkmarx: {cxo_fixed} 個
  - Mend 依賴: {mend_fixed} 個
  - Docker Image: {img_fixed} 個
- ❌ 修復失敗: {failed_count} 個
- ⏭️  跳過（依決策）: {skipped_count} 個

📄 修復摘要報告: docs/security/{COMMIT_7}/fix-summary-{COMMIT_7}.md

下一步:
執行 /vul-pr 建立 Pull Request
```

## Interaction Guidelines

- 每個修復步驟確認後再進行
- 對於有多種修復方式的漏洞，列出選項讓使用者選擇
- 若修復可能影響功能，優先告知風險
