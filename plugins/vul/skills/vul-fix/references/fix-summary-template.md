# 安全漏洞修復摘要報告

| 項目 | 值 |
|------|-----|
| 專案 | {{PROJECT}} |
| Commit | {{COMMIT_7}} |
| 修復日期 | {{FIX_DATE}} |
| 執行者 | {{USER}} + AI 協作 |
| 修復分支 | security/fix-{{COMMIT_7}} |

## 📊 修復統計

| 類別 | 成功 | 失敗 | 跳過 | 總計 |
|------|------|------|------|------|
| Checkmarx | {{CXO_SUCCESS}} | {{CXO_FAILED}} | {{CXO_SKIPPED}} | {{CXO_TOTAL}} |
| Mend 依賴 | {{MEND_SUCCESS}} | {{MEND_FAILED}} | {{MEND_SKIPPED}} | {{MEND_TOTAL}} |
| Mend Image | {{IMG_SUCCESS}} | {{IMG_FAILED}} | {{IMG_SKIPPED}} | {{IMG_TOTAL}} |
| **總計** | **{{TOTAL_SUCCESS}}** | **{{TOTAL_FAILED}}** | **{{TOTAL_SKIPPED}}** | **{{GRAND_TOTAL}}** |

## 📋 修復摘要

| 結果 | 數量 | 說明 |
|------|------|------|
| ✅ 成功 | {{SUCCESS_COUNT}} | {{SUCCESS_DESCRIPTION}} |
| ❌ 失敗 | {{FAILED_COUNT}} | {{FAILED_DESCRIPTION}} |
| ⏭️ 跳過 | {{SKIPPED_COUNT}} | {{SKIPPED_DESCRIPTION}} |

---

## ✅ 成功修復（{{SUCCESS_COUNT}} 項）

{{#SUCCESS_BY_SOURCE}}

### {{SOURCE_NAME}} ({{COUNT}} 項)

{{#ITEMS}}
#### {{INDEX}}. {{TITLE}}

| 項目 | 值 |
|------|-----|
| CVE/CWE | {{CVE_CWE}} |
| 嚴重度 | {{SEVERITY}} |
| Commit | {{COMMIT_HASH}} |

**修復方式**

{{FIX_METHOD}}

**驗證結果**

{{VERIFICATION_RESULT}}

---

{{/ITEMS}}
{{/SUCCESS_BY_SOURCE}}

## ❌ 修復失敗（{{FAILED_COUNT}} 項）

{{#HAS_FAILURES}}

{{#FAILURES}}
#### {{INDEX}}. {{TITLE}}

| 項目 | 值 |
|------|-----|
| 來源 | {{SOURCE}} |
| CVE/CWE | {{CVE_CWE}} |
| 嚴重度 | {{SEVERITY}} |

**失敗原因**

{{FAILURE_REASON}}

**嘗試的修復方式**

{{ATTEMPTED_FIX}}

**建議的替代方案**

{{ALTERNATIVE_SUGGESTION}}

**後續處理**

{{NEXT_STEPS}}

---

{{/FAILURES}}
{{/HAS_FAILURES}}

{{^HAS_FAILURES}}
無修復失敗項目
{{/HAS_FAILURES}}

## ⏭️ 跳過項目（{{SKIPPED_COUNT}} 項）

{{#HAS_SKIPPED}}

{{#SKIPPED_BY_SEVERITY}}

### {{SEVERITY}} ({{COUNT}} 項)

{{#ITEMS}}
#### {{INDEX}}. {{TITLE}}

| 項目 | 值 |
|------|-----|
| 來源 | {{SOURCE}} |
| CVE/CWE | {{CVE_CWE}} |

**決策理由**（來自決策報告）

{{DECISION_REASON}}

---

{{/ITEMS}}
{{/SKIPPED_BY_SEVERITY}}

{{/HAS_SKIPPED}}

{{^HAS_SKIPPED}}
所有項目均已處理（修復或失敗）
{{/HAS_SKIPPED}}

## 🧪 測試結果

### 測試執行

{{TEST_EXECUTION_SUMMARY}}

### 測試通過情況

| 測試類型 | 狀態 | 說明 |
|---------|------|------|
| 單元測試 | {{UNIT_TEST_STATUS}} | {{UNIT_TEST_NOTE}} |
| 整合測試 | {{INTEGRATION_TEST_STATUS}} | {{INTEGRATION_TEST_NOTE}} |
| 建置驗證 | {{BUILD_STATUS}} | {{BUILD_NOTE}} |

### 需要額外驗證

{{#HAS_MANUAL_VERIFICATION}}
{{MANUAL_VERIFICATION_LIST}}
{{/HAS_MANUAL_VERIFICATION}}

{{^HAS_MANUAL_VERIFICATION}}
所有測試自動化完成，無需額外手動驗證
{{/HAS_MANUAL_VERIFICATION}}

## 📝 修復明細

### Commit 列表

{{#COMMITS}}
- `{{COMMIT_HASH}}` - {{COMMIT_MESSAGE}}
{{/COMMITS}}

### 變更檔案

{{#CHANGED_FILES}}
- `{{FILE_PATH}}` - {{CHANGE_DESCRIPTION}}
{{/CHANGED_FILES}}

## 💡 後續建議

### 失敗項目處理

{{#HAS_FAILURES}}
{{FAILURE_RECOMMENDATIONS}}
{{/HAS_FAILURES}}

{{^HAS_FAILURES}}
無失敗項目
{{/HAS_FAILURES}}

### 需要人工確認

{{#HAS_MANUAL_CHECKS}}
{{MANUAL_CHECK_LIST}}
{{/HAS_MANUAL_CHECKS}}

{{^HAS_MANUAL_CHECKS}}
無需額外人工確認
{{/HAS_MANUAL_CHECKS}}

### 後續追蹤

{{FOLLOW_UP_ACTIONS}}

---

## 📌 下一步

{{#ALL_SUCCESS}}
- ✅ 所有漏洞已成功修復
- 📋 執行 `/vul-pr` 建立 Pull Request
- 🔍 建議在 PR 審核時進行功能驗證
{{/ALL_SUCCESS}}

{{#HAS_FAILURES}}
- ⚠️  存在修復失敗項目，建議：
  1. 審查失敗原因和替代方案
  2. 決定是否另開 issue 追蹤
  3. 對已成功修復項目執行 `/vul-pr` 建立 PR
{{/HAS_FAILURES}}

{{#ONLY_SKIPPED}}
- ℹ️  所有項目均已跳過（依據決策報告）
- 📋 決策報告: decision-{{COMMIT_7}}.md
- 🏁 修復流程結束
{{/ONLY_SKIPPED}}

---

**生成時間**: {{GENERATED_AT}}
**生成工具**: Claude Code - vul-fix
