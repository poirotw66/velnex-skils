# 安全漏洞處理決策報告

| 項目 | 值 |
|------|-----|
| 專案 | {{PROJECT}} |
| Commit | {{COMMIT_7}} |
| 決策日期 | {{DECISION_DATE}} |
| 決策者 | {{USER}} + AI 協作 |

## 📊 漏洞統計

| 來源 | Critical | High | Medium | Low | 總計 |
|------|----------|------|--------|-----|------|
| Checkmarx | {{CXO_CRITICAL}} | {{CXO_HIGH}} | {{CXO_MEDIUM}} | {{CXO_LOW}} | {{CXO_TOTAL}} |
| Mend 依賴 | {{MEND_CRITICAL}} | {{MEND_HIGH}} | {{MEND_MEDIUM}} | {{MEND_LOW}} | {{MEND_TOTAL}} |
| Mend Image | {{IMG_CRITICAL}} | {{IMG_HIGH}} | {{IMG_MEDIUM}} | {{IMG_LOW}} | {{IMG_TOTAL}} |
| **總計** | **{{TOTAL_CRITICAL}}** | **{{TOTAL_HIGH}}** | **{{TOTAL_MEDIUM}}** | **{{TOTAL_LOW}}** | **{{GRAND_TOTAL}}** |

## 📋 決策摘要

| 決策 | 數量 |
|------|------|
| ✅ 修復 | {{TO_FIX_COUNT}} |
| ⏸️ 暫不修復 | {{NO_ACTION_COUNT}} |

> 詳細漏洞資訊與修復建議請參考分析報告：`docs/security/{{COMMIT_7}}/analyses/`

---

## ✅ 決定修復（{{TO_FIX_COUNT}} 項）

{{#FIXES}}

### {{SEVERITY}} ({{COUNT}} 項)

{{#ITEMS}}
#### {{INDEX}}. {{TITLE}}

| 項目 | 值 |
|------|-----|
| 來源 | {{SOURCE}} |
| CVE/CWE | {{CVE_CWE}} |

**決策理由**

{{REASON}}

---

{{/ITEMS}}
{{/FIXES}}

## ⏸️ 決定暫不修復（{{NO_ACTION_COUNT}} 項）

{{#NO_ACTIONS}}

### {{SEVERITY}} ({{COUNT}} 項)

{{#ITEMS}}
#### {{INDEX}}. {{TITLE}}

| 項目 | 值 |
|------|-----|
| 來源 | {{SOURCE}} |
| CVE/CWE | {{CVE_CWE}} |

**決策理由**

{{REASON}}

---

{{/ITEMS}}
{{/NO_ACTIONS}}

---

## 📌 後續行動

{{#HAS_FIXES}}
- ✅ 執行 `/vul-fix` 進行修復
- 📋 修復時將依據本決策報告的清單
{{/HAS_FIXES}}

{{#NO_FIXES}}
- 🏁 所有漏洞決定暫不修復，流程結束
{{/NO_FIXES}}

---

**生成時間**: {{GENERATED_AT}}
**生成工具**: Claude Code - vul-decision
