# Velnex 開發規範

## 開發流程：AI 驅動、Human 審查

本專案採用 AI-Driven Development Flow。所有程式碼變更都必須經過結構化的六階段流程。

### 六階段流程

```
Phase 0: PRD → Phase 1: Spec → Phase 2: Develop → Phase 3: Verify → Phase 4: Review → Phase 5: Close
```

### Skills（vif plugin）

| Phase | Skill | 說明 |
|-------|-------|------|
| — | `/vif-flow` | 流程總覽、phase routing |
| 0 | `/vif-prd` | 產品探索、PRD 撰寫 |
| 1 | `/vif-spec` | Example Mapping → .feature → spec.md |
| 2 | `/vif-develop` | 逐任務 TDD（RED → GREEN → REFACTOR） |
| 3 | `/vif-verify` | 六階段自動化驗證 |
| 4 | `/vif-review` | 兩階段程式碼審查 |
| 5 | `/vif-close` | 完成檢查清單 |


### Human 介入點（僅三個）

1. **Phase 0 → 1**：PRD approve
2. **Phase 1 → 2**：Spec + Feature review approve
3. **Phase 4 → 5**：Final review approve

Phase 2→3→4 由 AI 自主驅動。

## 核心原則

1. **行為先於設計** — Discovery → .feature → spec.md
2. **TDD 硬性約束** — 沒有失敗測試就不寫 production code
3. **逐任務開發** — 每任務 2-5 分鐘粒度
4. **Spec 先行** — 沒有 approved spec 不寫程式
5. **最多重試 3 次** — 超過就 escalate 給 Human

## 文件結構

```
docs/
├── prd-NNN.md                       ← 需求規格（WHY + WHAT）
├── features/                        ← 行為規格（按業務領域）
│   └── [domain]/
│       └── [name].feature           ← Gherkin 格式
├── specs/
│   ├── specs-overview.md            ← 索引與依賴圖
│   ├── NNN-feature-name/
│   │   ├── spec.md                  ← 技術設計（HOW）
│   │   └── progress.md              ← 進度 + 決策紀錄
│   └── templates/
├── feature-map.md                   ← 功能追蹤

guideline/                           ← 開發規範
├── README.md                        ← 流程總覽 + 檢查點
└── testing-guideline.md             ← 測試規範
```

### 三層文件職責

| 文件 | 回答什麼 | 順序 |
|------|---------|------|
| `prd-NNN.md` | WHY + WHAT | ① 最先 |
| `features/*.feature` | HOW it behaves | ② 中間 |
| `specs/NNN/spec.md` | HOW to build | ③ 最後 |

features 和 specs 是**多對多**關係。

## 技術慣例

### 版本控制
- Conventional Commits 格式
- 中文撰寫 commit body
- 不主動 commit，等待使用者明確指示
- 使用 git-commit subagent 執行 commit

### 程式碼風格
- 遵循各語言的官方 style guide
- Lint + Type check 必須通過才能進入 Review

### 測試
- 覆蓋率目標：整體 ≥ 80%，核心邏輯 ≥ 90%
- 測試金字塔：Unit（大量）> Integration（適量）> E2E（少量）
- 詳見 `guideline/testing-guideline.md`
