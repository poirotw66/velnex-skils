# 流程設計決策

本文記錄 vif 的設計決策和演進過程，說明「為什麼這樣設計」。

> 最新的流程說明見 [README.md](../README.md)。本文聚焦於**決策理由**。

## 從六階段到十一 Skills

### 初版設計（v1.0）

最初設計為線性六階段：

```
Phase 0: PRD → Phase 1: Spec → Phase 2: Develop → Phase 3: Verify → Phase 4: Review → Phase 5: Close
```

每個 Phase 對應一個 skill，BDD 包含在 Phase 1 裡。這個設計假設一個人驅動所有流程。

### 演進原因

1. **企業團隊需求** — 實際團隊有 PM、PD、SA、SD、Frontend、Backend、QA 等角色，各自負責不同的產出。線性六階段無法對應多角色並行的工作方式。

2. **BDD 不是必要的** — 有些團隊直接從 PRD + Figma 進入 Spec，不寫 .feature。BDD 應該是可選的，不應綁在 Spec 裡。

3. **設計文件應該獨立** — API Spec、UI Spec、DB Schema 是不同角色在不同時間產出的，不應全部塞在一個 Spec skill 裡。

4. **缺少架構決策階段** — 專案啟動時的技術棧和架構選擇沒有被結構化記錄。

### 現行設計（v2.0）

拆分為 11 個獨立 skills，支援兩種模式：

| 類別 | Skill | v1 對應 | 拆分原因 |
|------|-------|---------|---------|
| 架構 | vif-arch | 無 | 新增：架構決策需要被記錄 |
| 需求 | vif-prd | Phase 0 | 保留 |
| 行為 | vif-bdd | Phase 1 的一部分 | 抽出：BDD 是可選的 |
| 規劃 | vif-spec | Phase 1 | 重新定義：聚焦影響分析 |
| 設計 | vif-ui-spec | Phase 1 的一部分 | 抽出：Frontend 獨立產出 |
| 設計 | vif-api-spec | Phase 1 的一部分 | 抽出：Backend 獨立產出 |
| 開發 | vif-develop | Phase 2 | 加入測試策略選擇 |
| 驗證 | vif-verify | Phase 3 | 重構為 Core + Optional |
| 審查 | vif-review | Phase 4 | 加入設計文件合規 |
| 收尾 | vif-close | Phase 5 | 移除重複驗證，加入 Design Doc Sync |
| 總覽 | vif-flow | 無 | 新增：兩種模式的 routing |

## 兩種模式的設計決策

### 為什麼需要兩種模式？

**模式一（完全自動化）** 適合：
- Solo 開發者或小團隊
- AI 能力足以覆蓋所有角色
- 需要快速迭代的專案

**模式二（輔助自動化）** 適合：
- 有明確角色分工的企業團隊
- 有 Figma 設計流程的專案
- 需要多人協作的大型專案

### 共用 vs 獨立

兩種模式**共用同一套 skills**，差別在於：
- 模式一：由 `/vif-flow` 編排，線性推進
- 模式二：各角色獨立使用，並行工作

這個設計避免了維護兩套不同的 skill 定義。

## Agent 設計決策

### 為什麼是 6 個 agent？

| Agent | 存在理由 |
|-------|---------|
| test-writer | TDD 紀律：分離 RED 和 GREEN，防止實作影響測試設計 |
| implementer | TDD 紀律：只看測試寫最小實作，Status Code 回報機制 |
| verifier | 工具限制：Bash + Read only，防止驗證過程修改程式碼 |
| security-reviewer | 工具限制：Read only，防止安全檢查時執行危險命令 |
| spec-reviewer | Context 隔離：獨立於 spec 撰寫者的視角 |
| reviewer | Context 隔離：獨立於開發者的視角，Don't Trust the Report |

### 不需要 agent 的 skills

vif-arch、vif-prd、vif-bdd、vif-ui-spec、vif-api-spec、vif-close 不需要 agent，因為：
- 沒有需要限制的工具
- 是與 Human 互動的過程
- 不需要 Context 隔離

## Spec 的影響分析設計

### 為什麼「影響分析」是 Spec 的核心？

> 修改既有比新增更危險。

大多數的 bug 不是來自新功能，而是來自對既有功能的意外影響。因此 vif-spec 的第一步不是「開始規劃」，而是「掃描現有設計文件，判斷哪些是新增、哪些是修改」。

### 新增 vs 修改的標記

```
| 動作 | API | 現有 ApiSpec |
|------|-----|-------------|
| 新增 | POST /auth/login | — |
| 修改 | GET /users/:id | docs/api-specs/iam/user/get-user.md |
```

「修改」項目需要特別關注：
- 是否 breaking change？
- 既有的測試還能通過嗎？
- 其他模組有依賴這個 API 嗎？

## Verify 的 Core + Optional 設計

### 為什麼分層？

不是每次都需要跑完所有檢查：

**Core（必跑）**：Build、Type Check、Lint、Test Suite、Diff Review、Security Review
- 這些是基本品質門檻，沒有通過就不應該進入 review

**Optional（可選）**：Code Quality（`/simplify`）、Design Doc Consistency
- Code Quality 依賴 Claude Code 環境，非 Claude Code 無法使用
- Design Doc Consistency 只在有設計文件時才有意義

### 為什麼 Security 是必跑？

Security Review 不是可選的。即使是小改動，也可能引入安全漏洞。

### 為什麼 Code Quality 用 `/simplify`？

`/simplify` 是 Claude Code 的內建 skill，已經有完整的三維度檢查（Reuse、Quality、Efficiency）。重新實作相同功能沒有意義。

但 `/simplify` 依賴 Claude Code 環境，所以標記為 Optional — 非 Claude Code 環境改由人工處理。

## 設計文件的累積型 vs per-feature 設計

### 兩種文件模式

| 模式 | 文件 | 性質 |
|------|------|------|
| per-feature | PRD、.feature、spec.md、progress.md | 隨 feature 生滅 |
| 累積型 | api-spec、ui-spec、schema、ADR | 跨 feature 持續維護 |

### 為什麼需要累積型設計文件？

per-feature 的 spec.md 回答「這次要做什麼」，但不回答「整個系統目前長什麼樣」。

累積型設計文件是**全域的 source of truth**：
- API Spec + openapi.yaml — 所有 API 的完整規格
- UI Spec — 所有頁面的完整規格
- Schema — 所有 table 的完整定義

新的 spec.md 在規劃時先讀取這些文件，確認不衝突，開發完成後更新它們。

### 靈感來源

這個設計參考了實際企業專案的文件結構（獨立的 api-specs、ui-specs、schema 目錄），以及 OpenSpec 的「specs 是 source of truth」概念。

## Commit 策略

### 為什麼在每個階段都 commit？

每個 Human approve 點都是一個有意義的里程碑：
- PRD approved → 問題定義確認
- Spec approved → 技術方案確認
- 設計文件完成 → 設計產出確認

如果中途需要回退，可以精確回到任何一個決策點。

### 開發階段的 commit 粒度

選擇 per-scenario 而非 per-task：
- per-task 太碎（一個 scenario 可能 1-3 tasks）
- per-scenario 是有意義的最小交付單位
- 一個 scenario 對應一個完整的行為

## 參考資料

- 框架分析：[03-framework-analysis.md](./03-framework-analysis.md)
- 方法論關聯：[04-methodology-relationships.md](./04-methodology-relationships.md)
- 完整流程說明：[README.md](../README.md)
