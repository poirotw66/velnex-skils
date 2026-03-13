# Phase Transition Gates

## Gate 定義

| 從 | 到 | 觸發條件 | Human 必要 | 自動化程度 |
|----|-----|---------|-----------|-----------|
| — | Phase 0 | 使用者提出需求 | ✅ 發起 | — |
| Phase 0 | Phase 1 | PRD approved | ✅ Approve | AI 撰寫 |
| Phase 1 | Phase 2 | Spec + .feature approved | ✅ Approve | AI 撰寫 + 自動審查 |
| Phase 2 | Phase 3 | 所有任務完成 | ❌ | 全自動 |
| Phase 3 | Phase 4 | Verification Report PASS | ❌ | 全自動 |
| Phase 4 | Phase 5 | Code Review approved | ✅ Approve | AI 審查 + Human 最終 |
| Phase 5 | Done | Close checklist 完成 | ❌ | 全自動 |

## 各 Phase 進入條件

### Phase 0 → Phase 1

- [ ] PRD 文件已建立（`docs/prd-NNN.md`）
- [ ] 問題定義明確（一句話說明）
- [ ] 有證據支持
- [ ] 預期成果可衡量
- [ ] 方案比較已完成
- [ ] Feature/Spec 拆解建議已列出
- [ ] Human 已 approve PRD

### Phase 1 → Phase 2

- [ ] Example Mapping 完成（🔴 Question = 0）
- [ ] .feature 檔案已建立
  - [ ] 每個 Rule 有正面 + 反面 Example
  - [ ] 使用業務語言，非技術術語
  - [ ] Scenario 獨立、不依賴順序
- [ ] spec.md 已建立
  - [ ] 技術設計可行
  - [ ] 任務拆解粒度 2-5 分鐘
  - [ ] [P] 標記和依賴關係正確
  - [ ] 每個任務有 feature ref
- [ ] progress.md 已建立
- [ ] specs-overview.md 已更新
- [ ] 自動 Spec Review 通過
- [ ] Human 已 approve

### Phase 2 → Phase 3

- [ ] 所有 spec.md 任務完成
- [ ] 每個任務都走完 RED → GREEN → REFACTOR
- [ ] 所有測試通過
- [ ] De-Sloppify 清理完成
- [ ] progress.md 已更新

### Phase 3 → Phase 4

- [ ] Verification Report overall PASS 或 WARN
- [ ] 無 FAIL stage（或已修復後重驗）
- [ ] Security review 無 Critical 漏洞

### Phase 4 → Phase 5

- [ ] Stage 1 Spec Compliance 通過
- [ ] Stage 2 Code Quality 審查完成
- [ ] 無 🔴 Critical 未修復
- [ ] 無 🟡 Major 未修復（或有正當理由）
- [ ] Human 已 approve

### Phase 5 → Done

- [ ] Verification Before Completion Gate 5 點全過
- [ ] Close Checklist 全部完成
- [ ] 追蹤文件已更新（progress.md, specs-overview.md, feature-map.md）
- [ ] 版控完成（commit, tag）

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
