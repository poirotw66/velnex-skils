---
name: vif-spec
description: >-
  Phase 1 - Technical specification and impact analysis. Trigger on: "spec", "規格",
  "設計", "寫規格", "spec design", "技術設計", "技術規劃", "impact analysis",
  "影響分析", "scope planning".
metadata:
  version: 3.3.1
---

# Phase 1 — Spec 技術規劃與影響分析

分析需求的技術影響範圍，規劃需要的 API、頁面、DB Table，產出 spec.md 作為開發的作戰計畫。

## Hard Gate

**Spec 未 approved，不進入設計文件撰寫（api-spec / ui-spec / schema）、不進入開發。**

> 規格不服務程式碼，程式碼服務規格。
> 跳過 spec 寫出來的程式碼，是在回答一個沒人問過的問題。

## Stance

**Spec 是作戰計畫，不是設計細節。**

- Spec 回答「要做什麼、涉及哪些模組、怎麼分工」
- 設計細節（API 邏輯、頁面互動、DB 欄位）交給 `/vif-api-spec` 和 `/vif-ui-spec`
- **影響分析是核心** — 判斷哪些是新增、哪些是既有受影響的，比寫新東西更重要

## Workspace

> Multi-repo 下，所有 `docs/` 路徑透過 workspace 設定解析。見 `/vif-flow` Workspace Mode。

| 操作 | 位置 |
|------|------|
| 讀/寫 PRD、spec、api-spec、ui-spec、schema、.feature | docs repo |
| 讀取既有程式碼（影響分析） | code repo（可能多個） |
| 讀取架構文件（ADR） | docs repo |

## 輸入

- **必要**：PRD（`docs/prds/prd-NNN.md`）
- **UI 來源**：Figma / Prototype / URL（如有，Step 1 確認後記入 spec.md，下游 skill 必須遵循）
- **參考**：.feature（`docs/features/` — 如有，來自 `/vif-bdd`）
- **參考**：既有設計文件（`docs/api-specs/`、`docs/ui-specs/`、`docs/schema/`）

## Workflow

```
Step 1            Step 2              Step 3             Step 4
影響分析      →   撰寫 spec.md    →   選擇展開         →   Review
(掃描現有)        (作戰計畫)          (api/ui/schema)       (Auto + Human)
```

### Step 1: 影響分析

**這是 Spec 最重要的步驟。**

1. 讀取 PRD + .feature（如有）
2. **確認 UI 來源** — 詢問是否有 Figma / Prototype / URL 需要遵循。有的話記入 spec.md Meta 的「UI 來源」欄位，後續所有 skill 必須讀取並遵循
3. **讀取既有程式碼** — 瀏覽 codebase，了解現有架構、既有的預設值、資料結構、生命週期
4. **讀取相關文件** — 架構文件（ADR）、其他 spec、使用 `/vif-guideline` 取得相關規範
5. **掃描現有設計文件**（使用 frontmatter 快速比對）：
   ```
   a. Glob docs/api-specs/**/*.md + docs/ui-specs/**/*.md + docs/schema/**/*.md
   b. 讀取每個檔案的 frontmatter（--- 區塊內的 YAML metadata）
   c. 綜合判斷相關性（不限於同 domain/module，跨域關聯也要納入）
   d. Read 僅載入相關文件全文
   ```
6. **確認動作類型**：比對 scan 結果，分類為四種動作：
   - **不存在** → 新增
   - **已存在，核心用途不變，僅需調整** → 修改
   - **已存在，但以下任一條件成立** → **取代**：
     a. 需要拆分為多支 API
     b. Request/Response 預期變動 >50%
     c. 既有 API 服務的角色/流程與新需求根本不同
   - **已存在，不需改動，開發時直接引用** → **參考**
   > 拿不準「修改」還是「取代」時，選「取代」比較安全。修改假設既有設計可用；取代不做此假設。
7. **交叉驗證** — spec 中的假設（預設值、格式、行為）是否與既有程式碼和文件一致

> **不要憑印象寫 spec。** 每一個預設值、資料格式、行為假設，都去 code 和文件裡確認。
> 寫在 spec 裡的東西如果跟 code 矛盾，開發時就會出問題。

產出影響分析表：

```
### 頁面
| 動作 | 頁面 | 說明 | 現有 UISpec |
|------|------|------|------------|
| 新增 | 登入頁 | 帳密登入 | — |
| 修改 | Header | 加入登入/登出按鈕 | docs/ui-specs/common/header.md |
| 參考 | Dashboard | 不需改動 | docs/ui-specs/common/dashboard.md |

### API
| 動作 | API | Method + Path | 說明 | 現有 ApiSpec |
|------|-----|--------------|------|-------------|
| 新增 | 登入 | POST /auth/login | 帳密驗證 | — |
| 新增 | 刷新 | POST /auth/refresh | 換新 token | — |
| 修改 | 取得使用者 | GET /users/:id | 回傳加入 lastLoginAt | docs/api-specs/iam/user/get-user.md |
| 取代 | 建立帳號 | POST /users | 拆為邀請+註冊兩支（原 create-user） | — |
| 參考 | 刪除帳號 | DELETE /users/:id | 不需改動 | docs/api-specs/iam/user/delete-user.md |

### DB
| 動作 | Table | 說明 | 現有 Schema |
|------|-------|------|------------|
| 新增 | login_attempts | 登入失敗紀錄 | — |
| 修改 | users | 加 last_login_at 欄位 | docs/schema/iam-auth.md |
```

> **修改/取代既有比新增更危險。** 修改/取代項目需特別標記，確認不會 breaking 既有功能。
>
> Step 1 的影響分析表是**工作底稿**。Step 2 寫入 spec.md 時，依 `references/spec-template.md` 的正式格式整理。

### Step 2: 撰寫 spec.md

使用 spec 模板（`references/spec-template.md`），撰寫技術規劃。

spec.md 是**作戰計畫**：
- 背景與設計原則
- 涉及範圍（Step 1 的影響分析表）
- 業務規則
- 驗收條件

**命名職責**：Spec 階段決定所有設計文件的檔案路徑，下游 skill 嚴格遵循。

1. 掃描目標目錄（如 `docs/api-specs/[module]/`）既有檔案，分析命名慣例
2. 依分析結果決定是否需要使用者確認：
   - **單一明確慣例**（如全部都是 `PRJ-PMO-NNN-slug.md`）→ 直接沿用
   - **多種慣例混合 / 無法歸納出規則** → 列出偵測結果，請使用者指定要遵循的慣例
   - **無既有檔案（新專案/新模組）** → 詢問使用者偏好的命名慣例
3. 依確定的慣例命名所有新增/取代項目，填入 Section 4 對應欄位和 progress.md 路徑欄
4. 下游 skill（`/vif-api-spec`、`/vif-ui-spec`）必須嚴格使用此處定義的路徑建立檔案
5. 偏差流程中核准的新增項目 → 由該 skill 依相同慣例命名，同步更新 Spec Section 4 和 progress.md

**可選：任務拆解（Section 6）**
- 模式一（AI 驅動）：拆解為 2-5 分鐘粒度的任務
- 模式二（團隊分工）：可省略，由各 PG 自行拆解

同時建立 `progress.md`（`references/progress-template.md`），**包含設計文件追蹤表**：

1. 從 Section 4 影響分析表提取動作為「新增」「修改」「取代」的設計文件項目（ApiSpec、UISpec、Schema）
2. **「參考」項目不納入追蹤**（不需要撰寫設計文件）
3. 如有 .feature → 加入 Feature 列，狀態標為「完成」
4. 所有待撰寫的設計文件 → 狀態標為「待撰寫」、自審標為 ⬜
5. 備註欄：正常按計畫項目填「—」
6. 如不需要展開設計文件（Bug fix 等）→ 使用跳過格式：`- [x] 不需要展開設計文件 — [原因]`

> **progress.md 與 Spec Section 4 的關係**：
> progress.md 設計文件表從 Spec Section 4 衍生。兩者必須同步：
> - Spec Section 4 增減項目 → 同步更新 progress.md
> - 偏差流程核准新項目 → 同時更新 Spec Section 4 和 progress.md
> - 兩者不一致時，以 Spec Section 4 為權威來源（progress.md 重建）
>
> progress.md 的設計文件表是 **Design Docs → Develop 的 gate 依據**。
> vif-develop 進入前會讀取此表，確認所有項目完成且自審通過。

**存放位置：** `docs/specs/NNN-name/spec.md`

### Step 3: 選擇展開

Spec 撰寫完成後，根據影響分析表，詢問 Human：

```
> Spec 規劃完成。涉及範圍：
>   - API：3 支待撰寫（2 新增, 1 取代）+ 1 支參考
>   - 頁面：2 個待撰寫（1 新增, 1 修改）+ 1 個參考
>   - DB：1 張新增, 1 張修改
>
> 要展開設計文件嗎？
>   A. 展開全部（呼叫 /vif-api-spec + /vif-ui-spec）
>   B. 只展開 API Spec（呼叫 /vif-api-spec）
>   C. 只展開 UI Spec（呼叫 /vif-ui-spec）
>   D. 不展開（只留清單，待各角色展開）
```

選擇 A/B/C → 引導使用 `/vif-api-spec` 和/或 `/vif-ui-spec`
選擇 D → 各角色稍後自行展開

### Step 4: Review

**Stage A — 自動審查（Spec Auditor subagent）：**

派遣 `spec-auditor` agent：

**Dispatch Parameters:**
- scope: `spec`
- targets: spec.md + .feature 檔案路徑（如有）

審查項目：
1. 審查影響分析是否完整（有沒有漏掉的模組）
2. 審查 .feature 與 spec 的一致性（如有 .feature）
3. 審查 spec.md 技術可行性

所有 findings（含 Low）一律修正 → 再次派遣 spec-auditor 審查。最多 5 次迭代。

> Spec 是施工藍圖，修文字成本極低，不留小問題到開發階段放大。

**Stage B — 自我審視（AI 反思）：**

spec-auditor 通過後，交給 Human 之前，AI 重新讀一遍完整 spec 進行反思：

1. **開發者視角** — 拿到這份 spec 能不能直接開工？任務清單的每個 task 都有明確的 spec ref 嗎？
2. **邏輯連貫** — Section 4（涉及範圍）、Section 6（任務清單）、Section 7（驗收條件）三者是否對得上？
3. **無模糊地帶** — 有沒有用詞模糊、可能被不同方式解讀的描述？
4. **可驗證性** — 每一條驗收條件都能寫成測試嗎？無法測試的條件要改寫

> 發現問題就直接修正，不需要再跑 spec-auditor。重大修改才重跑。

**AI Cross-Review（可選）：**

讀取 CLAUDE.md `AI Cross-Review` 設定，`design` 已啟用時：

- **team mode** → 與 spec-auditor 同時平行觸發，傳入 spec.md（+ .feature 如有）
- **solo mode** → 此處跳過。所有設計文件完成後，spec-auditor Pass 3 與 AI CLI 統一平行觸發，傳入全部設計文件

執行：spec-auditor 與設定的 AI CLI 平行進行獨立審查 → 兩方完成後比對結果 → 有新發現則修正後重跑 spec-auditor。

**Stage C — Human 審查：**

自我審視完成後，呈現給 Human **完整產出**：
- 影響分析表
- spec.md（作戰計畫）
- 已展開的設計文件（如有）
- .feature（如有）

Human approve → **commit**（`docs: add spec-NNN [名稱]`）

### 進入開發的前置條件

Spec approved 後，讀取 `progress.md` 的**設計文件表**判斷是否可進入開發：

- **有「待撰寫」項目** → **不可以進入開發**。提示使用者先完成設計文件（`/vif-api-spec`、`/vif-ui-spec`）
- **有自審 ⬜ 未完成** → **不可以進入開發**。提示使用者先完成自我審查
- **Pass 3 未勾選** → 需執行交叉比對後才能進入開發
- **全部完成** → 可進入 `/vif-develop`
- **跳過 checkbox 已勾選** → 直接進入 `/vif-develop`

> Gate 由 `vif-develop` 的 entry gate 執行，見 vif-develop Prerequisites。

## God Mode Override

被 `/vif-god` 驅動時，以下行為變更：

| 步驟 | 正常流程 | God Mode |
|------|---------|----------|
| Step 2 方向選擇 | 可選多方案，Human 決定 | AI 依據 PRD + codebase 慣例選最合理方案，記錄理由到 Results Report Decisions Made |
| Step 3 選擇展開 | 問 Human A/B/C/D | 自動選 A（展開全部） |
| Step 4 Stage C | Human approve → commit | spec-auditor 通過 + AI 自我審視完成 → 自動 commit（不等 Human） |
| 任務拆解 Section 6 | 可選 | **必要**（God Mode 的 TDD Loop 依賴任務清單） |

## Exit Criteria

- [ ] 影響分析完成（新增 / 修改 / 取代 / 參考 項目已識別）
- [ ] spec.md 已建立
- [ ] progress.md 已建立
- [ ] specs-overview.md 已更新
- [ ] 自動審查通過
- [ ] Human 已 approve（God Mode: 自動放行）
- [ ] 已 commit
- [ ] progress.md 設計文件表已填入（從 Section 4 自動產生），或已標記為不需要展開
