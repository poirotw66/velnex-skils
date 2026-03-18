# Phase Transition Gates

## Gate 定義

| 從 | 到 | 觸發條件 | Human 必要 |
|----|-----|---------|-----------|
| — | Arch | 專案啟動或重大架構決策 | ✅ 決策 |
| — | PRD | 使用者提出需求 | ✅ 發起 |
| PRD | BDD / Spec | PRD approved | ✅ Approve |
| BDD | Spec | .feature 完成 | ❌（可直接進 Spec） |
| Spec | Design Docs | Spec approved | ✅ Approve |
| Spec | Develop | 設計文件完成 | ❌ |
| Develop | Verify | 所有任務完成 | ❌ |
| Verify | Review | Verification PASS | ❌ |
| Review | Close | Code Review approved | ✅ Approve |
| Close | Done | Checklist 完成 | ❌ |

## 各階段進入條件

### PRD → BDD / Spec

- [ ] PRD 文件已建立（`docs/prd-NNN.md`）
- [ ] 問題定義明確
- [ ] Human 已 approve PRD
- [ ] 已 commit

### BDD → Spec（如有 BDD）

- [ ] Example Mapping 完成（🔴 = 0）
- [ ] .feature 檔案已建立
- [ ] Human 已確認
- [ ] 已 commit

### Spec → Design Docs / Develop

- [ ] 影響分析完成（新增 / 修改項目已識別）
- [ ] spec.md 已建立
- [ ] progress.md 已建立
- [ ] specs-overview.md 已更新
- [ ] 自動 Spec Review 通過
- [ ] Human 已 approve
- [ ] 已 commit

### Design Docs → Develop

- [ ] Spec Section 4 涉及範圍**無「待展開」項目** — 所有 UISpec / ApiSpec / Schema 欄位都有路徑
- [ ] 涉及的 api-spec 已撰寫（或由 Human 確認不需要）
- [ ] 涉及的 ui-spec 已撰寫（或由 Human 確認不需要）
- [ ] 涉及的 schema 已撰寫（或由 Human 確認不需要）
- [ ] openapi.yaml 已更新（如涉及 API）
- [ ] Spec Section 4 的路徑已回填
- [ ] 設計文件交叉比對通過（spec-auditor Pass 3）
- [ ] 已 commit

### Develop → Verify

- [ ] 所有任務完成
- [ ] 每個任務都走完 RED → GREEN → REFACTOR
- [ ] 所有測試通過
- [ ] De-Sloppify 清理完成
- [ ] progress.md 已更新
- [ ] 已 commit

### Verify → Review

- [ ] Core stages 全部 PASS
- [ ] Security Review 通過
- [ ] Verification Report 已產出

### Review → Close

- [ ] Spec + Design Compliance 通過
- [ ] Code Quality 審查完成
- [ ] 無 🔴 Critical 未修復
- [ ] 無 🟡 Major 未修復（或有正當理由）
- [ ] Human 已 approve

### Close → Done

- [ ] 設計文件已同步（反映最終實作）
- [ ] 追蹤文件已更新（progress.md, specs-overview.md, feature-map.md）
- [ ] 版控完成（commit）
- [ ] 已 commit

## 跳過判斷速查表

| 需求規模 | Arch | PRD | BDD | Spec | Design | Develop | Verify | Review |
|---------|:----:|:---:|:---:|:----:|:------:|:-------:|:------:|:------:|
| Bug fix | — | 跳 | 跳 | 輕量 | 跳 | 寫重現測試→修復 | Core | AI |
| Config 變更 | — | 跳 | 跳 | 跳 | 跳 | 直接改 | Core | 跳 |
| UI 微調 | — | 跳 | 跳 | 輕量 | 更新 ui-spec | 實作 | Core | AI |
| 小功能 (<1天) | — | 跳 | 可選 | 必須 | 必須 | TDD | Core+選 | 必須 |
| 中功能 (1-5天) | — | 必須 | 可選 | 必須 | 必須 | TDD | 全部 | 必須 |
| 大功能 (>5天) | 檢查 | 必須 | 建議 | 必須 | 必須 | TDD | 全部 | 必須 |
