---
name: vif-spec
description: >-
  Technical specification and impact analysis. Trigger on: "spec", "規格",
  "設計", "寫規格", "spec design", "技術設計", "技術規劃", "impact analysis",
  "影響分析", "scope planning".
metadata:
  version: 2.1.2
---

# Spec — 技術規劃與影響分析

分析需求的技術影響範圍，規劃需要的 API、頁面、DB Table，產出 spec.md 作為開發的作戰計畫。

## Hard Gate

**Spec 未 approved，不進入開發。**

> 規格不服務程式碼，程式碼服務規格。
> 跳過 spec 寫出來的程式碼，是在回答一個沒人問過的問題。

## Stance

**Spec 是作戰計畫，不是設計細節。**

- Spec 回答「要做什麼、涉及哪些模組、怎麼分工」
- 設計細節（API 邏輯、頁面互動、DB 欄位）交給 `/vif-api-spec` 和 `/vif-ui-spec`
- **影響分析是核心** — 判斷哪些是新增、哪些是既有受影響的，比寫新東西更重要

## 輸入

- **必要**：PRD（`docs/prd-NNN.md`）
- **參考**：Figma 畫面（圖片 / MCP / 結構化描述）
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

1. 讀取 PRD + Figma + .feature（如有）
2. **讀取既有程式碼** — 瀏覽 codebase，了解現有架構、既有的預設值、資料結構、生命週期
3. **讀取相關文件** — 架構文件（ADR）、其他 spec、guideline
4. 掃描現有設計文件：
   - `docs/api-specs/` — 既有 API 設計
   - `docs/ui-specs/` — 既有頁面設計
   - `docs/schema/` — 既有 DB 設計
5. 判斷每個項目是**新增**還是**修改既有**
6. **交叉驗證** — spec 中的假設（預設值、格式、行為）是否與既有程式碼和文件一致

> **不要憑印象寫 spec。** 每一個預設值、資料格式、行為假設，都去 code 和文件裡確認。
> 寫在 spec 裡的東西如果跟 code 矛盾，開發時就會出問題。

產出影響分析表：

```
### 頁面
| 動作 | 頁面 | 說明 | 現有 UISpec |
|------|------|------|------------|
| 新增 | 登入頁 | 帳密登入 | — |
| 修改 | Header | 加入登入/登出按鈕 | docs/ui-specs/common/header.md |

### API
| 動作 | API | Method + Path | 說明 | 現有 ApiSpec |
|------|-----|--------------|------|-------------|
| 新增 | 登入 | POST /auth/login | 帳密驗證 | — |
| 新增 | 刷新 | POST /auth/refresh | 換新 token | — |
| 修改 | 取得使用者 | GET /users/:id | 回傳加入 lastLoginAt | docs/api-specs/iam/user/get-user.md |

### DB
| 動作 | Table | 說明 | 現有 Schema |
|------|-------|------|------------|
| 新增 | login_attempts | 登入失敗紀錄 | — |
| 修改 | users | 加 last_login_at 欄位 | docs/schema/iam-auth.md |
```

> **修改既有比新增更危險。** 修改項目需特別標記，確認不會 breaking 既有功能。

### Step 2: 撰寫 spec.md

使用 spec 模板（`references/spec-template.md`），撰寫技術規劃。

spec.md 是**作戰計畫**：
- 背景與設計原則
- 涉及範圍（Step 1 的影響分析表）
- 業務規則
- 驗收條件

**可選：任務拆解（Section 6）**
- 模式一（AI 驅動）：拆解為 2-5 分鐘粒度的任務
- 模式二（團隊分工）：可省略，由各 PG 自行拆解

同時建立 `progress.md`（`references/progress-template.md`）。

**存放位置：** `docs/specs/NNN-name/spec.md`

### Step 3: 選擇展開

Spec 撰寫完成後，根據影響分析表，詢問 Human：

```
> Spec 規劃完成。涉及範圍：
>   - 3 支 API（2 新增, 1 修改）
>   - 2 個頁面（1 新增, 1 修改）
>   - 2 張 Table（1 新增, 1 修改）
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

**Stage A — 自動審查（Spec Reviewer subagent）：**

派遣 `spec-reviewer` agent：

1. 審查影響分析是否完整（有沒有漏掉的模組）
2. 審查 .feature 與 spec 的一致性（如有 .feature）
3. 審查 spec.md 技術可行性
4. 最多 5 次自動迭代

**Stage B — Human 審查：**

自動審查通過後，呈現給 Human **完整產出**：
- 影響分析表（新增 vs 修改）
- spec.md（作戰計畫）
- 已展開的設計文件（如有）
- .feature（如有）

Human approve → **commit**（`docs: add spec-NNN [名稱]`）

## Exit Criteria

- [ ] 影響分析完成（新增 / 修改 項目已識別）
- [ ] spec.md 已建立
- [ ] progress.md 已建立
- [ ] specs-overview.md 已更新
- [ ] 自動審查通過
- [ ] Human 已 approve
- [ ] 已 commit
