# 開發流程規範

本文件定義 AI 驅動開發流程的完整規範，包含每個 Phase 的詳細步驟、檢查點、和轉換條件。

## 流程總覽

```
Phase 0     Phase 1        Phase 2         Phase 3     Phase 4      Phase 5
 PRD    ──▶  Spec       ──▶  Develop    ──▶  Verify  ──▶  Review  ──▶  Close
 探索       規格與設計     開發(TDD)       驗證         審查         完成
```

## Phase Transition Gates

每個 Phase 之間有明確的轉換條件和檢查點：

| 轉換 | 觸發方式 | Human 動作 | 自動化 | 檢查點 |
|------|---------|-----------|--------|--------|
| → Phase 0 | Human 發起需求 | 撰寫/確認需求 | 否 | — |
| 0 → 1 | Human approve PRD | ✅ 必須 | 否 | PRD 完整、feature/spec 清單已拆解 |
| 1 → 2 | Human approve spec | ✅ 必須 | 否 | Question=0、.feature 正反面完整、任務清單完整 |
| 2 → 3 | 所有任務 GREEN | — | ✅ 自動 | lint pass、type check pass |
| 3 → 4 | Verify 全 PASS | — | ✅ 自動 | 六階段驗證通過 |
| 4 → 5 | Human approve review | ✅ 必須 | 否 | 無 Critical、Major 已處理 |

**關鍵設計**：Human 在 Phase 0→1 和 1→2 確認意圖和設計；Phase 2→3→4 由 AI 自主推進；Phase 4→5 Human 做最終確認。

## Phase 詳細規範

### Phase 0: PRD — 產品探索

**目的**：定義問題和方向

**產出**：`docs/prd-NNN.md`

**檢查點**：
- [ ] 問題描述清楚（一句話說明）
- [ ] 有證據支持（數據、回饋、觀察）
- [ ] 預期成果可衡量
- [ ] 至少 2 個方案做比較
- [ ] 「不在範圍內」已明確列出
- [ ] 已拆解為 feature / spec 清單

**可跳過**：Bug fix、< 1 人天、技術債、config 變更

---

### Phase 1: Spec — 規格與設計

**目的**：將需求轉化為可執行的行為規格和技術設計

**產出**：
- `docs/features/[domain]/*.feature` — 行為規格
- `docs/specs/NNN-name/spec.md` — 技術設計
- `docs/specs/NNN-name/progress.md` — 進度追蹤

**四個步驟**：

#### Step 1: Example Mapping

| 檢查點 | 說明 |
|--------|------|
| 🟡 Story 已定義 | 清楚知道要做什麼功能 |
| 🔵 Rule 已列出 | 所有業務規則都被識別 |
| 🟢 Example 正反面 | 每條 Rule 至少有正面和反面範例 |
| 🔴 Question = 0 | 所有疑問都已解決 |

#### Step 2: .feature 撰寫

| 檢查點 | 說明 |
|--------|------|
| Gherkin 語法正確 | Feature → Rule → Example → Given/When/Then |
| 業務語言 | 不含技術實作細節 |
| 術語一致 | 同一概念用同一名詞 |
| Example 具體 | 有實際的值（"alice@example.com"），不是抽象描述（"某用戶"） |

#### Step 3: spec.md 撰寫

| 檢查點 | 說明 |
|--------|------|
| Meta 完整 | 類型、狀態、PRD 連結、行為規格連結、依賴 |
| 設計原則附理由 | 每個決策都有「為什麼」 |
| 任務粒度 2-5 min | 每個任務可在 2-5 分鐘內完成 |
| [P] 標記正確 | 可平行的任務有標記，依賴關係正確 |
| feature ref 完整 | 有行為的任務都指向對應的 .feature scenario |

#### Step 4: Review

| 檢查點 | 說明 |
|--------|------|
| .feature + spec.md 一起審 | 不要只看其中一個 |
| specs-overview.md 已更新 | 新 spec 已加入索引 |

---

### Phase 2: Develop — 開發

**目的**：透過逐任務 TDD 迴圈實作功能

**核心迴圈**（per task）：

```
RED → GREEN → REFACTOR → 輕量驗證 → 下一個 task
```

| 步驟 | 檢查點 | Agent |
|------|--------|-------|
| RED | 測試正確地失敗（不是語法錯誤） | test-writer |
| GREEN | 當前測試通過 + 既有測試未破壞 | implementer |
| REFACTOR | 清理後測試仍全綠 | implementer |
| 輕量驗證 | lint + type check pass | implementer |

**失敗處理**：

```
失敗 → 重試（max 3）→ 仍失敗 → Escalation Protocol
```

**Escalation Protocol**：
1. 產出失敗報告（嘗試了什麼、失敗原因、建議）
2. 通知 Human
3. 等待 Human 決策：
   - a. 提供提示讓 AI 重試
   - b. Human 手動修復
   - c. 調整 spec / task 拆分
   - d. 標記 blocked，跳過

---

### Phase 3: Verify — 驗證

**目的**：自動化品質檢查

**六階段流水線**：

| Stage | 名稱 | 檢查內容 | 失敗條件 |
|-------|------|---------|---------|
| 1 | Build | 專案可建構 | build 失敗 |
| 2 | Type Check | 型別正確 | 有 type error |
| 3 | Lint | 風格規範 | 有 lint error |
| 4 | Test Suite | 測試通過 + 覆蓋率 | 測試失敗或覆蓋率 < 80% |
| 5 | Security | 漏洞掃描 | 有 critical/high 漏洞 |
| 6 | Diff Review | 變更合理性 | 觸碰敏感路徑、超大檔案 |

**失敗處理**：implementer 修復 → 重新六階段（max 3）→ escalate

---

### Phase 4: Review — 審查

**目的**：人類判斷的品質把關

**審查重點**（不重複 Phase 3 已做的事）：
1. Spec 合規性 — 功能是否符合規格
2. 架構合理性 — 設計是否正確
3. 程式碼可讀性 — 是否易於維護
4. 測試品質 — 是否真正驗證行為

**回饋處理**：

| 回饋級別 | 處理 |
|---------|------|
| 🔴 Critical | 必須修復 → 回到 Phase 2 → 重跑 Phase 3-4 |
| 🟡 Major | 應該修復 → 修復後重跑 Phase 3-4 |
| 🟢 Minor | 可選修復 → 不影響 approve |
| 需改 spec | 回到 Phase 1 修改 spec → 重跑 Phase 2-4 |

---

### Phase 5: Close — 完成

**目的**：確保所有文件和版控到位

**Checklist**：
- [ ] .feature scenario 全數有測試且通過
- [ ] AC-manual 全數驗證
- [ ] Verification Report 全部 PASS
- [ ] progress.md 更新至最終狀態
- [ ] specs-overview.md 同步（狀態 = done）
- [ ] feature-map.md 同步
- [ ] 變更已 commit
- [ ] Git tag 已標記（如適用）

---

## 跳過判斷速查表

| 需求規模 | PRD | Spec | Develop | Verify | Review |
|---------|:---:|:----:|:-------:|:------:|:------:|
| Bug fix | 跳 | 輕量 | 寫重現測試→修復 | 輕量 | AI |
| Config 變更 | 跳 | 跳 | 直接改 | 跳 | 跳 |
| UI 微調 | 跳 | 輕量 | Widget test+實作 | 輕量 | AI |
| 小功能 (<1天) | 跳 | 必須（可省 Example Mapping） | 必須 | 必須 | PR |
| 中功能 (1-5天) | 必須 | 必須（含 Example Mapping） | 必須 | 必須 | PR |
| 大功能 (>5天) | 必須 | 必須（完整 Example Mapping） | 必須 | 完整 | PR+TL |

## Profile 制

| Profile | 適用 | Discovery 深度 | .feature | Cucumber | 任務 Review |
|---------|------|---------------|----------|----------|------------|
| Solo | 個人開發 | 輕量 | ✔ | ✗ | AI 自動 |
| Team | 小團隊 2-5 人 | 完整 | ✔ | ✗ | AI+同儕 |
| Enterprise | 大團隊/有 PM·QA | 完整+Three Amigos | ✔ | ✔ 可選 | AI+人工+QA |
