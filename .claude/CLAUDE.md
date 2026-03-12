# Velnex 開發規範

## 開發流程：AI 驅動、Human 審查

本專案採用 AI 主導開發、Human 負責審查的模式。所有程式碼變更都必須經過結構化的流程。

### 六階段流程

```
Phase 0: PRD → Phase 1: Spec → Phase 2: Develop → Phase 3: Verify → Phase 4: Review → Phase 5: Close
```

| Phase | 名稱 | 主導者 | 關鍵產出 |
|-------|------|--------|---------|
| 0 | PRD | Human + AI | `docs/prd-NNN.md` |
| 1 | Spec | Human + AI → Review | `docs/features/*.feature` + `docs/specs/NNN/spec.md` |
| 2 | Develop | **AI 主導** | 測試 + 程式碼（per-task TDD） |
| 3 | Verify | **自動化** | Verification Report |
| 4 | Review | Human + AI | Review 回饋 |
| 5 | Close | Human + AI | Checklist 完成 |

### Human 介入點（僅三個）

1. **Phase 0 結束**：PRD approve
2. **Phase 1 結束**：Spec + Feature review approve
3. **Phase 4**：Final review approve

Phase 2→3 由 AI 自主驅動，Human 不需介入，除非 AI escalate。

## 核心原則

### 1. 行為先於設計
先寫 `.feature`（系統該怎麼表現），再寫 `spec.md`（技術上怎麼做到）。不要在還不清楚行為的時候做技術決策。

### 2. TDD 硬性約束
沒有失敗的測試，不寫 production code。這不是建議，是約束。

### 3. 逐任務開發
每個任務 2-5 分鐘粒度，每個任務獨立走完 RED → GREEN → REFACTOR。不要一次寫完所有測試再實作。

### 4. Spec 先行
不寫 spec 不寫 code。即使是「小改動」，也至少要有輕量 spec。

### 5. 最多重試 3 次
AI 嘗試 3 次仍失敗 → 產出失敗報告 → escalate 給 Human。不要無限重試。

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
| `prd-NNN.md` | WHY + WHAT（為什麼做、做什麼） | ① 最先 |
| `features/*.feature` | 系統應該怎麼表現（行為規格） | ② 中間 |
| `specs/NNN/spec.md` | HOW（怎麼做到，技術設計） | ③ 最後 |

features 和 specs 是 **多對多** 關係。一個 `.feature` 可被多個 spec 實作；一個 spec 可實作多個 `.feature` 的場景。

## Agent 使用

| Agent | 用途 | 工具限制 |
|-------|------|---------|
| `spec-writer` | Phase 0-1：PRD、.feature、spec.md | 完整 |
| `reviewer` | Phase 1, 4：規格審查、程式碼審查 | 完整 |
| `test-writer` | Phase 2：從 .feature 生成測試（RED） | 完整 |
| `implementer` | Phase 2：讓測試通過（GREEN） | 完整 |
| `verifier` | Phase 3：六階段自動化驗證 | 僅 Bash + Read |
| `security-reviewer` | Phase 3-4：安全掃描 | 僅 Read |

## Slash Commands

| Command | Phase | 用途 |
|---------|-------|------|
| `/prd` | 0 | 建立 PRD |
| `/spec` | 1 | 執行 Phase 1（Discovery → .feature → spec.md） |
| `/develop` | 2 | 執行 Phase 2（逐任務 TDD） |
| `/verify` | 3 | 執行 Phase 3（六階段驗證） |
| `/review` | 4 | 執行 Phase 4（程式碼審查） |
| `/close` | 5 | 執行 Phase 5（完成 Checklist） |

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
