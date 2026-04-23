---
name: vif-prd
description: >-
  Phase 0 - Product Requirements Document. Trigger on: "PRD", "產品需求",
  "product requirement", "問題定義", "需求文件", "要做什麼", "why build",
  "寫 PRD", "新需求".
metadata:
  version: 3.5.0
---

# Phase 0 — PRD 產品探索

釐清「解決什麼問題」與「為什麼值得解決」，產出 PRD 文件。

## Hard Gate

**PRD 未 approved，不進入 Phase 1。**

> 每個「新增功能」都需要問題定義。Todo list、單一函式工具 — 全部。
> 「簡單」的專案正是未經檢驗的假設造成最多浪費的地方。
>
> 維護性工作（修 bug、重構、調 config）見本 SKILL 下方「例外情境」。

## Stance

**你是思考夥伴，不是問卷機器。**

探索階段沒有固定腳本、沒有必須的順序、沒有強制的產出。你的角色是幫助 Human 把模糊的想法變清晰。

- **好奇而非指導** — 問自然浮現的問題，不要照清單念
- **展開而非審問** — 展開多個有趣的方向，讓 Human 選擇共鳴的
- **耐心而非急躁** — 不急著下結論，讓問題的輪廓自然顯現
- **落地而非空想** — 去看實際的 codebase，不要光靠理論
- **質疑假設** — 包括 Human 的，也包括你自己的

## Workflow

### Step 0: 來源判斷

先決定走哪條路徑：

| 情境 | 路徑 | 說明 |
|------|------|------|
| 從零開始，要與 Human 對話產出 PRD | **New Mode**（走 Step 1 → 5） | 完整 Problem Exploration |
| Human 已有外部 PRD（PM 產出、其他工具撰寫、過往文件） | **Import Mode**（跳到 Step 3.5）| 驗證 + 補齊 Section 6 + 展開 specs-overview |

**Import Mode 判斷依據：**
- Human 明確說「已經有 PRD」「這是現有需求文件」
- 提供了外部檔案路徑、連結、貼上完整需求內容
- `docs/prds/` 已有 Human 手動放入的 PRD 檔

Import Mode **不可省略** Step 5（展開 specs-overview）。specs-overview 是整個流程的骨幹，任何進入 Phase 1 的路徑都必須先經過它。

### Step 1: Pre-check（New Mode）

- 檢查 `docs/` 是否已有相關 PRD 或 spec
- 瀏覽 codebase 了解現狀，把討論建立在現實基礎上
- 避免重複工作

### Step 2: Problem Exploration

與 Human 對話釐清。以下是四個核心面向，但**不要機械式地逐條問**——根據對話自然展開：

1. **問題是什麼？** — 一句話描述痛點
2. **影響誰？** — 使用者角色與場景
3. **為什麼現在做？** — 優先級理由
4. **成功長什麼樣？** — 可衡量的預期成果

**探索指南：**

- 一次聚焦一個面向，等 Human 回答後再延伸
- 如果 Human 的回答揭示了新的方向，跟隨它
- 用 ASCII 圖表視覺化複雜的關係 — 一個好的圖表抵得上許多段落
- 如果不清楚，深入挖掘。**不要假裝理解。**
- 探索是思考時間，不是任務時間

### Step 3: Draft PRD

使用 PRD 模板（[模板解析](#模板解析) → `prd`，預設 `references/prd-template.md`），撰寫至 `docs/prds/prd-NNN.md`：

- 問題描述與證據
- 預期成果（可衡量）
- 方案選項（2-3 個，含比較表）
- 不在範圍內
- Feature/Spec 拆解建議

### Step 3.5: Import 驗證（Import Mode 專用）

**僅 Import Mode 執行。** New Mode 跳過此步。

**唯一目的：補出 Spec 拆解（Section 6），讓 Step 5 能展開 specs-overview。**
不做模板對齊、不 normalize 現有章節、不重寫內容——**尊重外部 PRD 的原樣**。

1. **收容外部 PRD**：若檔案不在 `docs/prds/prd-NNN.md`，協助放入並依現有編號規則命名；保留原始來源引用（可附在 PRD 頂部或 appendix）
2. **補出 Spec 拆解**（本步唯一實質工作）：
   - 外部 PRD 已有明確的 spec 清單 + 拆解理由 → 直接進入 Step 4
   - 沒有 / 只有模糊描述 → 與 Human 協作補出，追加一段 `## 6. 拆解為 Feature / Spec`：
     ```
     - spec-NNN [名稱] — [一句話摘要]
     - spec-NNN [名稱] — [一句話摘要]

     拆解理由：[為什麼這樣切]
     ```
   - **Section 6 不寫 metadata**（領域、依賴、狀態）→ 留到 Step 5 寫入 specs-overview
3. **不重做探索 / 不動既有章節**：問題、證據、方案選項等段落不重跑、不調整格式，信任外部 PRD 的產出
4. **編號衝突處理**：外部 PRD 若已標 `spec-NNN`，但 `specs-overview.md` 已有同編號（屬其他 PRD 的 spec）：
   - 以 **specs-overview 為權威**（不更動已存在的 spec 編號）
   - 將外部 PRD 的 `spec-NNN` 重新分配為下一個可用編號
   - 在 Section 6 附註原編號（例：`spec-005 [名稱] — ...（外部 PRD 原編 spec-001，因專案內已存在而重號）`）
   - Human 確認重號結果後，才寫入 specs-overview（Step 5）

> Import Mode 只關心一件事：**外部 PRD 能不能接上 specs-overview**。其他章節是否符合本流程的模板不重要——PRD 已 approved 的結構就是事實。

### Step 4: Deliver & Approve

- 呈現 PRD 給 Human 審查
- Human 要求修改 → 修改後重新呈現
- Human approve → 更新狀態為 `approved`

### Step 5: 展開 Spec 清單（關鍵步驟）

**PRD 的 Section 6 只是 pointer + 拆解理由，真正的 spec metadata（領域、依賴、狀態、PRD 追溯）在這一步輸入到 `docs/specs/specs-overview.md`——這是全專案 spec 的 single source of truth。**

> 這一步是整個流程的命脈。Section 6 的 spec-NNN 條目若沒進到 specs-overview，後續 `/vif-spec` 的 Entry Gate 會擋下、`/vif-god` 也取不到待辦 spec。

**引導步驟（AI 主動協助 Human 填補 metadata）：**

1. **讀取 Section 6 的 spec 清單**（名稱 + 摘要）
2. **對每個 spec 逐一補齊 specs-overview 欄位**（Section 6 不會寫這些，要在對話中與 Human 確認）：
   - **領域（module/domain）** — 看 codebase 既有目錄慣例；不確定時直接詢問 Human
   - **依賴（spec-NNN 或外部 spec）** — 從 PRD Section 7「依賴與影響」推導，不清楚就問
   - **備註** — 一句話摘要（可直接抄 Section 6）
3. **呈現填好的表格給 Human 確認**：

```
> PRD 已 approved。依 Section 6 的拆解與我們剛才確認的 metadata，
> specs-overview 更新如下：
>
> | # | 名稱 | 領域 | 狀態 | PRD | 依賴 | 備註 |
> |---|------|------|------|-----|------|------|
> | 001 | [名稱] | [領域] | — | prd-NNN | — | [摘要] |
> | 002 | [名稱] | [領域] | — | prd-NNN | 001 | [摘要] |
>
> 請確認：
>   1. 領域分類是否符合專案慣例？
>   2. 依賴關係是否正確？
>   3. 是否有遺漏的 spec 或順序問題？
```

4. Human 確認（可調整後再確認）
5. 寫入 `docs/specs/specs-overview.md`，append 到 Spec 清單表格尾端

**重要原則：**

- **metadata 只寫在 specs-overview**，不回頭補到 PRD Section 6（PRD 凍結為快照，specs-overview 才是活的）
- **缺資訊就問，不要亂猜** — 領域分類錯會影響後續 `/vif-guideline` 注入錯規範；依賴寫錯會影響 `/vif-god` 的執行順序
- **如果 Section 6 只有摘要沒有明確 spec-NNN 名稱** → 回到 Step 4 請 Human 先確認 spec 粒度再來 Step 5
- 如果 `specs-overview.md` 尚未建立（未執行 `/vif-flow` init），在此步驟一併建立

### Step 6: Commit & Next

- **commit**（`docs: add prd-NNN [名稱]`）
- 進入 Phase 1（`/vif-spec`）

## 例外情境（可跳過 Phase 0）

以下維護性工作不需要走 Phase 0，可直接進入 Phase 1 或 Phase 2。每條都附「為什麼可以跳」的判斷依據，AI 在 edge case 時據此判斷：

- **Bug fix（< 1 人天）** — 修復壞掉的東西，不是新增功能。問題已被觀察到，不需要再做問題探索。
- **技術債清理** — 重構既有邏輯，行為不變。目標是改善既有，不是回答新問題。
- **Config 變更** — 純設定調整（環境變數、旗標、部署參數），無程式碼行為變化。

> 判斷原則：若改動**會產生新的使用者可觀察行為**，就不是例外，仍需 PRD。例如「調高 timeout 閾值」若使用者會感受到差異（原本錯誤現在成功），仍屬行為變更，不能跳。
>
> **「Human 已提供完整需求文件」不是例外，而是走 Import Mode。**
> 即便 PRD 來自外部，Step 5（展開 specs-overview）仍必須執行——這是進入 Phase 1 的唯一入口。

## Exit Criteria

- [ ] PRD 文件已建立（`docs/prds/prd-NNN.md`）
- [ ] 問題定義明確
- [ ] Human 已 approve PRD
- [ ] specs-overview.md 已展開（Section 6 → — (not-started)條目）
- [ ] Human 已確認 specs-overview
- [ ] 已 commit

## 模板解析

撰寫 PRD 前先解析要用哪一份模板：

1. 讀取 CLAUDE.md 的 `Templates` 區塊是否有 `prd → <path>` 設定
   - **Monorepo** → 讀當前 repo 的 `.claude/CLAUDE.md`
   - **Multi-repo** → 讀 **docs repo** 的 `.claude/CLAUDE.md`（PRD 寫在 docs repo，Templates 設定亦放在該處）
2. **有且檔案存在** → 使用該專案模板（章節可能不同、缺某些），此時仍需確保產出包含本 skill 要求的核心資訊（對應內建 `prd-template.md` 的章節）：
   - Meta（提案人、日期、狀態）
   - 1. 問題描述
   - 2. 證據
   - 3. 預期成果（可衡量）
   - 4. 方案選項（2-3 個，含比較表）
   - 5. 不在範圍內
   - **6. 拆解為 Feature / Spec** — 這是下游 specs-overview 展開的唯一輸入
   - 7. 依賴與影響

   專案模板缺哪項就補哪項，不重寫已有的
3. **指定但檔案不存在** → 警告 Human 後 fallback 到內建模板
4. **未設定** → 使用 plugin 內建 `references/prd-template.md`

> Import Mode 跳過模板解析——外部 PRD 的章節結構就是事實，不依模板去強行對齊；僅驗證「有無 Section 6」即可。
