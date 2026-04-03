# Checkmarx 程式碼掃描分析報告

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
| 漏洞總數 | {{TOTAL_COUNT}} |
| 🔴 Critical | {{CRITICAL_COUNT}} |
| 🟠 High | {{HIGH_COUNT}} |
| 🟡 Medium | {{MEDIUM_COUNT}} |
| 🔵 Low | {{LOW_COUNT}} |
| ℹ️ Info | {{INFO_COUNT}} |
| 掃描 ID | {{SCAN_ID}} |

{{#NO_VULNERABILITIES}}
✅ **掃描結果：無發現漏洞**
{{/NO_VULNERABILITIES}}

{{#HAS_VULNERABILITIES}}
---

## 🔒 漏洞清單

### 🔴 Critical 漏洞 ({{CRITICAL_COUNT}})

{{#CRITICAL_VULNS}}
#### {{INDEX}}. {{QUERY_NAME}}

| 項目 | 值 |
|------|-----|
| 檔案位置 | `{{FILE_PATH}}:{{LINE}}` |
| CWE 編號 | {{CWE_ID}} - {{CWE_NAME}} |
| 嚴重度 | Critical |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**程式碼片段**

```{{LANGUAGE}}
{{CODE_SNIPPET}}
```

**修復方式**

{{FIX_RECOMMENDATION}}

**修復範例**

```{{LANGUAGE}}
{{FIX_EXAMPLE}}
```

**參考資料**
- CWE: https://cwe.mitre.org/data/definitions/{{CWE_ID}}.html
{{#ADDITIONAL_REFERENCES}}
- {{REFERENCE}}
{{/ADDITIONAL_REFERENCES}}

---
{{/CRITICAL_VULNS}}

{{#NO_CRITICAL}}
(無)
{{/NO_CRITICAL}}

### 🟠 High 漏洞 ({{HIGH_COUNT}})

{{#HIGH_VULNS}}
#### {{INDEX}}. {{QUERY_NAME}}

| 項目 | 值 |
|------|-----|
| 檔案位置 | `{{FILE_PATH}}:{{LINE}}` |
| CWE 編號 | {{CWE_ID}} - {{CWE_NAME}} |
| 嚴重度 | High |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**程式碼片段**

```{{LANGUAGE}}
{{CODE_SNIPPET}}
```

**修復方式**

{{FIX_RECOMMENDATION}}

**修復範例**

```{{LANGUAGE}}
{{FIX_EXAMPLE}}
```

**參考資料**
- CWE: https://cwe.mitre.org/data/definitions/{{CWE_ID}}.html
{{#ADDITIONAL_REFERENCES}}
- {{REFERENCE}}
{{/ADDITIONAL_REFERENCES}}

---
{{/HIGH_VULNS}}

{{#NO_HIGH}}
(無)
{{/NO_HIGH}}

### 🟡 Medium 漏洞 ({{MEDIUM_COUNT}})

{{#MEDIUM_VULNS}}
#### {{INDEX}}. {{QUERY_NAME}}

| 項目 | 值 |
|------|-----|
| 檔案位置 | `{{FILE_PATH}}:{{LINE}}` |
| CWE 編號 | {{CWE_ID}} - {{CWE_NAME}} |
| 嚴重度 | Medium |

**漏洞說明**

{{DESCRIPTION}}

**影響範圍**

{{IMPACT}}

**修復方式**

{{FIX_RECOMMENDATION}}

**修復範例**

```{{LANGUAGE}}
{{FIX_EXAMPLE}}
```

---
{{/MEDIUM_VULNS}}

{{#NO_MEDIUM}}
(無)
{{/NO_MEDIUM}}

### 🔵 Low 漏洞 ({{LOW_COUNT}})

{{#LOW_VULNS}}
#### {{INDEX}}. {{QUERY_NAME}}

| 項目 | 值 |
|------|-----|
| 檔案位置 | `{{FILE_PATH}}:{{LINE}}` |
| CWE 編號 | {{CWE_ID}} - {{CWE_NAME}} |
| 嚴重度 | Low |

**漏洞說明**

{{DESCRIPTION}}

**修復方式**

{{FIX_RECOMMENDATION}}

---
{{/LOW_VULNS}}

{{#NO_LOW}}
(無)
{{/NO_LOW}}

### Info ({{INFO_COUNT}})

{{#INFO_VULNS}}
- **{{QUERY_NAME}}** - `{{FILE_PATH}}:{{LINE}}` - CWE: {{CWE_ID}}
{{/INFO_VULNS}}

{{#NO_INFO}}
(無)
{{/NO_INFO}}

---

## 🔧 修復步驟

### 📋 專案資訊

| 項目 | 值 |
|------|-----|
| 專案路徑 | {{PROJECT_PATH}} |
| 建置工具 | {{BUILD_TOOL}} |
| 框架 | {{FRAMEWORK}} {{FRAMEWORK_VERSION}} |
| 程式語言 | {{LANGUAGE}} |

### ⚡ 修復優先順序

| 優先級 | 漏洞類型 | 數量 | 嚴重度 |
|--------|---------|------|--------|
{{#PRIORITY_LIST}}
| {{PRIORITY}} | {{VULN_TYPE}} | {{COUNT}} | {{SEVERITY}} |
{{/PRIORITY_LIST}}

### 具體修復步驟

{{#DETAILED_FIX_STEPS}}
#### 步驟 {{INDEX}}: {{STEP_TITLE}}

**影響的漏洞**：{{AFFECTED_VULNS}}

**修復方式**

{{STEP_DESCRIPTION}}

**執行指令**

```bash
{{COMMANDS}}
```

**程式碼修改**

檔案：`{{FILE_PATH}}`

```{{LANGUAGE}}
{{CODE_CHANGES}}
```

**驗證方式**

{{VERIFICATION_STEPS}}

---
{{/DETAILED_FIX_STEPS}}

### 驗證步驟

```bash
# 執行單元測試
{{TEST_COMMAND}}

# 執行整合測試
{{INTEGRATION_TEST_COMMAND}}

# 重新執行 Checkmarx 掃描確認漏洞已修復
```
{{/HAS_VULNERABILITIES}}

---

## 參考資源

- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Checkmarx 知識庫](https://checkmarx.com/resource/documents/)
{{#IS_JAVA}}
- [OWASP Java Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html)
{{/IS_JAVA}}
{{#IS_SPRING}}
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/index.html)
{{/IS_SPRING}}
