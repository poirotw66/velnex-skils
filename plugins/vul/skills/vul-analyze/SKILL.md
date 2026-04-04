---
name: vul-analyze
description: >-
  從 GCS 下載漏洞掃描報告，分析 Checkmarx 和 Mend 掃描結果，產出 3 份漏洞分析報告。當使用者要求分析安全漏洞掃描報告、下載掃描結果、或執行 /vul-analyze 時使用此 skill。
metadata:
  version: 1.2.0
---

# Vul Analyze

從 GCS 下載弱掃報告並產出分析文件。

## Prerequisites

- 在 Git repository 目錄內
- 已安裝 `gsutil` CLI 並有 GCS 存取權限

## Configuration

在專案的 `.claude/CLAUDE.md` 中設定 GCS bucket：

```markdown
### vul 設定
- scan-bucket: gs://your-scan-bucket-name
- scan-branch: develop
```

> [!IMPORTANT]
> 執行前先讀取專案 `.claude/CLAUDE.md` 中的 `vul 設定` 區塊，取得 `scan-bucket` 值作為 `GCS_BUCKET` 變數，以及 `scan-branch` 值作為 `SCAN_BRANCH` 變數（預設：`develop`）。若 `scan-bucket` 未設定，提示使用者補上。

## Context 管理策略

> [!IMPORTANT]
> 為避免 Context Window 溢出，採用**分段處理**策略：
>
> 1. **分批分析**：一次只處理一份掃描報告
> 2. **選擇性讀取**：只讀取必要的專案檔案片段
> 3. **精簡依賴樹**：只提取有漏洞套件的相關路徑
> 4. **摘要優先**：先產生摘要，必要時再深入細節

## Workflow

### 1. 準備 Git 環境與選擇 Commit

> [!CAUTION]
> **使用 `${SCAN_BRANCH}` 分支**（從 Configuration 讀取，預設 `develop`）。執行前必須確保 git status 乾淨。

#### 1.1 檢查 Git 狀態

```bash
# 確認當前 git status 是乾淨的
git status
```

如果有未提交的變更：
- **使用 AskUserQuestion 工具**詢問使用者：
  - 選項 1：「暫存變更 (git stash)」
  - 選項 2：「放棄變更 (git reset --hard)」
  - 選項 3：「取消執行，讓我自己處理」
- 依據使用者選擇執行對應操作
- 如果使用者選擇「取消執行」，**停止 skill 執行**

#### 1.2 切換到掃描分支並同步最新程式碼

```bash
# 從 git remote URL 解析專案名稱
git remote get-url origin  # 用於識別專案名稱

# 切換到掃描分支（SCAN_BRANCH 從 Configuration 讀取，預設 develop）
git checkout ${SCAN_BRANCH}

# 拉取最新程式碼
git pull origin ${SCAN_BRANCH}
```

如果 `git pull` 失敗或有衝突，**停止執行**並提示使用者先處理衝突。

#### 1.3 選擇要分析的 Commit

```bash
# 列出最近 5 個 commit
git log --oneline -5
```

**使用 AskUserQuestion 工具**讓使用者選擇要分析的 commit：
- 選項 1：最新 commit (HEAD) - 短 hash + commit message
- 選項 2：第 2 新的 commit - 短 hash + commit message
- 選項 3：第 3 新的 commit - 短 hash + commit message
- 選項 4：第 4 新的 commit - 短 hash + commit message
- 選項 5：第 5 新的 commit - 短 hash + commit message
- 選項 6：「手動輸入 commit hash」

如果使用者選擇「手動輸入」，再次使用 AskUserQuestion 讓使用者輸入完整或短 commit hash。

驗證 commit 是否存在：
```bash
git rev-parse --verify {commit_hash}
```

#### 1.4 檢查 GCS 上是否有掃描報告

在建立 worktree 之前，先確認 GCS 上有對應的掃描報告，避免建立無用的 worktree。

```bash
# 準備變數
COMMIT={user_selected_commit}
COMMIT_7=${COMMIT:0:7}
PROJECT={project_name}  # 從 git remote URL 解析

# 使用 Glob 找到此 skill 的腳本完整路徑：**/vul-analyze/scripts/check-scan.sh
if ! <skill_scripts>/check-scan.sh "${PROJECT}" "${COMMIT}" "${GCS_BUCKET}"; then
    echo ""
    echo "❌ GCS 檢查失敗，停止執行"
    echo "   請確認 commit 是否已執行弱掃流程"
    exit 1
fi

echo "✅ GCS 檢查通過，準備建立 worktree"
```

> [!NOTE]
> **check-scan.sh 腳本功能**：
> - 檢查 gsutil 是否安裝
> - 驗證 GCS 上有對應的掃描報告
> - 列出找到的檔案清單
> - 顯示預期的 8 個檔案
>
> **Exit codes**：
> - `0` - 找到掃描報告
> - `1` - 找不到掃描報告或參數錯誤
> - `2` - gsutil 未安裝

**預期檔案（共 8 個）**：

**Checkmarx SAST (2 個)**
- `cxone-report.json` - 程式碼漏洞資料
- `cxone-report.pdf` - 程式碼漏洞報告

**Mend 依賴掃描 (3 個)**
- `MendReportResource.json` - 套件漏洞資料
- `MendReport.pdf` - 套件漏洞與授權整合報告
- `MendReportLicense.json` - 套件授權資訊

**Mend Image 掃描 (3 個)**
- `MendReportImgResource.json` - Image 漏洞資料
- `MendReportImg.pdf` - Image 漏洞與授權整合報告
- `MendReportImgLicense.json` - Image 授權資訊

> [!IMPORTANT]
> **為什麼要提前檢查 GCS？**
>
> 在建立 worktree 之前先確認掃描報告存在，可以避免：
> - 建立了無用的 worktree（佔用磁碟空間）
> - 發現報告不存在時，需要手動清理 worktree
> - 浪費時間在無法完成的分析流程上

#### 1.5 建立 Worktree 和安全修復分支

```bash
# 變數已在步驟 1.4 準備好
# COMMIT, COMMIT_7, PROJECT 已設定
WORKTREE_DIR="../${PROJECT}-security-${COMMIT_7}"
BRANCH_NAME="security/fix-${COMMIT_7}"

# 檢查 worktree 是否已存在
if [ -d "${WORKTREE_DIR}" ]; then
    echo "⚠️  Worktree 已存在: ${WORKTREE_DIR}"
    # 使用 AskUserQuestion 詢問：
    # 選項 1: 使用現有 worktree
    # 選項 2: 刪除並重建
    # 選項 3: 取消執行
fi

# 檢查分支是否已存在
if git show-ref --verify --quiet refs/heads/${BRANCH_NAME}; then
    echo "⚠️  分支已存在: ${BRANCH_NAME}"
    # 使用 AskUserQuestion 詢問：
    # 選項 1: 使用現有分支
    # 選項 2: 刪除並重建
    # 選項 3: 取消執行
fi

# 建立 worktree 和分支
echo "🌳 建立 Worktree..."
git worktree add "${WORKTREE_DIR}" -b "${BRANCH_NAME}" "${COMMIT}"

# 切換到 worktree 目錄
cd "${WORKTREE_DIR}"

# 確認狀態
echo "✅ Worktree 已建立並切換"
echo "📂 目錄: $(pwd)"
echo "🌿 分支: $(git branch --show-current)"
echo "📝 Commit: $(git log --oneline -1)"
```

> [!IMPORTANT]
> **Worktree 說明**：
> - Worktree 位於主目錄的平行目錄，不影響主工作區
> - 可以同時分析多個 commit（每個在獨立的 worktree）
> - 分析報告和修復都在此 worktree 中進行
> - PR merge 後再清理 worktree

### 2. 檢查本地報告狀態

> [!NOTE]
> 以下步驟都在 worktree 目錄中執行
>
> GCS 上的掃描報告已在步驟 1.4 確認存在，此步驟檢查本地狀態。

#### 2.1 檢查本地是否已下載掃描報告

```bash
# 檢查本地目錄是否存在
if [ -d ".security-scans/${COMMIT_7}" ]; then
  echo "掃描報告已存在於本地"
  ls -lh .security-scans/${COMMIT_7}/
fi
```

如果本地已有掃描報告：
- 顯示：`✅ 掃描報告已存在，跳過下載`
- **跳過步驟 3 的下載動作**

如果本地沒有掃描報告：
- 顯示：`📥 準備從 GCS 下載掃描報告`
- 繼續執行步驟 3

#### 2.2 檢查是否已有分析報告

```bash
# 檢查分析報告目錄
if [ -d "docs/security/${COMMIT_7}/analyses" ]; then
  echo "已存在分析報告："
  ls -lh docs/security/${COMMIT_7}/analyses/
fi
```

如果已存在分析報告，**使用 AskUserQuestion 工具**詢問使用者：
- 選項 1：「重新分析（刪除舊報告）」
- 選項 2：「保留舊報告，停止執行」

如果使用者選擇「重新分析」：
```bash
# 刪除舊的分析報告
rm -rf docs/security/${COMMIT_7}/analyses/
echo "✅ 已刪除舊報告，準備重新分析"
```

如果使用者選擇「保留舊報告」：
- **停止執行**並顯示：`✅ 保留現有分析報告，停止執行`

### 3. 下載掃描報告（如需要）

> [!NOTE]
> - GCS 上的掃描報告已在步驟 1.4 確認存在
> - 如果步驟 2.1 確認本地已有掃描報告，則跳過此步驟

使用 skill 提供的下載腳本：

```bash
# 使用 Glob 找到此 skill 的腳本完整路徑：**/vul-analyze/scripts/download-scan.sh
<skill_scripts>/download-scan.sh "${PROJECT}" "${COMMIT}" "${GCS_BUCKET}"
```

> [!NOTE]
> **download-scan.sh 腳本功能**：
> - 下載所有 8 個掃描報告檔案到 `.security-scans/${COMMIT_7}/`
> - 自動將 `.security-scans/` 加入 `.gitignore`（如果尚未加入）
> - 顯示下載進度和結果
>
> **前置條件**：
> - GCS 上的掃描報告已在步驟 1.4 確認存在
> - 因此這裡應該不會因為找不到報告而失敗
>
> **檔案清單**（共 8 個）：
> - Checkmarx: `cxone-report.json`, `cxone-report.pdf`
> - Mend 依賴: `MendReportResource.json`, `MendReport.pdf`, `MendReportLicense.json`
> - Mend Image: `MendReportImgResource.json`, `MendReportImg.pdf`, `MendReportImgLicense.json`

**如果腳本執行失敗**，使用手動下載：

```bash
# 建立目錄
mkdir -p .security-scans/${COMMIT_7}

# 逐一下載檔案（共 8 個）
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/cxone-report.json .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/cxone-report.pdf .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/MendReportResource.json .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/MendReport.pdf .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/MendReportLicense.json .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/MendReportImgResource.json .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/MendReportImg.pdf .security-scans/${COMMIT_7}/
gsutil cp ${GCS_BUCKET}/${PROJECT}/${COMMIT_7}/MendReportImgLicense.json .security-scans/${COMMIT_7}/

# 確認下載結果
ls -lh .security-scans/${COMMIT_7}/
```

#### 故障排除

如果下載失敗，檢查：
1. 網路連線是否正常
2. GCS 權限是否過期（重新執行 `gcloud auth login`）

> [!NOTE]
> gsutil 安裝狀態、GCS 路徑和 commit 弱掃狀態已在步驟 1.4 驗證過。

### 4. 專案分析

> [!NOTE]
> **掃描報告檔案說明**：
>
> 每次掃描會產生 8 個檔案，分為三類：
>
> 1. **Checkmarx SAST** (程式碼靜態分析)
>    - `cxone-report.json`: 機器可讀的漏洞資料
>    - `cxone-report.pdf`: 人類可讀的報告
>
> 2. **Mend 依賴掃描** (套件漏洞分析)
>    - `MendReportResource.json`: 套件漏洞詳細資料
>    - `MendReportLicense.json`: 套件授權資訊
>    - `MendReport.pdf`: 漏洞與授權整合報告
>
> 3. **Mend Image 掃描** (Docker Image 分析)
>    - `MendReportImgResource.json`: Image 漏洞詳細資料
>    - `MendReportImgLicense.json`: Image 授權資訊
>    - `MendReportImg.pdf`: 漏洞與授權整合報告
>
> **分析策略**：
> - 主要使用 JSON 檔案進行漏洞分析（Resource 系列）
> - PDF 報告可作為人工審閱參考
> - License 檔案用於授權合規檢查（可選，建議與法務團隊確認）

> [!IMPORTANT]
> **PDF 處理策略**：
>
> Mend 報告為 PDF 格式，必須使用專業工具提取內容：
>
> 1. **使用 pdfplumber** (推薦)
>    - 安裝：`pip3 install pdfplumber`
>    - 提取漏洞資訊，包含 CVE、CVSS、套件名稱、版本、說明
>
> 2. **分段提取策略**
>    - 先檢查 PDF 頁數
>    - 提取「Security Vulnerabilities」章節
>    - 提取「Outdated Libraries」（選擇性）
>
> 3. **避免完整讀取**
>    - 只提取必要的漏洞資訊
>    - 使用 Python 腳本結構化解析

#### 4.1 基礎架構識別

讀取並分析以下檔案：

| 項目 | 檔案 | 分析重點 |
|------|------|----------|
| 建置工具 | `build.gradle.kts` / `build.gradle` / `pom.xml` / `package.json` | 建置工具類型、版本、依賴管理機制 |
| 框架版本 | 上述檔案中的版本宣告 | Spring Boot / Node.js / Go 版本，確認相容性約束 |
| Dockerfile | `Dockerfile` | Base image、多階段建置、系統套件安裝方式 |
| 語言/框架 | 程式碼結構 | Java/Kotlin/TypeScript/Go/Python，確認語言特性 |

#### 4.2 依賴狀態確認（必須執行）

> [!CAUTION]
> **不可跳過此步驟**。必須執行實際指令確認專案當前依賴狀態，才能產生準確的修復建議。

> [!TIP]
> **Context 優化技巧**：
> - 不要讀取完整的依賴樹輸出（可能有數千行）
> - 只針對有漏洞的套件執行 grep，提取相關片段
> - 使用 `head -50` 限制輸出長度

**對於 Gradle 專案**：
```bash
# 1. 針對每個有漏洞的套件，單獨查詢（避免產生完整依賴樹）
./gradlew dependencies --configuration runtimeClasspath | grep -A 3 -B 3 "commons-fileupload" | head -50

# 2. 使用 dependencyInsight 精確查詢（輸出較精簡）
./gradlew dependencyInsight --dependency commons-fileupload --configuration runtimeClasspath

# 3. 如果需要完整依賴樹，使用檔案而非直接讀取
./gradlew dependencies --configuration runtimeClasspath > /tmp/dependencies.txt
# 然後只 grep 需要的部分
```

**對於 Maven 專案**：
```bash
# 1. 產生完整依賴樹
mvn dependency:tree > /tmp/dependencies.txt

# 2. 確認特定套件的依賴路徑
grep -A 5 -B 5 "{package-name}" /tmp/dependencies.txt

# 3. 分析依賴衝突
mvn dependency:tree -Dverbose
```

**對於 Docker Image**：
```bash
# 1. 確認當前使用的 base image
grep "^FROM" Dockerfile

# 2. 檢查 Dockerfile 是否使用多階段建置
grep -c "^FROM" Dockerfile  # 大於 1 表示多階段
```

#### 4.3 依賴來源分析

針對 Mend 依賴掃描中的每個漏洞套件，必須確認：

1. **直接依賴** - 在 `build.gradle` / `pom.xml` 中明確宣告
   - 修復方式：直接升級版本

2. **傳遞依賴** - 由其他套件間接引入
   - 修復方式：使用 `constraints` / `dependencyManagement` / `overrides`
   - 必須找出是哪個直接依賴引入的

範例分析：
```
+--- org.springframework.boot:spring-boot-starter-web:3.2.0
|    +--- org.springframework.boot:spring-boot-starter-tomcat:3.2.0
|    |    +--- org.apache.tomcat.embed:tomcat-embed-core:10.1.15
|    |    |    +--- commons-fileupload:commons-fileupload:1.5 (有漏洞)
```
→ `commons-fileupload` 是傳遞依賴，由 `tomcat-embed-core` 引入

#### 4.4 風險評估與優先順序

根據以下因素評估修復優先順序：

1. **CVSS 評分**：Critical > High > Medium > Low
2. **可利用性**：是否有公開的 exploit
3. **專案暴露面**：是否在對外 API 中使用
4. **修復成本**：Minor 升級 vs Major 升級 vs 需要程式碼重構

#### 4.5 相容性風險評估

檢查升級可能的相容性問題：

- **語義化版本變更**：Major 版本升級可能有 Breaking Changes
- **依賴傳遞影響**：升級一個套件可能影響其他套件
- **框架整合**：某些套件版本與 Spring Boot / Node.js 版本有綁定關係

### 5. 產出分析報告

> [!IMPORTANT]
> **分段處理策略**：為避免 Context 溢出，建議按以下順序逐一產出報告：
>
> 1. 先產出 Checkmarx 報告（通常最簡單）
> 2. 再產出 Mend 依賴報告（需要執行依賴分析）
> 3. 最後產出 Docker Image 報告（需要分析 Dockerfile）

建立 `docs/security/{commit}/analyses/` 目錄，產出 3 份分析報告。

**目錄結構**：
```
docs/security/
├── {commit}/
│   └── analyses/
│       ├── vul-cxo-{commit}.md
│       ├── vul-mend-{commit}.md
│       └── vul-mend-img-{commit}.md
└── scan-status.json
```

**報告原則**：

> [!CAUTION]
> **報告撰寫原則**：
>
> 1. **只處理掃描報告中的實際問題** - 不輸出通用的安全最佳實踐
> 2. **無漏洞時簡潔記錄** - 不需要額外建議或最佳實踐章節
> 3. **不標註時程** - 不預估修復時間、不建議 Sprint 安排
> 4. **基於實際執行結果** - 先執行步驟 5 的指令確認，不憑空猜測
> 5. **提供多種方案** - 列出選項並說明適用情境
> 6. **可執行性** - 每個指令都可以直接複製貼上執行
> 7. **使用相對路徑** - 所有檔案路徑必須是相對於專案根目錄的相對路徑

> [!WARNING]
> **路徑處理重要提醒**：
>
> 報告中的所有檔案路徑**必須使用相對路徑**（相對於專案根目錄），不可包含絕對路徑。
>
> ✅ **正確範例**：
> - `src/main/java/com/example/UserService.java:123`
> - `src/controllers/AuthController.ts:45`
> - `Dockerfile:12`
>
> ❌ **錯誤範例**（包含使用者檔案系統路徑）：
> - `/Users/{user}/Workspace/.../src/main/java/com/example/UserService.java:123`
> - `/home/{user}/projects/.../src/controllers/AuthController.ts:45`
> - `../my-project-security-{commit_7}/Dockerfile:12`
>
> **處理方式**：
> - 從掃描報告 JSON 中提取路徑時，移除專案根目錄之前的所有路徑部分
> - 確保路徑從專案根目錄開始（例如 `src/`、`Dockerfile`）
> - 報告提交到 Git 後，其他人才能看到適用的路徑

#### 5.1 Checkmarx 程式碼掃描報告

| 報告 | 來源 | 輸出 |
|------|------|------|
| Checkmarx SAST | `cxone-report.json` | `vul-cxo-{commit}.md` |

> [!IMPORTANT]
> **報告格式要求**：
> 1. **必須**先讀取範本檔案：`references/vul-cxo.md`
> 2. **嚴格遵循**範本中的表格格式和章節結構
> 3. 將範本中的變數（如 `{{PROJECT}}`、`{{COMMIT}}` 等）替換為實際資料
> 4. 保持範本中的 Markdown 表格格式（不要改為單行文字）

**有漏洞時必須包含**：

1. **掃描結果摘要** - 漏洞數量統計表
2. **漏洞清單** - 每個漏洞包含：
   - 檔案路徑和行號（**使用相對路徑**，例如 `src/main/java/com/example/Service.java:123`）
   - CWE 編號和名稱
   - 漏洞說明和影響範圍
   - 程式碼片段（如果可提取）
   - 修復建議和範例程式碼
3. **修復步驟** - 根據專案框架提供可直接使用的程式碼範例
4. **驗證步驟** - 確認修復的指令

> [!TIP]
> 從 `cxone-report.json` 提取檔案路徑時，需要移除專案根目錄之前的路徑部分，只保留從專案根目錄開始的相對路徑。

**無漏洞時**：
- 只需記錄掃描結果摘要（漏洞數為 0）
- 不需要「建議作法」或「最佳實踐」章節

#### 5.2 Mend 依賴套件掃描報告

| 報告 | 資料來源 | 輸出 |
|------|------|------|
| Mend 依賴掃描 | `MendReportResource.json` (漏洞) + `MendReportLicense.json` (授權) | `vul-mend-{commit}.md` |

> [!IMPORTANT]
> **報告格式要求**：
> 1. **必須**先讀取範本檔案：`references/vul-mend.md`
> 2. **嚴格遵循**範本中的表格格式和章節結構
> 3. 將範本中的變數替換為實際資料
> 4. 保持範本中的 Markdown 表格格式（不要改為單行文字）

> [!NOTE]
> PDF 報告 (`MendReport.pdf`) 包含漏洞與授權的完整內容，可作為參考。

**報告結構（兩大部分）**：

**Part 1: 漏洞清單與修復建議**（基於 `MendReportResource.json`）

1. **掃描結果摘要** - 漏洞數量、總依賴數
2. **漏洞清單** - 每個漏洞包含：
   - CVE 編號、CVSS 評分、發現日期
   - 當前版本 vs 修復版本 vs 最新穩定版
   - 漏洞說明和影響範圍
   - 依賴路徑確認指令
3. **依賴來源確認**（基於步驟 5.3）
   - 明確標示：直接依賴 or 傳遞依賴
   - 如果是傳遞依賴，說明由哪個套件引入
4. **修復方式**（根據實際情況選擇適用的）
   - 升級直接依賴
   - 使用 constraints 強制版本
   - 排除後重新引入
5. **驗證步驟**

**Part 2: 授權合規資訊**（基於 `MendReportLicense.json`，**可選**）

6. **授權風險套件** - 列出有授權風險的套件
7. **建議處理方式** - 授權合規建議

> [!TIP]
> **授權資訊處理建議**：
> - 授權合規問題屬於法務審查範疇
> - 可在報告中簡要列出高風險授權套件
> - 建議與法務團隊確認後再處理
> - 如無授權問題或時間有限，此部分可略過

**無漏洞時**：
- 只需記錄掃描結果摘要
- 不需要「建議作法」章節

#### 5.3 Mend Docker Image 掃描報告

| 報告 | 資料來源 | 輸出 |
|------|------|------|
| Mend Image 掃描 | `MendReportImgResource.json` (漏洞) + `MendReportImgLicense.json` (授權) | `vul-mend-img-{commit}.md` |

> [!IMPORTANT]
> **報告格式要求**：
> 1. **必須**先讀取範本檔案：`references/vul-mend-img.md`
> 2. **嚴格遵循**範本中的表格格式和章節結構
> 3. 將範本中的變數替換為實際資料
> 4. 保持範本中的 Markdown 表格格式（不要改為單行文字）

> [!NOTE]
> PDF 報告 (`MendReportImg.pdf`) 包含漏洞與授權的完整內容，可作為參考。

**報告結構（兩大部分）**：

**Part 1: 漏洞清單與修復方案**（基於 `MendReportImgResource.json`）

1. **掃描結果摘要** - 漏洞數量、總套件數、過時套件數
2. **Dockerfile 分析** - 當前 base image、多階段建置情況
3. **漏洞清單** - 每個漏洞的詳細資訊
4. **修復方案**（根據實際情況）
   - 升級 Base Image
   - 在 Dockerfile 中升級特定套件
   - 遷移至 Distroless
   - 使用 Alpine Base Image
5. **驗證步驟**

**Part 2: 授權合規資訊**（基於 `MendReportImgLicense.json`，**可選**）

6. **授權風險套件** - 列出有授權風險的套件
7. **建議處理方式** - 授權合規建議

> [!TIP]
> **授權資訊處理建議**：
> - Image 中的授權問題通常來自 base image 或系統套件
> - 可在報告中簡要列出高風險授權套件
> - 建議與法務團隊確認後再處理
> - 如無授權問題或時間有限，此部分可略過

**無漏洞時**：
- 記錄掃描結果摘要（無漏洞）
- 如有過時套件，可記錄統計數據
- 不需要「建議作法」章節

#### 5.4 報告品質檢查清單

產出報告前，確認以下項目：

- [ ] 所有的修復指令都是可直接執行的（不需要替換 placeholder）
- [ ] 所有的程式碼範例都基於專案實際架構
- [ ] 針對傳遞依賴提供了依賴路徑確認指令
- [ ] Docker 修復提供了多種方案並說明適用情境
- [ ] 相容性風險有明確警告
- [ ] **沒有**輸出通用的安全最佳實踐內容
- [ ] **沒有**時程估算或 Sprint 建議
- [ ] 無漏洞時報告簡潔，不包含額外建議
- [ ] **已讀取並遵循**對應的範本檔案格式（vul-cxo.md、vul-mend.md、vul-mend-img.md）
- [ ] 使用 Markdown 表格格式，而非單行文字
- [ ] **所有檔案路徑使用相對路徑**（從專案根目錄開始，不包含絕對路徑或 worktree 路徑）

### 6. 更新狀態追蹤

更新 `docs/security/scan-status.json`：

```json
{
  "{commit}": {
    "status": "analyzed",
    "analyzed_at": "{ISO8601}",
    "fix_started_at": null,
    "fixed_at": null,
    "pr_created_at": null,
    "completed_at": null,
    "reports": [
      "vul-cxo-{commit}.md",
      "vul-mend-{commit}.md",
      "vul-mend-img-{commit}.md"
    ],
    "fix_branch": null,
    "fix_pr": null
  }
}
```

> [!NOTE]
> **JSON 欄位說明**：
> - `status`: 當前狀態（analyzed → in_progress → fixed → review → completed）
> - `analyzed_at`: 分析完成時間
> - `fix_started_at`: 開始修復時間（vul-fix 設定）
> - `fixed_at`: 修復完成時間（vul-fix 設定）
> - `pr_created_at`: PR 建立時間（vul-pr 設定）
> - `completed_at`: PR merge 時間（vul-cleanup 設定）
> - `fix_branch`: 修復分支名稱
> - `fix_pr`: PR URL

### 7. 提交分析報告

#### 7.1 檢查變更內容

```bash
# 確認所有變更都是預期的
git status
```

預期的變更應該包含：
- `docs/security/${COMMIT_7}/analyses/` - 3 份分析報告
- `docs/security/scan-status.json` - 狀態追蹤更新
- `.gitignore` - 首次執行時會加入 `.security-scans/` 規則

**不應該**包含：
- `.security-scans/` - 已被 .gitignore 排除

#### 7.2 提交所有變更

```bash
# 加入所有變更（.gitignore 會自動排除 .security-scans/）
git add .
```

使用 **git-commit agent** 提交變更，提供以下 dispatch context：
- 目的：安全掃描分析報告
- 範圍：commit ${COMMIT_7} 的弱掃分析
- 主要變更：3 份分析報告（Checkmarx / Mend 依賴 / Mend Docker Image）+ scan-status.json 初始化

**Fallback**（如果 git-commit agent 不可用）：

```bash
git commit -m "$(cat <<EOF
docs: add security scan analysis for ${COMMIT_7}

分析報告：
- Checkmarx 程式碼掃描分析
- Mend 依賴套件掃描分析
- Mend Docker Image 掃描分析

Status: analyzed
Commit: ${COMMIT}
EOF
)"
```

#### 7.3 確認提交結果

```bash
# 查看最新 commit
git log --oneline -1

# 查看提交的檔案清單
git show --stat HEAD

# 確認工作目錄乾淨
git status

echo "✅ 分析報告已提交到分支 ${BRANCH_NAME}"
```

### 8. 輸出分析摘要

總結分析結果，包含：

#### 8.1 分析摘要

```
✅ 安全弱掃分析完成

📂 Worktree 位置: {worktree_path}
🌿 分支: security/fix-{commit_7}
📝 Commit: {commit_hash} ({commit_message})

📊 產出報告:
1. docs/security/{commit_7}/analyses/vul-cxo-{commit_7}.md
2. docs/security/{commit_7}/analyses/vul-mend-{commit_7}.md
3. docs/security/{commit_7}/analyses/vul-mend-img-{commit_7}.md

🔍 漏洞統計:
- Checkmarx 程式碼掃描:
  • 🔴 Critical: {count} | 🟠 High: {count} | 🟡 Medium: {count} | 🔵 Low: {count}

- Mend 依賴掃描:
  • 🔴 Critical: {count} | 🟠 High: {count} | 🟡 Medium: {count} | 🔵 Low: {count}
  • 傳遞依賴漏洞: {count} 個

- Mend Docker Image 掃描:
  • 🔴 Critical: {count} | 🟠 High: {count} | 🟡 Medium: {count} | 🔵 Low: {count}
  • 📦 過時套件: {count} 個

⚠️  注意: 分析報告在 worktree 中，將隨 PR merge 進入主分支
```

#### 8.2 修復優先順序（僅在有漏洞時顯示）

根據 CVSS 評分和影響範圍，列出建議的修復優先順序：

| 優先級 | 漏洞 | CVSS | 來源 |
|--------|------|------|------|
| P0 | {CVE/漏洞名稱} | {CVSS} | {掃描類型} |
| ... | ... | ... | ... |

#### 8.3 下一步行動

```
📌 你目前在 worktree 目錄中，可直接進行後續流程

後續步驟：
1. Review 分析報告，了解漏洞詳情
2. 執行決策審查：/vul-decision（**建議先執行**）
   - AI 協作審查漏洞
   - 決定哪些要修復、哪些暫不處理
   - 產出決策報告
3. 執行修復：/vul-fix（根據決策報告進行修復）
4. 測試驗證：確保所有測試通過
5. 提交 PR：/vul-pr（建立 PR 並選擇是否清理）

⚠️  注意事項：
- 所有修復都在此 worktree 中進行
- 建議先執行 /vul-decision 審查漏洞，避免修復不必要的項目
- 修復過程中請注意相容性問題
- 建議在測試環境先行驗證
- 部分 Major 版本升級可能需要調整程式碼

🧹 清理指令（PR merge 後執行）：
   cd {main_project_path}
   git worktree remove {worktree_path}
   git branch -d security/fix-{commit_7}

或執行 /vul-cleanup 進行管理
```

## Resources

### 腳本與模板

**GCS 掃描報告腳本**：
- **scripts/check-scan.sh** - 檢查 GCS 上是否有掃描報告
  - 用於步驟 1.4（建立 worktree 前的檢查）
  - Exit codes: 0=成功, 1=找不到報告, 2=gsutil 未安裝
- **scripts/download-scan.sh** - 從 GCS 下載掃描報告
  - 用於步驟 3（下載報告到本地）
  - 前提：check-scan.sh 已確認報告存在

> 腳本位於此 skill 的 `scripts/` 子目錄下。執行時先用 Glob 工具搜尋 `**/vul-analyze/scripts/*.sh` 取得完整路徑。

**報告模板**：
- **references/vul-cxo.md** - Checkmarx 報告模板
- **references/vul-mend.md** - Mend 依賴報告模板
- **references/vul-mend-img.md** - Mend Docker Image 報告模板

### 外部工具
- **gsutil** - Google Cloud Storage CLI
- **pdfplumber** - PDF 解析（`pip3 install pdfplumber`）
- **gradle/maven** - 依賴管理工具
