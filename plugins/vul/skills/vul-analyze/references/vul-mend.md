# Mend 依賴套件掃描分析報告

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
| 有漏洞的套件數 | {{VULNERABLE_PACKAGES_COUNT}} |
| 總依賴套件數 | {{TOTAL_PACKAGES}} (直接: {{DIRECT_DEPENDENCIES}}, 傳遞: {{TRANSITIVE_DEPENDENCIES}}) |
| 🔴 Critical | {{CRITICAL_COUNT}} |
| 🟠 High | {{HIGH_COUNT}} |
| 🟡 Medium | {{MEDIUM_COUNT}} |
| 🔵 Low | {{LOW_COUNT}} |

{{#NO_VULNERABILITIES}}
✅ **掃描結果：無發現漏洞**
{{/NO_VULNERABILITIES}}

{{#HAS_VULNERABILITIES}}
---

## 📦 漏洞清單

### 🔴 Critical 漏洞 ({{CRITICAL_COUNT}})

{{#CRITICAL_PACKAGES}}
#### {{INDEX}}. {{PACKAGE_NAME}}

| 項目 | 值 |
|------|-----|
| 漏洞編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (Critical) |
| 發現日期 | {{DISCOVERY_DATE}} |
| 套件版本 | {{CURRENT_VERSION}} |
| 修復版本 | {{FIXED_VERSION}} |
| 最新穩定版 | {{LATEST_STABLE_VERSION}} |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**依賴路徑確認**

```bash
{{DEPENDENCY_CHECK_COMMAND}}
```

{{#DEPENDENCY_PATH}}
依賴路徑：
```
{{PATH}}
```
{{/DEPENDENCY_PATH}}

**修復建議版本**

{{#FIX_VERSIONS}}
- `{{VERSION}}` {{#IS_RECOMMENDED}}(推薦){{/IS_RECOMMENDED}}
{{/FIX_VERSIONS}}

**修復步驟**

{{FIX_INSTRUCTIONS}}

**參考資料**

{{#REFERENCE_URLS}}
- {{URL}}
{{/REFERENCE_URLS}}

---
{{/CRITICAL_PACKAGES}}

{{#NO_CRITICAL}}
(無)
{{/NO_CRITICAL}}

### 🟠 High 漏洞 ({{HIGH_COUNT}})

{{#HIGH_PACKAGES}}
#### {{INDEX}}. {{PACKAGE_NAME}}

| 項目 | 值 |
|------|-----|
| 漏洞編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (High) |
| 發現日期 | {{DISCOVERY_DATE}} |
| 套件版本 | {{CURRENT_VERSION}} |
| 修復版本 | {{FIXED_VERSION}} |
| 最新穩定版 | {{LATEST_STABLE_VERSION}} |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**依賴路徑確認**

```bash
{{DEPENDENCY_CHECK_COMMAND}}
```

{{#DEPENDENCY_PATH}}
依賴路徑：
```
{{PATH}}
```
{{/DEPENDENCY_PATH}}

**修復建議版本**

{{#FIX_VERSIONS}}
- `{{VERSION}}` {{#IS_RECOMMENDED}}(推薦){{/IS_RECOMMENDED}}
{{/FIX_VERSIONS}}

**修復步驟**

{{FIX_INSTRUCTIONS}}

**參考資料**

{{#REFERENCE_URLS}}
- {{URL}}
{{/REFERENCE_URLS}}

---
{{/HIGH_PACKAGES}}

{{#NO_HIGH}}
(無)
{{/NO_HIGH}}

### 🟡 Medium 漏洞 ({{MEDIUM_COUNT}})

{{#MEDIUM_PACKAGES}}
#### {{INDEX}}. {{PACKAGE_NAME}}

| 項目 | 值 |
|------|-----|
| 漏洞編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (Medium) |
| 套件版本 | {{CURRENT_VERSION}} → 修復版本: {{FIXED_VERSION}} |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**修復步驟**

{{FIX_INSTRUCTIONS}}

---
{{/MEDIUM_PACKAGES}}

{{#NO_MEDIUM}}
(無)
{{/NO_MEDIUM}}

### 🔵 Low 漏洞 ({{LOW_COUNT}})

{{#LOW_PACKAGES}}
#### {{INDEX}}. {{PACKAGE_NAME}}

| 項目 | 值 |
|------|-----|
| 漏洞編號 | {{CVE_ID}} |
| CVSS 評分 | {{CVSS_SCORE}} (Low) |
| 套件版本 | {{CURRENT_VERSION}} → 修復版本: {{FIXED_VERSION}} |

**漏洞說明**

{{DESCRIPTION}}

**修復建議**

{{FIX_RECOMMENDATION}}

---
{{/LOW_PACKAGES}}

{{#NO_LOW}}
(無)
{{/NO_LOW}}

---

## 🔧 修復步驟

### 📋 專案資訊

| 項目 | 值 |
|------|-----|
| 專案路徑 | {{PROJECT_PATH}} |
| 建置工具 | {{BUILD_TOOL}} |
| 依賴管理檔 | {{DEPENDENCY_FILE}} |
| 框架版本 | {{FRAMEWORK}} {{FRAMEWORK_VERSION}} |

### ⚡ 修復優先順序

| 優先級 | 套件名稱 | CVE 編號 | CVSS | 嚴重度 |
|--------|---------|---------|------|--------|
{{#PRIORITY_LIST}}
| {{PRIORITY}} | {{PACKAGE_NAME}} | {{CVE_ID}} | {{CVSS_SCORE}} | {{SEVERITY}} |
{{/PRIORITY_LIST}}

### 依賴來源分析

**執行以下指令確認漏洞套件的引入方式**

```bash
cd {{PROJECT_PATH}}
{{DEPENDENCY_TREE_COMMAND}}
```

### 具體修復步驟

{{#IS_GRADLE}}
#### 步驟 1：檢查當前依賴樹並定位問題套件

```bash
cd {{PROJECT_PATH}}
./gradlew dependencies --configuration runtimeClasspath > dependencies.txt
{{#VULN_PACKAGES}}
grep "{{PACKAGE_NAME}}" dependencies.txt
{{/VULN_PACKAGES}}
```

#### 步驟 2：確認套件引入方式

根據上述輸出，確認每個漏洞套件是：
- **直接依賴**：在 `build.gradle` 中直接宣告
- **傳遞依賴**：由其他套件間接引入

#### 步驟 3：套用修復

**方式 A：升級直接依賴（適用於直接依賴的套件）**

編輯 `{{DEPENDENCY_FILE}}`：

```kotlin
dependencies {
{{#DIRECT_DEPENDENCY_UPDATES}}
    // 原本：{{ORIGINAL_DECLARATION}}
    {{DEPENDENCY_CONFIG}}("{{GROUP_ID}}:{{ARTIFACT_ID}}:{{FIXED_VERSION}}") // 修復 {{CVE_ID}}
{{/DIRECT_DEPENDENCY_UPDATES}}
}
```

**方式 B：強制指定版本（適用於傳遞依賴）**

在 `{{DEPENDENCY_FILE}}` 中加入：

```kotlin
dependencies {
    // ... 現有的依賴 ...

    // 強制使用安全版本的套件（修復傳遞依賴漏洞）
    constraints {
{{#TRANSITIVE_DEPENDENCY_CONSTRAINTS}}
        implementation('{{GROUP_ID}}:{{ARTIFACT_ID}}:{{FIXED_VERSION}}') {
            because '{{CVE_ID}}: {{FIX_REASON}}'
        }
{{/TRANSITIVE_DEPENDENCY_CONSTRAINTS}}
    }
}
```

**方式 C：排除有問題的傳遞依賴並重新引入安全版本**

如果上述方法無效，在 `{{DEPENDENCY_FILE}}` 中：

```kotlin
dependencies {
{{#EXCLUDE_AND_REINTRODUCE}}
    // 排除有漏洞的傳遞依賴
    implementation('{{PARENT_DEPENDENCY}}') {
        exclude group: '{{GROUP_ID}}', module: '{{ARTIFACT_ID}}'
    }
    // 重新引入安全版本
    implementation '{{GROUP_ID}}:{{ARTIFACT_ID}}:{{FIXED_VERSION}}'
{{/EXCLUDE_AND_REINTRODUCE}}
}
```

#### 步驟 4：驗證修復

```bash
# 清除並重新構建
./gradlew clean build

# 檢查依賴樹確認版本已更新
./gradlew dependencies --configuration runtimeClasspath | grep -E "{{VULN_PACKAGE_GREP_PATTERN}}"

# 執行測試確保功能正常
./gradlew test

# 確認應用程式可正常啟動
./gradlew bootRun
```
{{/IS_GRADLE}}

{{#IS_MAVEN}}
#### 步驟 1：檢查當前依賴樹

```bash
cd {{PROJECT_PATH}}
mvn dependency:tree > dependencies.txt
{{#VULN_PACKAGES}}
grep "{{PACKAGE_NAME}}" dependencies.txt
{{/VULN_PACKAGES}}
```

#### 步驟 2：套用修復

在 `pom.xml` 中更新版本：

**直接依賴修復**

```xml
<dependencies>
{{#DIRECT_DEPENDENCY_UPDATES}}
    <dependency>
        <groupId>{{GROUP_ID}}</groupId>
        <artifactId>{{ARTIFACT_ID}}</artifactId>
        <version>{{FIXED_VERSION}}</version> <!-- 修復 {{CVE_ID}} -->
    </dependency>
{{/DIRECT_DEPENDENCY_UPDATES}}
</dependencies>
```

**傳遞依賴修復**

```xml
<dependencyManagement>
    <dependencies>
{{#TRANSITIVE_DEPENDENCY_MANAGEMENT}}
        <dependency>
            <groupId>{{GROUP_ID}}</groupId>
            <artifactId>{{ARTIFACT_ID}}</artifactId>
            <version>{{FIXED_VERSION}}</version> <!-- 修復 {{CVE_ID}} -->
        </dependency>
{{/TRANSITIVE_DEPENDENCY_MANAGEMENT}}
    </dependencies>
</dependencyManagement>
```

#### 步驟 3：驗證修復

```bash
# 重新整理依賴
mvn clean install

# 確認版本已更新
mvn dependency:tree | grep -E "{{VULN_PACKAGE_GREP_PATTERN}}"

# 執行測試
mvn test
```
{{/IS_MAVEN}}

{{#IS_NPM}}
#### 步驟 1：檢查當前依賴

```bash
cd {{PROJECT_PATH}}
npm ls {{VULN_PACKAGE_NAMES}}
```

#### 步驟 2：套用修復

```bash
{{#NPM_UPGRADE_COMMANDS}}
# 修復 {{CVE_ID}}
npm install {{PACKAGE_NAME}}@{{FIXED_VERSION}}
{{/NPM_UPGRADE_COMMANDS}}
```

{{#HAS_TRANSITIVE_DEPENDENCIES}}
#### 步驟 3：處理間接依賴

在 `package.json` 中添加 overrides：

```json
{
  "overrides": {
{{#NPM_OVERRIDES}}
    "{{PACKAGE_NAME}}": "{{FIXED_VERSION}}"
{{/NPM_OVERRIDES}}
  }
}
```
{{/HAS_TRANSITIVE_DEPENDENCIES}}

#### 步驟 4：驗證修復

```bash
# 重新安裝依賴
npm install

# 執行測試
npm test
```
{{/IS_NPM}}

### 相容性注意事項

{{#COMPATIBILITY_NOTES}}
#### {{PACKAGE_NAME}}

{{COMPATIBILITY_WARNING}}

**測試重點**：
{{#TEST_FOCUS_AREAS}}
- {{AREA}}
{{/TEST_FOCUS_AREAS}}
{{/COMPATIBILITY_NOTES}}

{{/HAS_VULNERABILITIES}}

{{#HAS_OUTDATED_PACKAGES}}
---

## 其他發現

### 過時套件（非漏洞）

以下套件雖無已知漏洞，但版本較舊：

| 套件 | 當前版本 | 最新版本 | 落後版本數 |
|------|---------|---------|-----------|
{{#OUTDATED_PACKAGES}}
| {{PACKAGE_NAME}} | {{CURRENT_VERSION}} | {{LATEST_VERSION}} | {{VERSIONS_BEHIND}} |
{{/OUTDATED_PACKAGES}}
{{/HAS_OUTDATED_PACKAGES}}

---

## 📜 授權合規資訊（可選）

> [!NOTE]
> **關於授權資訊**：
> - 本部分為可選內容，主要用於授權合規檢查
> - 授權問題通常需要與法務團隊確認
> - 如時間有限或無授權風險，可略過本章節

{{#HAS_LICENSE_ISSUES}}
### 高風險授權套件

以下套件存在授權合規風險：

| 套件 | 版本 | 授權類型 | 風險等級 | 說明 |
|------|------|---------|---------|------|
{{#LICENSE_RISK_PACKAGES}}
| {{PACKAGE_NAME}} | {{VERSION}} | {{LICENSE_TYPE}} | {{RISK_LEVEL}} | {{RISK_DESCRIPTION}} |
{{/LICENSE_RISK_PACKAGES}}

### 授權風險說明

{{#LICENSE_RISK_DETAILS}}
#### {{LICENSE_TYPE}}

- **風險**：{{RISK}}
- **影響**：{{IMPACT}}
- **建議**：{{RECOMMENDATION}}

{{/LICENSE_RISK_DETAILS}}

### 處理建議

1. **諮詢法務團隊**：授權合規問題需要法務專業判斷
2. **評估替代方案**：如有高風險授權套件，考慮尋找替代套件
3. **記錄使用情況**：保留授權文件和使用記錄
4. **定期審查**：建立定期授權合規審查機制

{{/HAS_LICENSE_ISSUES}}

{{^HAS_LICENSE_ISSUES}}
✅ **授權合規檢查：未發現高風險授權問題**
{{/HAS_LICENSE_ISSUES}}

---

## 參考資源

- [CVE 資料庫](https://cve.mitre.org/)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)
- [Mend (WhiteSource) 文件](https://docs.mend.io/)
{{#IS_GRADLE}}
- [Gradle Dependency Management](https://docs.gradle.org/current/userguide/dependency_management.html)
- [Gradle Dependency Constraints](https://docs.gradle.org/current/userguide/dependency_constraints.html)
{{/IS_GRADLE}}
{{#IS_MAVEN}}
- [Maven Dependency Management](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
{{/IS_MAVEN}}
{{#IS_NPM}}
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [package.json overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides)
{{/IS_NPM}}
