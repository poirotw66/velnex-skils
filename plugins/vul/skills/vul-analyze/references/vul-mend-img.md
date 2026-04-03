# Mend Docker Image 掃描分析報告

| 項目 | 值 |
|------|-----|
| 專案 | {{PROJECT}} |
| Commit | {{COMMIT}} |
| 掃描日期 | {{SCAN_DATE}} |
| 分析日期 | {{ANALYSIS_DATE}} |

---

## 📊 掃描結果摘要

| 項目 | 值 |
|------|-----|
| 🐳 Docker Image | {{DOCKER_IMAGE}} |
| Base Image | {{BASE_IMAGE}} |
| 有漏洞的元件數 | {{VULNERABLE_COMPONENTS_COUNT}} |
| 總開源套件數 | {{TOTAL_COMPONENTS}} |
| 過時套件數 | {{OUTDATED_PACKAGES_COUNT}} |
| 🔴 Critical | {{CRITICAL_COUNT}} |
| 🟠 High | {{HIGH_COUNT}} |
| 🟡 Medium | {{MEDIUM_COUNT}} |
| 🔵 Low | {{LOW_COUNT}} |

{{#NO_VULNERABILITIES}}
✅ **掃描結果：無發現漏洞**
{{#HAS_OUTDATED_PACKAGES}}
- 📦 過時套件: {{OUTDATED_PACKAGES_COUNT}} 個（佔總數 {{OUTDATED_PERCENTAGE}}%）
{{/HAS_OUTDATED_PACKAGES}}
{{/NO_VULNERABILITIES}}

{{#HAS_VULNERABILITIES}}
---

## 🔒 漏洞清單

### 🔴 Critical 漏洞 ({{CRITICAL_COUNT}})

{{#CRITICAL_COMPONENTS}}
#### {{INDEX}}. {{COMPONENT_NAME}}

| 項目 | 值 |
|------|-----|
| CVE 編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (Critical) |
| 當前版本 | {{CURRENT_VERSION}} |
| 修復版本 | {{FIXED_VERSION}} |
| Docker Layer | {{LAYER}} |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**修復方式**

{{FIX_METHOD}}

**參考資料**

{{#REFERENCE_URLS}}
- {{URL}}
{{/REFERENCE_URLS}}

---
{{/CRITICAL_COMPONENTS}}

{{#NO_CRITICAL}}
(無)
{{/NO_CRITICAL}}

### 🟠 High 漏洞 ({{HIGH_COUNT}})

{{#HIGH_COMPONENTS}}
#### {{INDEX}}. {{COMPONENT_NAME}}

| 項目 | 值 |
|------|-----|
| CVE 編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (High) |
| 當前版本 | {{CURRENT_VERSION}} |
| 修復版本 | {{FIXED_VERSION}} |
| Docker Layer | {{LAYER}} |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**修復方式**

{{FIX_METHOD}}

**參考資料**

{{#REFERENCE_URLS}}
- {{URL}}
{{/REFERENCE_URLS}}

---
{{/HIGH_COMPONENTS}}

{{#NO_HIGH}}
(無)
{{/NO_HIGH}}

### 🟡 Medium 漏洞 ({{MEDIUM_COUNT}})

{{#MEDIUM_COMPONENTS}}
#### {{INDEX}}. {{COMPONENT_NAME}}

| 項目 | 值 |
|------|-----|
| CVE 編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (Medium) |
| 當前版本 | {{CURRENT_VERSION}} → 修復版本: {{FIXED_VERSION}} |
| Docker Layer | {{LAYER}} |

**漏洞說明**

{{DESCRIPTION}}

**修復方式**

{{FIX_METHOD}}

---
{{/MEDIUM_COMPONENTS}}

{{#NO_MEDIUM}}
(無)
{{/NO_MEDIUM}}

### 🔵 Low 漏洞 ({{LOW_COUNT}})

{{#LOW_COMPONENTS}}
#### {{INDEX}}. {{COMPONENT_NAME}}

| 項目 | 值 |
|------|-----|
| CVE 編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (Low) |
| 當前版本 | {{CURRENT_VERSION}} → 修復版本: {{FIXED_VERSION}} |

**漏洞說明**

{{DESCRIPTION}}

**修復建議**

{{FIX_RECOMMENDATION}}

---
{{/LOW_COMPONENTS}}

{{#NO_LOW}}
(無)
{{/NO_LOW}}

---

## 🔧 修復步驟

### 📋 專案資訊

| 項目 | 值 |
|------|-----|
| 專案路徑 | {{PROJECT_PATH}} |
| Dockerfile 位置 | {{DOCKERFILE_PATH}} |
| 當前 Base Image | {{CURRENT_BASE_IMAGE}} |
| 建議 Base Image | {{RECOMMENDED_BASE_IMAGE}} |
| 是否使用多階段建置 | {{IS_MULTI_STAGE}} |

### ⚡ 修復優先順序

| 優先級 | 元件名稱 | CVE 編號 | CVSS | 嚴重度 | 修復方式 |
|--------|---------|---------|------|--------|----------|
{{#PRIORITY_LIST}}
| {{PRIORITY}} | {{COMPONENT_NAME}} | {{CVE_ID}} | {{CVSS_SCORE}} | {{SEVERITY}} | {{FIX_METHOD}} |
{{/PRIORITY_LIST}}

### Dockerfile 當前狀態分析

**檢查當前 Dockerfile**

```bash
cd {{PROJECT_PATH}}
cat {{DOCKERFILE_PATH}}
```

**檢查當前使用的 Base Image**

```bash
grep "^FROM" {{DOCKERFILE_PATH}}
```

### 具體修復步驟

{{#FIX_BY_UPGRADE_BASE}}
#### 方法 1：升級 Base Image（推薦）

大部分漏洞來自 base image 的系統套件，升級 base image 是最有效的修復方式。

**步驟**：

1. 檢查最新的 base image 版本

```bash
# 檢查 {{BASE_IMAGE_NAME}} 的最新版本
docker search {{BASE_IMAGE_NAME}}
# 或查看 Docker Hub
```

2. 更新 Dockerfile

編輯 `{{DOCKERFILE_PATH}}`：

```dockerfile
# 原本：FROM {{CURRENT_BASE_IMAGE}}
# 更新為最新版本：
FROM {{RECOMMENDED_BASE_IMAGE}}

{{REMAINING_DOCKERFILE_CONTENT}}
```

3. 驗證更新

```bash
# 重建 image（不使用快取）
docker build --no-cache -t {{PROJECT}}:{{COMMIT}}-fixed -f {{DOCKERFILE_PATH}} .

# 檢查 image 大小
docker images {{PROJECT}}:{{COMMIT}}-fixed

# 測試 image 是否正常運行
docker run --rm -p 8080:8080 {{PROJECT}}:{{COMMIT}}-fixed

# 驗證應用程式健康狀態
curl http://localhost:8080/actuator/health
```
{{/FIX_BY_UPGRADE_BASE}}

{{#FIX_BY_PACKAGE_UPDATE}}
#### 方法 2：在 Dockerfile 中升級特定套件

如果無法升級 base image，可以在 Dockerfile 中主動更新有漏洞的系統套件。

**步驟**：

在 `{{DOCKERFILE_PATH}}` 的 final stage 加入套件更新：

{{#IS_ALPINE}}
```dockerfile
FROM {{CURRENT_BASE_IMAGE}}

# 更新系統套件以修復已知漏洞
RUN apk update && \
    apk upgrade && \
    apk add --no-cache {{#VULN_PACKAGES}}{{PACKAGE_NAME}} {{/VULN_PACKAGES}}&& \
    apk cache clean

# ... (後續步驟) ...
```
{{/IS_ALPINE}}

{{#IS_DEBIAN}}
```dockerfile
FROM {{CURRENT_BASE_IMAGE}}

# 更新系統套件以修復已知漏洞
RUN apt-get update && \
    apt-get install -y --only-upgrade {{#VULN_PACKAGES}}{{PACKAGE_NAME}} {{/VULN_PACKAGES}}&& \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ... (後續步驟) ...
```
{{/IS_DEBIAN}}

{{#IS_UBUNTU}}
```dockerfile
FROM {{CURRENT_BASE_IMAGE}}

# 更新系統套件以修復已知漏洞
RUN apt-get update && \
    apt-get install -y --only-upgrade {{#VULN_PACKAGES}}{{PACKAGE_NAME}} {{/VULN_PACKAGES}}&& \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ... (後續步驟) ...
```
{{/IS_UBUNTU}}

**注意**：此方法會增加 image 大小和構建時間。
{{/FIX_BY_PACKAGE_UPDATE}}

{{#RECOMMEND_DISTROLESS}}
#### 方法 3：遷移至 Distroless Image

Distroless image 只包含應用程式及其執行時依賴，大幅減少攻擊面。

**優點**：
- 大幅減少系統套件數量
- 減少潛在漏洞
- 更小的 image 大小
- 無 shell，提高安全性

**步驟**：

編輯 `{{DOCKERFILE_PATH}}`：

```dockerfile
{{#HAS_OTEL_STAGE}}
FROM {{OTEL_IMAGE}} AS otel
{{/HAS_OTEL_STAGE}}

FROM eclipse-temurin:17-jdk AS builder
WORKDIR /build
# ... (構建步驟) ...

# 使用 Distroless
FROM gcr.io/distroless/java17-debian12

WORKDIR /app

COPY --from=builder /build/build/libs/*.jar /app/app.jar
{{#HAS_OTEL_STAGE}}
COPY --from=otel /opt/opentelemetry-javaagent.jar /opt/opentelemetry-javaagent.jar
{{/HAS_OTEL_STAGE}}

USER nonroot

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

**驗證**：

```bash
docker build -t {{PROJECT}}:distroless .
docker run --rm -p 8080:8080 {{PROJECT}}:distroless
curl http://localhost:8080/actuator/health
```

**注意事項**：
- Distroless image 沒有 shell，無法使用 `docker exec` 進入容器除錯
- 需確保應用程式不依賴系統工具
{{/RECOMMEND_DISTROLESS}}

{{#RECOMMEND_ALPINE}}
#### 方法 4：使用 Alpine Base Image

Alpine Linux 是一個極簡的 Linux 發行版，套件數量少，更新快速。

**步驟**：

```dockerfile
{{#HAS_OTEL_STAGE}}
FROM {{OTEL_IMAGE}} AS otel
{{/HAS_OTEL_STAGE}}

FROM eclipse-temurin:17-jdk AS builder
# ... (構建步驟) ...

# 使用 Alpine 版本的 JRE
FROM eclipse-temurin:17-jre-alpine

RUN apk update && apk upgrade && apk add --no-cache ca-certificates

WORKDIR /app

{{#HAS_OTEL_STAGE}}
COPY --from=otel /opt/opentelemetry-javaagent.jar /opt/opentelemetry-javaagent.jar
{{/HAS_OTEL_STAGE}}
COPY --from=builder /build/build/libs/*.jar /app/app.jar

RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```
{{/RECOMMEND_ALPINE}}

### 驗證修復

修復完成後，執行以下驗證步驟：

```bash
cd {{PROJECT_PATH}}

# 1. 重新建置 image（不使用快取）
docker build --no-cache -t {{PROJECT}}:{{COMMIT}}-fixed -f {{DOCKERFILE_PATH}} .

# 2. 檢查 image 大小變化
docker images {{PROJECT}} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# 3. 執行容器測試
docker run --rm -d --name {{PROJECT}}-test -p 8080:8080 {{PROJECT}}:{{COMMIT}}-fixed

# 4. 等待應用程式啟動
sleep 30

# 5. 驗證應用程式健康狀態
curl http://localhost:8080/actuator/health

# 6. 檢查容器日誌
docker logs {{PROJECT}}-test

# 7. 停止測試容器
docker stop {{PROJECT}}-test
```

### 相容性注意事項

{{#COMPATIBILITY_WARNINGS}}
**{{COMPONENT_NAME}} 升級注意事項**

{{WARNING_DESCRIPTION}}

**測試重點**：
{{#TEST_AREAS}}
- {{AREA}}
{{/TEST_AREAS}}
{{/COMPATIBILITY_WARNINGS}}

{{/HAS_VULNERABILITIES}}

{{#HAS_OUTDATED_PACKAGES}}
---

## 其他發現

### 過時套件統計

| 類別 | 數量 | 百分比 |
|------|------|--------|
{{#OUTDATED_STATS}}
| {{CATEGORY}} | {{COUNT}} | {{PERCENTAGE}}% |
{{/OUTDATED_STATS}}
| **總計** | **{{OUTDATED_PACKAGES_COUNT}}** | **{{OUTDATED_PERCENTAGE}}%** |

**關鍵系統套件**：

{{#KEY_OUTDATED_PACKAGES}}
- **{{PACKAGE_NAME}}**: {{CURRENT_VERSION}} → {{LATEST_VERSION}} (落後 {{VERSIONS_BEHIND}} 個版本)
{{/KEY_OUTDATED_PACKAGES}}
{{/HAS_OUTDATED_PACKAGES}}

---

## 📜 授權合規資訊（可選）

> [!NOTE]
> **關於授權資訊**：
> - 本部分為可選內容，主要用於授權合規檢查
> - Docker Image 中的授權問題通常來自 base image 或系統套件
> - 授權問題通常需要與法務團隊確認
> - 如時間有限或無授權風險，可略過本章節

{{#HAS_LICENSE_ISSUES}}
### 高風險授權套件

以下 Docker Image 中的套件存在授權合規風險：

| 套件 | 版本 | 授權類型 | 風險等級 | 來源 |
|------|------|---------|---------|------|
{{#LICENSE_RISK_PACKAGES}}
| {{PACKAGE_NAME}} | {{VERSION}} | {{LICENSE_TYPE}} | {{RISK_LEVEL}} | {{SOURCE}} |
{{/LICENSE_RISK_PACKAGES}}

### 授權風險說明

{{#LICENSE_RISK_DETAILS}}
#### {{LICENSE_TYPE}}

- **風險**：{{RISK}}
- **影響**：{{IMPACT}}
- **建議**：{{RECOMMENDATION}}

{{/LICENSE_RISK_DETAILS}}

### 處理建議

1. **評估 Base Image**：考慮使用官方或經過授權審查的 base image
2. **諮詢法務團隊**：授權合規問題需要法務專業判斷
3. **記錄使用情況**：保留授權文件和 image 構建記錄
4. **考慮替代方案**：如有高風險授權套件，評估是否可移除或替換

{{/HAS_LICENSE_ISSUES}}

{{^HAS_LICENSE_ISSUES}}
✅ **授權合規檢查：未發現高風險授權問題**
{{/HAS_LICENSE_ISSUES}}

---

## 參考資源

- [Docker Official Images](https://hub.docker.com/search?q=&type=image&image_filter=official)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
{{#IS_JAVA_PROJECT}}
- [Eclipse Temurin Images](https://hub.docker.com/_/eclipse-temurin)
- [Google Distroless Java](https://github.com/GoogleContainerTools/distroless)
{{/IS_JAVA_PROJECT}}
{{#IS_NODE_PROJECT}}
- [Node.js Official Images](https://hub.docker.com/_/node)
{{/IS_NODE_PROJECT}}
- [Trivy - Container Scanner](https://github.com/aquasecurity/trivy)
- [Distroless GitHub](https://github.com/GoogleContainerTools/distroless)
