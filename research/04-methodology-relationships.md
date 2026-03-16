# SDD、BDD、TDD、EDD 的關聯性

## 層次關係

由上往下是「範圍縮小、精確度增加」的過程：

- **SDD** 回答「我們要建什麼？為什麼？」→ 功能/模組級
- **BDD** 回答「系統的行為是否符合業務需求？」→ 使用者場景級
- **TDD** 回答「這段程式碼是否正確運作？」→ 函式/方法級
- **EDD** 回答「AI agent 是否可靠地完成任務？」→ Agent 可靠性級

## 三層模型 + 橫切關注點

```
┌─────────────────────────────────────────────┐
│  SDD（Spec-Driven Development）             │  ← 意圖層：定義「為什麼」和「做什麼」
│  規格驅動開發                                │     PRD + Spec → AI 的 prompt
├─────────────────────────────────────────────┤
│  BDD（Behavior-Driven Development）         │  ← 行為層：定義「系統應該怎麼表現」
│  行為驅動開發                                │     .feature（Gherkin）→ 行為規格
├─────────────────────────────────────────────┤
│  TDD（Test-Driven Development）             │  ← 實作層：定義「程式碼應該怎麼運作」
│  測試驅動開發                                │     Unit test → Production code
└─────────────────────────────────────────────┘
  ═══════════════════════════════════════════════
  EDD（Eval-Driven Development）                ← 橫切關注點（Cross-Cutting Concern）
  評估驅動開發                                      驗證「AI agent 是否可靠」
  pass@k/pass^k → Agent 可靠性量化                  適用於所有層次
```

SDD、BDD、TDD 三者是由上往下的分解關係。EDD 不在這個堆疊中，而是一個 **橫切關注點**（類似架構中的 logging / security）— 它驗證的是「產出程式碼的 AI 是否可靠」，而非程式碼本身，適用於所有層次。

## 串接方式（以「密碼重設」為例）

**Step 1 — SDD 規格**：

```markdown
## 功能：密碼重設
### 目的
用戶忘記密碼時，能透過 email 安全地重設密碼。
### 約束
- Token 有效期 1 小時
- 新請求會使舊 token 失效
- 每小時最多 3 次請求（防濫用）
```

**Step 2 — BDD 場景**：

```gherkin
Feature: 密碼重設

  Rule: Token 有效期 1 小時
    Example: 在有效期內重設成功
      Given 用戶 "alice@example.com" 已請求密碼重設
      When 用戶在 30 分鐘內使用 token 重設密碼
      Then 密碼應更新成功

    Example: 過期 token 被拒絕
      Given 用戶 "alice@example.com" 已請求密碼重設
      When 用戶在 2 小時後使用 token 重設密碼
      Then 應顯示 "連結已過期，請重新申請"
```

**Step 3 — TDD 測試**：

```typescript
test('expired token should be rejected', () => {
  const token = createResetToken('alice@example.com');
  advanceTime(2 * 60 * 60 * 1000);
  expect(() => resetPassword(token, 'newPass123'))
    .toThrow('連結已過期，請重新申請');
});
```

**Step 4 — EDD 驗證**（AI 協作時新增）：

```typescript
// eval: AI agent 生成密碼重設功能的可靠性
const eval = {
  name: 'password-reset-generation',
  runs: 5,  // 跑 5 次
  grader: 'code-based',
  criteria: [
    'all TDD tests pass',
    'no hardcoded tokens',
    'rate limiting implemented',
  ],
  metrics: {
    'pass@5': 'target >= 99%',   // 5 次內至少成功一次
    'pass^5': 'target >= 80%',   // 5 次都成功的機率
  }
};
```

## 核心工作流（含 EDD）

```
SDD 規格  ──拆解──▶  BDD 場景  ──驅動──▶  TDD 測試  ──生成──▶  程式碼  ──驗證──▶  EDD
   │                    │                    │                   │                │
   │     回饋發現       │    回饋遺漏        │    回饋設計       │   回饋品質     │
   ◀────────────────────◀────────────────────◀───────────────────◀────────────────┘
```

**向下**是「分解」：大規格 → 行為場景 → 單元測試 → AI 可靠性驗證。**向上**是「回饋」：EDD 發現 AI 不可靠 → 回頭檢查測試/場景/規格。

## 在 AI 協作中的角色分配

| 層次 | 人的角色 | AI 的角色 |
|------|---------|----------|
| SDD | 定義意圖、約束、審查技術設計 | 草擬 spec、發現遺漏、任務拆解 |
| BDD | 主導 Example Mapping、確認場景 | 將範例寫成 .feature、建議邊界案例 |
| TDD | 審查測試品質 | 從 .feature 生成測試 + production code |
| EDD | 定義 eval 標準、審查指標 | 執行 eval、產出可靠性報告 |

**關鍵洞察：越上層越需要人的判斷，越下層越適合 AI 加速。EDD 是橫切關注點，驗證的是 AI 本身而非程式碼。**

## 選擇組合

| 情境 | 建議組合 |
|------|---------|
| 新產品從 0 到 1 | SDD + BDD + TDD（完整走一遍） |
| 既有產品加功能 | BDD + TDD（規格已在既有文件中） |
| 修 bug | TDD 即可（先寫重現 bug 的測試） |
| AI 主導生成大量程式碼 | SDD + TDD + EDD（規格約束 + 測試護欄 + 可靠性驗證） |
| 跨團隊協作、需求常變 | BDD 為主（建立共識比寫測試更重要） |
| 高風險/合規場景 | SDD + BDD + TDD + EDD（全部走一遍） |

## 核心差異總表

| 面向 | SDD | BDD | TDD | EDD |
|------|-----|-----|-----|-----|
| 回答的問題 | 我們要建什麼？為什麼？ | 系統的行為是否符合業務需求？ | 這段程式碼是否正確運作？ | AI agent 是否可靠？ |
| 產出物 | Markdown 規格文件 | Gherkin Feature 檔案 | Unit Test | Eval report + 指標 |
| 參與者 | PM + 架構師 + AI | 業務 + 開發 + 測試 | 開發者 + AI | 開發者 + AI |
| 粒度 | 功能/模組級 | 使用者場景級 | 函式/方法級 | Agent 任務級 |
| 與 AI 的關係 | 規格 = AI 的 prompt | scenario = AI 的驗收標準 | test = AI 的護欄 | eval = AI 的品質量化 |
| 何時需要 | 新功能定義 | 複雜業務規則 | 所有程式碼 | AI 大量生成時 |
