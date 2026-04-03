# vif (Velocity AI Flow) — AI-Driven Development Flow 完整指南

## 什麼是 vif？

vif 是一套 **AI 驅動的軟體開發流程框架**，以 Claude Code plugin 形式運作。它將軟體開發從需求探索到交付收尾，拆解為明確的階段（Phase），每個階段由專屬的 skill 驅動，搭配 6 個專職 AI subagent 執行具體工作。

vif 的核心理念：

- **Spec-First** — 沒有核准的規格，就不寫程式
- **TDD 強制** — 沒有失敗的測試，就不寫產品程式碼
- **Impact Analysis 為核心** — 每次變更都先釐清「新增什麼」vs.「修改什麼」
- **驗證 = 誠實** — 只宣稱有新鮮證據支持的結論
- **文件即合約** — 設計文件不是擺設，是開發的施工藍圖

---

## 流程總覽

```
Phase 0          Phase 1                    Phase 2      Phase 3    Phase 4    Phase 5
探索與定義        規劃與設計                  實作          驗證        審查        收尾
─────────────────────────────────────────────────────────────────────────────────────

/vif-prd    ─┐
/vif-arch   ─┤── /vif-spec ──┬── /vif-api-spec ──┐
/vif-uiux   ─┤              ├── /vif-ui-spec  ──┤── /vif-develop ── /vif-verify ── /vif-review ── /vif-close
/vif-bdd    ─┘              └── /vif-prototype ──┘
(可選)                          (可選)
```

### 三個 Hard Gate（必須人工核准才能往下）

| Gate | 位置 | 意義 |
|------|------|------|
| Gate 1 | PRD → Spec | 確認問題定義與方向正確 |
| Gate 2 | Spec → Develop | 確認技術範圍、設計文件完備 |
| Gate 3 | Review → Close | 確認程式碼品質與規格符合度 |

---

## 兩種使用模式

### 模式一：完全自動化（Solo / 小團隊）

AI 驅動所有階段，人類在 Gate 點審核決策。適合個人開發者或小團隊快速交付。

有兩種起手順序：

**技術先行**（先確定技術邊界，再寫需求）：
```
/vif-arch + /vif-uiux → /vif-prd → /vif-bdd → /vif-spec → 設計 → 開發 → 驗證 → 審查 → 收尾
```

**產品先行**（先定義需求，再選技術）：
```
/vif-prd → /vif-arch + /vif-uiux → /vif-bdd → /vif-spec → 設計 → 開發 → 驗證 → 審查 → 收尾
```

### 模式二：輔助自動化（企業團隊）

各角色各自驅動對應的 skill，AI 作為執行助手：

| 角色 | 使用的 Skill |
|------|-------------|
| 架構師 | `/vif-arch` |
| PM / PD | `/vif-prd`、`/vif-bdd` |
| 設計師 | `/vif-uiux`、`/vif-prototype` |
| SA / SD | `/vif-spec` |
| 前端工程師 | `/vif-ui-spec`、`/vif-develop` |
| 後端工程師 | `/vif-api-spec`、`/vif-develop` |
| 全員 | `/vif-verify`、`/vif-review`、`/vif-close` |

### 彈性跳過機制

不是每個任務都需要走完全部階段：

| 任務類型 | 可跳過的階段 |
|---------|-------------|
| Bug 修復（< 1 天） | PRD、BDD |
| 技術債清理 | PRD、BDD |
| 設定檔變更 | PRD、BDD、Spec |
| 新功能開發 | 完整流程 |

---

## 各階段詳解

---

### Phase 0：探索與定義

#### `/vif-prd` — 產品需求文件

**做什麼**：釐清「要解決什麼問題」和「為什麼值得解決」。vif-prd 扮演的是思考夥伴，不是表格填寫機。

**流程**：
1. **問題探索** — 從四個維度（問題本身、證據、預期成果、方案選項）深入對話
2. **撰寫 PRD** — 依模板產出結構化文件
3. **Human 審核** — 核准後才能進入 Spec 階段

**產出檔案**：`docs/prd-NNN.md`

**實際產出範例**（來自 Velora 專案的 PRD-001）：

```markdown
# PRD-001: Velora GUI 桌面應用 — 轉錄後處理與產品化

## 1. 問題描述
使用者在完成語音轉錄後，需要花費大量時間進行逐字稿後處理...

## 2. 證據
- 現有 CLI 工具僅產出原始轉錄結果，後處理需手動在文字編輯器中進行...
- 市場上現有工具多為 SaaS 或功能受限，缺乏本地化方案

## 3. 預期成果
| 指標 | 目標 |
|------|------|
| 轉錄操作 | 可在 GUI 中選擇引擎、模型、語言等參數啟動轉錄 |
| 結果瀏覽與編輯 | 依時間序瀏覽逐字稿、inline 編輯文字... |

## 4. 方案選項
| 方案 | 優點 | 缺點 |
|------|------|------|
| A. Tauri v2 + Svelte | 安裝包小、跨平台... | 生態較年輕... |
| B. Electron + React | 生態成熟... | 安裝包大... |
| C. Python GUI (PyQt) | 直接呼叫 pipeline... | UI 開發效率低... |

> **決定：A. Tauri v2 + Svelte**

## 5. 不在範圍內
- 雲端服務 / SaaS 版本
- 多人協作編輯...

## 6. Spec 拆解建議
| Spec | 名稱 | 範圍 | 優先級 |
|------|------|------|--------|
| spec-001 | 基礎轉錄 + 結果瀏覽 | Tauri 骨架、sidecar 通訊... | P0 |
| spec-002 | Process Overlay | 全螢幕進度遮罩... | P0 |
...
```

> PRD 的精髓在於「方案選項比較表」—— 不只記錄選了什麼，更記錄**為什麼不選其他方案**。

---

#### `/vif-arch` — 架構決策記錄（ADR）

**做什麼**：記錄架構決策的「為什麼」，不只是「選了什麼」。寫給六個月後的自己看。

**使用時機**：
- **專案啟動時**：技術棧選型、目錄結構、測試策略
- **開發過程中**：引入新技術、重構模組、效能優化、安全策略變更

**流程**：
1. 確認決策背景與限制條件
2. 列出所有方案並比較（表格化）
3. 記錄決策與理由
4. 分析影響範圍
5. 更新 `.claude/CLAUDE.md`（技術棧、專案指令等）

**產出檔案**：`docs/architecture/adr-NNN-name.md`

**實際產出範例**（來自 Velora 的 ADR-001）：

```markdown
# ADR-001: Pipeline 步驟進度回報策略

- 狀態: Accepted
- 日期: 2026-03-18

## 背景
Velora 的轉錄 pipeline 包含多個步驟，各步驟的進度回報能力不同...

## 各引擎進度能力
| 引擎 | 進度機制 | 原生 callback |
|------|---------|--------------|
| faster-whisper | whisperx progress_callback | Yes |
| whisper-cpp | new_segment_callback | Yes（間接）|
| mlx-whisper | tqdm 輸出到 stderr | No |

## 決策
優先使用引擎原生 callback，無 callback 時 parse stderr 的 tqdm 輸出作為 fallback。
```

**設定彈性**：
- 可在專案任何時間點觸發，不限於流程起始
- 自動偵測是否已有 PRD，有的話會讀取作為技術選型的參考

---

#### `/vif-uiux` — UI/UX 設計基礎

**做什麼**：建立產品的視覺語言 — 不是套用 AI 預設風格，而是從產品意圖出發建立有辨識度的設計系統。

**核心原則：Intent First** — 動手設計前必須先回答三個問題：
1. **誰在用這個？**（具體場景，不是「所有使用者」）
2. **他們在完成什麼？**（一個動詞）
3. **應該有什麼感覺？**（溫度、密度、個性）

**流程**：
1. 產品領域探索（5+ 意象概念、5+ 色彩聯想、招牌元素、3 個拒絕的預設值）
2. 設計決策（色彩系統、字型、間距、深度策略、元件規格、回饋機制、狀態表現）
3. 品質檢驗（Swap / Squint / Signature / Token 四項測試）
4. 確認並記錄

**產出檔案**：`guideline/ui/ui-guideline.md`

**設計決策包含**：

| 面向 | 決策內容 |
|------|---------|
| 色彩系統 | 主色、輔色、功能色（success/warning/danger/info）、中性色 |
| 字型 | 字型家族與個性選擇、大小級距 |
| 間距 | 基礎單位、密度選擇（tight/loose） |
| 深度策略 | 四選一：純邊框 / 淺陰影 / 層疊陰影 / 色差 |
| 元件規格 | 按鈕、表格、表單、Modal |
| 回饋機制 | Toast、Dialog、錯誤訊息 |
| 狀態表現 | default/hover/active/focus/disabled + loading/empty/error |

**品質檢驗**：
- **Swap test**：把字型/排版換成常見替代品，看起來還有差異嗎？
- **Squint test**：模糊螢幕，還能看出層級嗎？
- **Signature test**：找 5 個體現設計方向的元素
- **Token test**：CSS 變數名稱能聯想到產品世界嗎？

**設定彈性**：專案已有設計系統時可跳過；開發中可更新並記錄版本歷史。

---

#### `/vif-bdd` — BDD 行為探索（可選）

**做什麼**：用具體範例取代抽象描述，從三個視角（商業/開發/測試）探索行為規格。

**流程**：
1. **三視角探索**：Business（WHY?）、Development（HOW? 技術限制?）、Testing（什麼會壞?）
2. **Example Mapping**（四色卡片法）：
   - 🟡 Story：要實作的功能
   - 🔵 Rule：業務規則 / 驗收條件
   - 🟢 Example：具體情境 → 變成 Scenario
   - 🔴 Question：未解決的疑問
3. **撰寫 .feature**：將 mapping 轉換為 Gherkin 格式

**產出檔案**：`docs/features/[domain]/[name].feature`

**設定彈性**：可選階段。適合複雜互動行為的釐清；簡單 CRUD 或需求已清楚時可跳過。

---

### Phase 1：規劃與設計

#### `/vif-spec` — 技術規格與影響分析

**做什麼**：這是整個流程的**戰略核心** — 產出 spec.md（作戰計畫）和 progress.md（追蹤表）。

**最重要的步驟：Impact Analysis**

影響分析會掃描 PRD、Figma、.feature、以及**現有的程式碼和設計文件**，產出一張清楚的表格：

```markdown
## 涉及範圍

### 頁面清單
| 動作 | 頁面 | 說明 | UISpec |
|------|------|------|--------|
| 新增 | TranscribeView | 拖放音檔、參數設定、轉錄進度 | docs/ui-specs/gui/transcribe/transcribe-view.md |
| 新增 | EditorView | 逐字稿段落列表 | docs/ui-specs/gui/editor/editor-view.md |

### Tauri Commands（IPC）
| 動作 | Command | 方向 | 說明 | ApiSpec |
|------|---------|------|------|---------|
| 新增 | start_transcription | Frontend → Rust → Sidecar | 啟動 sidecar | docs/api-specs/gui/sidecar/start-transcription.md |
| 新增 | save_project | Frontend → Rust | 寫入 .velora | docs/api-specs/gui/project/save-project.md |
```

**完整流程**：
1. **Impact Analysis** — 掃描 PRD + 現有程式碼 + 設計文件，分出新增 vs. 修改
2. **撰寫 spec.md** — 背景、設計原則、範圍（附影響表格）、業務規則、任務清單、驗收條件
3. **建立 progress.md** — 設計文件追蹤表 + TDD 執行紀錄
4. **選擇展開方式** — 問 Human：展開全部設計文件？只展開 API Spec？只展開 UI Spec？還是先不展開？
5. **自動審查** — spec-auditor 三階段檢查
6. **Human 審核** → 核准後可進入開發

**產出檔案**：
- `docs/specs/NNN-name/spec.md` — 技術規劃
- `docs/specs/NNN-name/progress.md` — 進度追蹤
- 更新 `docs/specs/specs-overview.md` — 全域索引

**實際的 specs-overview.md**（來自 Velora）：

```markdown
| # | 名稱 | 狀態 | PRD | 依賴 | 備註 |
|---|------|------|-----|------|------|
| 001 | 基礎轉錄 + 結果瀏覽 | ✔️ | prd-001 | — | Tauri 骨架 + sidecar |
| 002 | Process Overlay | ✔️ | prd-001 | 001 | 全螢幕遮罩 + 設定頁 |
| 003 | 音訊播放 + 講者管理 | ✔️ | prd-001 | 001, 002 | wavesurfer 波形播放 |
| 004 | 內容編輯 + 匯出 | ✔️ | prd-001 | 001, 003 | inline 編輯 + 匯出 |
| 005 | 模型下載進度追蹤 | ✔️ | prd-001 | 001, 002 | 下載偵測 + 進度百分比 |
| 006 | 模型管理 | ✔️ | prd-001 | 005 | 設定頁查看 + 刪除模型 |
| 007 | 帳號系統 + Supabase | ✅ | prd-002 | 004 | Auth + 登入 UI |
```

**設定彈性**：
- 任務拆解模式：AI 驅動（2-5 分鐘粒度）或團隊自行拆解
- 設計展開：可全部展開、部分展開、或延後給對應專家

---

#### `/vif-api-spec` — API 規格 + DB Schema

**做什麼**：產出後端的完整施工藍圖 — 不只是 endpoint 清單，而是包含所有失敗情境的完整描述。

**流程**：
1. 讀取 PRD / Spec / Figma + 掃描現有規格
2. 撰寫 API Spec（每個 API 一份）
3. 更新 openapi.yaml（如適用）
4. 撰寫 DB Schema
5. spec-auditor 自審（Pass 1+2）
6. 更新 progress.md

**每份 API Spec 包含**：
- 方法、路徑、描述
- 請求（Headers / Params / Body + 驗證規則）
- 回應（成功 + 每種錯誤）
- 業務邏輯（完整流程步驟）
- 邊界條件
- **錯誤映射表**（每個 API 必須列出所有可能的失敗）
- 範例（含成功與錯誤情境的完整程式碼）

**產出檔案**：
- `docs/api-specs/[module]/[domain]/[name].md` — API 規格
- `docs/api-specs/[module]/openapi.yaml` — OpenAPI 定義（REST API 時）
- `docs/schema/[domain].md` — DB Schema

**實際產出範例**（來自 Velora 的 list_cached_models）：

```markdown
## Arguments
invoke('list_cached_models'): Promise<CachedModel[]>

## Return
interface CachedModel {
  engine: string;       // "mlx-whisper" | "faster-whisper" | "whisper-cpp"
  model_name: string;   // "large-v2" | "small"
  size_bytes: number;   // 磁碟佔用（bytes）
  repo_id: string;      // HuggingFace repo_id
}

## 錯誤處理
| 操作 | 錯誤情境 | Error Code | 使用者看到 |
|------|---------|------------|-----------|
| invoke | 無法啟動 Python 程序 | PYTHON_SPAWN_FAILED | 無法啟動模型管理程序：{detail} |
| invoke | Python 程序逾時（15 秒） | PYTHON_TIMEOUT | 模型管理操作逾時 |
| invoke | 回傳非 JSON 或 ok=false | MODEL_LIST_FAILED | 無法載入模型列表：{detail} |

## 業務邏輯
1. 解析 project_root
2. 啟動 Python 程序
3. 等待結果（逾時 15 秒）
4. 解析 stdout JSON
5. 回傳

## 邊界條件
- HuggingFace cache 目錄不存在 → 回傳空陣列
- 大量非 Velora 模型 → 只回傳已知 repo_id
- Python stderr 有 warning → 忽略，只讀 stdout
```

**Schema 產出包含**：
- 表格定義（欄位、型別、約束）
- 索引（附查詢使用情境說明）
- 關聯（FK + ON DELETE 行為）
- Enum / 代碼表
- Migration 紀錄

**設定彈性**：
- 非 REST API 的專案（如 Tauri IPC）可在 CLAUDE.md 自訂規範（例如 Velora 專案取消 openapi.yaml、合併錯誤處理表）
- 現有 API 修改時會標示 breaking / non-breaking changes

---

#### `/vif-ui-spec` — UI 頁面規格

**做什麼**：Figma 告訴你「長什麼樣」，UI Spec 告訴你「怎麼運作」。

**每份 UI Spec 包含**：
- 頁面結構（ASCII 線框圖）
- 元件清單與子元件
- 欄位資料來源（對應哪支 API）
- 互動行為（操作 → API 呼叫 → 成功/失敗處理）
- 驗證規則
- 權限控制
- Responsive 設計

**產出檔案**：`docs/ui-specs/[module]/[page]/[name].md`

**實際產出範例**（來自 Velora 的 EditorView）：

```
## 頁面結構

┌────────────────────────────────────────────┐
│ Header                                      │
│ 專案名稱                    🔍  📥  👥 4   │
├────────────────────────────────────────────┤
│ WaveformPlayer（固定高度）                  │
│ ▁▂▃▅▇▅▃▂▁  波形  ▁▂▃▅▆▅▃▂▁               │
│ ▶ 00:32/05:00  1.0x  👥  🔊               │
├────────────────────────────────────────────┤
│ SearchReplaceBar（浮動，條件顯示）          │
├────────────────────────────────────────────┤
│ TranscriptList（flex-1, scrollable）        │
│ ┌─────────────────────────────────────────┐│
│ │ 00:00 → 00:03  SPEAKER_00        ▶     ││
│ │ 我們今天來討論系統架構                   ││
│ ├─────────────────────────────────────────┤│
│ │ 00:03 → 00:07  SPEAKER_01  ★高亮  ▶   ││
│ │ 好的，我先說明目前的進度                 ││
│ └─────────────────────────────────────────┘│
├────────────────────────────────────────────┤
│ Footer                                      │
│ meeting.wav · 5:30 · 42 個段落  engine · zh │
└────────────────────────────────────────────┘
```

**設定彈性**：
- 每個頁面一份檔案，模組化管理
- 可引用 API Spec 的欄位定義
- 修改既有頁面時會標記變更內容

---

#### `/vif-prototype` — 互動式 HTML 原型（可選）

**做什麼**：在投入完整開發前，用互動式 HTML 原型確認方向。

**核心原則**：原型是用來確認方向後丟掉的，不是產品程式碼。

**流程**：
1. 檢查是否有 UI 設計基礎（沒有的話建議先跑 `/vif-uiux`）
2. 確認範圍（哪些頁面需要原型）
3. 產出 HTML 原型（單檔、內嵌 CSS/JS、可互動、使用真實設計 guideline 的色彩/字型）
4. Human 在瀏覽器中確認
5. 確認後轉換為 UI Spec

**產出檔案**：`docs/prototypes/[name].html`（確認後通常丟棄）

**設定彈性**：可選階段；已有 Figma 設計時可跳過。

---

### Phase 2：實作

#### `/vif-develop` — TDD 開發

**做什麼**：以嚴格的 TDD 紀律（RED → GREEN → REFACTOR）執行 spec.md 的任務清單，透過 subagent 分工。

**進入條件（Entry Gate）**：
- spec.md 已核准
- progress.md 的設計文件表全部完成（無「待撰寫」項目）
- 所有設計文件已通過 Pass 1+2 自審

**核心循環**（每個任務）：

```
┌─── RED ───────────────────────────┐
│ test-writer agent 撰寫測試         │
│ 執行測試 → 確認「失敗」           │
│ 驗證失敗是合法的（非語法錯誤）     │
└────────────┬──────────────────────┘
             ▼
┌─── RED→GREEN Gate ────────────────┐
│ 測試檔案存在嗎？                   │
│ 測試確實失敗嗎？                   │
│ 都確認 → 往下                     │
└────────────┬──────────────────────┘
             ▼
┌─── GREEN ─────────────────────────┐
│ implementer agent 寫最少的程式碼   │
│ 執行目標測試 → 確認「通過」       │
│ 執行相關測試 → 確認無 regression  │
└────────────┬──────────────────────┘
             ▼
┌─── REFACTOR ──────────────────────┐
│ 消除重複、改善命名、提取 helper    │
│ 全程保持測試通過                   │
└────────────┬──────────────────────┘
             ▼
      輕量驗證 + 更新 progress.md + Commit
```

**Implementer 回報狀態**：
| 狀態 | 意義 | 後續動作 |
|------|------|---------|
| `DONE` | 完成，測試通過 | 繼續下一個任務 |
| `DONE_WITH_CONCERNS` | 完成但有疑慮 | 記錄疑慮，繼續 |
| `NEEDS_CONTEXT` | 需要更多資訊 | 回饋迴圈（最多 1 次） |
| `BLOCKED` | 無法繼續 | 升級給 Human |

**完成後的 De-Sloppify Pass**：
- 移除 `console.log` / `print` / `debugger`
- 移除註解掉的程式碼
- 清理 import
- 檢查不必要的 `any` 型別
- 移除 TODO hack

**實際的 progress.md 追蹤紀錄**（來自 Velora Spec-006）：

```markdown
## 進度

- [x] Phase 1: Spec approved
- [ ] Phase 2: Develop
  - [x] Task 1: model_registry.py — 共用模型映射
    - RED: tests/test_model_registry.py — 19 tests，失敗原因：ModuleNotFoundError ✓
    - GREEN: src/velora/model_registry.py — 建立純資料映射模組 ✓
    - REFACTOR: 無需重構 ✓
    - Test: Unit ✓（22 passed + 全部 81 passed）
  - [x] Task 2: model_manager.py — 模型列舉
    - RED: tests/test_model_manager.py — 8 tests，失敗原因：ModuleNotFoundError ✓
    - GREEN: src/velora/model_manager.py — 實作 list_cached_models() ✓
    - Test: Unit ✓（8 passed）
  - [x] Task 3: model_manager.py — 模型刪除
    - RED: tests/test_model_manager_delete.py — 9 tests，失敗原因：ModuleNotFoundError ✓
    - GREEN: 實作 delete_cached_model() ✓
    - Test: Unit ✓（13 passed + 全部 102 passed）
```

**設定彈性**：
- 測試策略可在 CLAUDE.md 預設或每次選擇（Unit / Integration / E2E）
- 獨立任務可標記 `[P]` 並行執行
- TDD 例外：拋棄式原型、生成的程式碼、設定檔（需 Human 核准）

---

### Phase 3：驗證

#### `/vif-verify` — 自動化驗證 Pipeline

**做什麼**：用新鮮的驗證證據證明程式碼品質。原則：**沒有證據就不能宣稱完成。**

**核心驗證階段**（全部執行，即使前面的失敗了）：

| 階段 | 內容 | 工具 |
|------|------|------|
| 1. Build | 建構專案 | `npm run build` 等 |
| 2. Type Check | 型別檢查 | `tsc --noEmit` 等 |
| 3. Lint | 程式碼風格 | ESLint、ruff 等 |
| 4. Test Suite | 完整測試 | 全部測試執行 |
| 5. Diff Review | 變更分析 | git diff 分析 |
| 6. Dependency Audit | 依賴安全 | `npm audit` 等 |
| 7. Security Review | 安全檢查 | OWASP Top 10 靜態分析（security-reviewer agent） |

**結果分類**：
- ✅ **PASS**：無問題
- ⚠️ **WARN**：有警告，需評估
- ❌ **FAIL**：有錯誤，必須修復

**WARN 處理**：每個 WARN 必須被評估 — 修復或記錄接受原因。沒有記錄原因的 WARN = 未評估 = 不算通過。

**驗證報告格式**：

```markdown
## 結果摘要
| 階段 | 狀態 | 說明 |
|------|------|------|
| Build | ✅ | 成功 |
| Type Check | ✅ | 0 errors |
| Lint | ⚠️ | 4 unused imports |
| Test | ✅ | 102 passed |
| Diff Review | ✅ | 變更符合 spec 範圍 |
| Audit | ⚠️ | 2 moderate (pre-existing) |
| Security | ✅ | 0 critical, 0 major |

## WARN 評估
- Lint: 4 unused imports → auto-fixed ✓
- Audit: pre-existing 上游依賴問題 → 接受 ✓

## 判定：READY for Code Review
```

**失敗時**：回到 develop 修復 → **必須重跑完整 pipeline**（不能只跑失敗的階段）

**設定彈性**：
- Code Quality 階段可選（透過 CLAUDE.md 設定或互動選擇）
- 支援多 repo 個別驗證

---

### Phase 4：審查

#### `/vif-review` — 兩階段程式碼審查

**做什麼**：確保程式碼符合規格**且**維持品質。原則：**不信任報告，自己驗證。**

**前置條件**：Phase 3 驗證通過

**Stage 1：規格符合度**（不通過就不進 Stage 2）：
- **1-1. 驗收條件核對**：每個 AC 都有對應的實作 + 測試 + 實際行為
- **1-2. 設計文件一致性**：API 實作 vs. api-spec、UI 實作 vs. ui-spec、DB 實作 vs. schema
- **1-3. 範圍確認**：變更的檔案是否在 spec 計畫內，有沒有 scope creep

**Stage 2：程式碼品質**（Stage 1 通過後才進行）：
- 架構（模組切分、職責分離、依賴方向）
- 可讀性（命名、結構、必要的註釋）
- 測試品質（行為驗證、邊界案例、是否過度 mock）
- 意圖清晰度

**Issue 嚴重度**：
| 等級 | 含義 | 處理方式 |
|------|------|---------|
| 🔴 Critical | 違反規格或破壞功能 | 必須修復 |
| 🟡 Major | 影響維護性/效能 | 應該修復 |
| 🟢 Minor | 規格外的改善建議 | 可選 |

**審查通過後**：
- 產出 **Manual Testing Checklist**（自動化無法覆蓋的項目）
- Human 完成手動測試
- Human 最終核准 → 進入 Phase 5

**修復迴圈**：發現問題 → develop 修復 → 重跑 verify（完整 pipeline）→ 重跑 review。最多 3 次循環。

---

### Phase 5：收尾

#### `/vif-close` — 開發完成與文件同步

**做什麼**：確保所有工作完成、設計文件反映最終實作、追蹤文件更新。

**前置條件**：Phase 4 審查核准

**工作內容**：

1. **設計文件同步** — 如果實作偏離了設計：
   - 更新 api-spec（API 變更）
   - 更新 ui-spec（UI 變更）
   - 更新 schema（DB 變更）
   - 目標：讓下一個讀者不會被誤導

2. **完成檢查清單**：
   - ✅ 所有 .feature scenario 都已實作 + 測試通過
   - ✅ 測試覆蓋率 ≥ 80%（核心路徑 ≥ 90%）
   - ✅ 所有 🔴 / 🟡 issue 已解決
   - ✅ Security review 通過
   - ✅ progress.md 所有階段打勾
   - ✅ specs-overview.md 狀態更新為 ✔️ done

3. **版本控制**：
   - 所有變更已 commit
   - 必要時打 git tag

---

## 支援機制

### `/vif-guideline` — 專案規範解析

**做什麼**：找到並注入專案特定的 coding guideline。不是一個獨立階段，而是被其他 skill 呼叫的服務。

**呼叫者**：`/vif-api-spec`、`/vif-ui-spec`、`/vif-develop`（test-writer / implementer）、`/vif-review`、`/vif-prototype`

**Context 對應**：

| 呼叫 Context | 載入的 Guideline |
|-------------|-----------------|
| `api-spec` | `guideline/backend/` |
| `ui-spec` | `guideline/frontend/` + `guideline/ui/` |
| `schema` | `guideline/database/` |
| `testing` | `guideline/testing/` |
| `prototype` | `guideline/ui/` |

**設定彈性**：可在 CLAUDE.md 中自訂 Guideline 映射路徑覆蓋預設值。

---

### `/vif-flow` — 流程編排與初始化

**做什麼**：專案初始化、流程導航、workspace 設定。

**功能**：
- **專案初始化**：偵測是否已設定 vif，分析現有結構並建議調整
- **Workspace 模式**：
  - Monorepo（預設）：docs/ 和 src/ 在同一個 repo
  - Multi-Repo：文件、前端、後端分別在不同 repo（路徑在 CLAUDE.md 設定）
- **Skill 路由**：根據使用者意圖導航到正確的 skill
- **升級協定**：方法失敗最多重試 3 次，系統錯誤立即升級

---

## 6 個 AI Subagent

| Agent | 職責 | 活動階段 | 工具權限 |
|-------|------|---------|---------|
| **test-writer** | TDD 的 RED 階段：撰寫失敗的測試 | Phase 2 | 完整 |
| **implementer** | TDD 的 GREEN + REFACTOR 階段：寫最少的程式碼讓測試通過 | Phase 2 | 完整 |
| **spec-auditor** | 文件一致性三階段審查（內部一致性、完整性、外部比對） | Phase 1 | 完整 |
| **verifier** | 驗證 Pipeline 執行（Build/Type/Lint/Test/Diff/Audit） | Phase 3 | Bash + Read only |
| **reviewer** | 兩階段程式碼審查（規格符合 + 品質） | Phase 4 | 完整 |
| **security-reviewer** | OWASP Top 10 靜態程式碼分析 | Phase 3 | Read only |

---

## 文件結構總覽

vif 在專案中產生的完整文件結構：

```
docs/
├── prd-001.md                          ← 產品需求文件
├── prd-002.md
├── architecture/
│   ├── adr-001-decision-name.md        ← 架構決策記錄
│   └── adr-002-another.md
├── features/                           ← BDD 行為規格（可選）
│   └── [domain]/
│       └── [name].feature
├── specs/
│   ├── specs-overview.md               ← 全域索引（狀態 + 依賴圖）
│   └── NNN-name/
│       ├── spec.md                     ← 技術規劃（作戰計畫）
│       └── progress.md                 ← TDD + 階段追蹤
├── api-specs/
│   └── [module]/
│       ├── openapi.yaml                ← OpenAPI 定義（REST API 時）
│       └── [domain]/
│           └── [name].md               ← 單支 API 的完整規格
├── ui-specs/
│   └── [module]/
│       └── [page]/
│           └── [name].md               ← 單頁面的完整規格
├── schema/
│   └── [domain].md                     ← DB Schema（DDL + 索引 + 關聯）
└── prototypes/
    └── [name].html                     ← 互動式原型（可選，通常丟棄）

guideline/
├── backend/                            ← 後端開發規範
├── frontend/                           ← 前端開發規範
├── ui/
│   └── ui-guideline.md                 ← UI 設計基礎
├── database/                           ← 資料庫規範
└── testing/                            ← 測試規範
```

---

## CLAUDE.md 設定範例

在專案的 `.claude/CLAUDE.md` 中設定 vif：

```markdown
## AI-Driven Development Flow

本專案採用 vif。

### Skills
| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | /vif-arch | 架構決策 + ADR |
| 需求 | /vif-prd | PRD 撰寫 |
| ... | ... | ... |

### Human 介入點
| Gate | Human 行為 | 說明 |
|------|-----------|------|
| PRD → Spec | Approve PRD | 確認問題定義與方向 |
| Spec → Develop | Approve Spec | 確認涉及範圍 + 設計文件 |
| Review → Close | Approve Code | 最終審查 |

### 技術棧
- 語言：Python
- 測試：pytest
- 建構：uv

### 專案指令
- Build: `uv build`
- Test: `uv run pytest`
- Lint: `uv run ruff check`

### 測試策略
- Backend: Unit + Integration
- Frontend: E2E (Playwright)
```

可依專案需求額外設定：
- **Workspace 模式**：Monorepo / Multi-Repo 路徑
- **Guideline 映射**：覆寫預設的 context → guideline 對應
- **API Spec 規範**：非 REST API 時自訂格式（如 Tauri IPC）
- **AI Cross-Review**：啟用跨技能的 AI 交叉審查
- **驗證設定**：Code Quality 階段是否啟用

---

## 實際案例：Velora 專案

Velora 是一個語音轉錄桌面應用（Tauri v2 + Svelte + Python pipeline），完整使用 vif 流程開發。

### 開發成果

- 2 份 PRD（桌面應用 + 訂閱付費）
- 3 份 ADR（進度回報策略、Supabase 後端、金流整合）
- 10 份 Spec（7 個完成、1 個進行中、2 個規劃中）
- 20+ 份 API Spec
- 10+ 份 UI Spec
- 2 份 DB Schema
- 每份 Spec 都有完整的 progress.md 追蹤紀錄

### 依賴圖

```
                ┌─────────────────────────────────────────┐
                │ prd-001 (桌面應用)                       │
                │  001 基礎轉錄                            │
                │   ├── 002 Process Overlay               │
                │   │    └── 005 模型下載 ── 006 模型管理  │
                │   └── 003 音訊播放+講者                  │
                │        └── 004 內容編輯+匯出 ──────┐    │
                └────────────────────────────────────┼────┘
                                                     │
                ┌────────────────────────────────────┼────┐
                │ prd-002 (訂閱與付費)                │    │
                │  007 帳號系統 ◄──────────────── 依賴 004 │
                │   └── 008 訂閱管理                      │
                │        └── 009 AI 點數系統              │
                └─────────────────────────────────────────┘
```

### 從 Spec 到完成的完整追蹤（Spec-006 模型管理）

| 階段 | 狀態 | 細節 |
|------|------|------|
| Phase 1: Spec | ✔️ | 12 個驗收條件、6 個任務、完整錯誤處理表 |
| Phase 2: Develop | ✔️ | 6 個任務完成、102 個測試全部通過 |
| Phase 3: Verify | ✔️ PASS | 4 個 lint issue auto-fixed、Security PASS |
| Phase 4: Review | ✔️ APPROVED | 0 Critical、2 Major（記錄後續改善）、2 Minor |
| Phase 5: Close | ✔️ | 文件同步完成 |
