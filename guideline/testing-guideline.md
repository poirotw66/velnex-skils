# 測試規範

## 核心原則

### TDD 是硬性約束

沒有失敗的測試，不寫 production code。

```
正確的順序：寫測試（RED）→ 寫實作（GREEN）→ 重構（REFACTOR）
錯誤的順序：寫實作 → 補測試
```

如果在沒有測試的情況下寫了 production code → 刪掉，從測試開始。

### 逐任務 TDD

不要一次寫完所有測試再實作。按照 spec.md 任務清單，每個任務獨立走完 RED → GREEN → REFACTOR。

## 測試金字塔

```
        ╱╲
       ╱ E2E ╲         少量（完整使用者流程，Phase 3 Verify 做）
      ╱────────╲
     ╱ Integration╲    適量（跨模組互動）
    ╱──────────────╲
   ╱  Unit Tests    ╲  大量（單一函式/方法）
  ╱──────────────────╲
```

| 類型 | 何時寫 | 特色 | 執行速度 |
|------|--------|------|---------|
| Unit | 每個任務都寫 | 隔離、快速、明確 | 毫秒級 |
| Integration | 跨模組任務寫 | 驗證模組互動 | 秒級 |
| E2E | Phase 3 或獨立任務 | 驗證完整流程 | 數秒~分鐘 |

**預設是 Unit test。** 除非任務明確涉及跨模組互動，否則先寫 Unit。

## 覆蓋率目標

| 範圍 | 目標 |
|------|------|
| 整體 | ≥ 80% |
| 核心邏輯（UseCase / Service） | ≥ 90% |

細分模組的覆蓋率目標由各專案自行在此檔案擴充。

## 測試命名

用 **行為描述**，不用實作描述：

```typescript
// ✅ 好：描述行為和預期結果
test('expired token should be rejected with clear error message')
test('new reset request should invalidate previous tokens')
test('rate limit should block after 3 requests per hour')

// ❌ 壞：描述實作
test('validateToken returns false')
test('database query filters expired')
test('counter increments')
```

命名格式建議：`[subject] should [expected behavior] [when condition]`

## 測試結構

使用 Arrange-Act-Assert（AAA）結構：

```typescript
test('expired token should be rejected', () => {
  // Arrange — 設定前置條件
  const token = createResetToken('alice@example.com');
  advanceTime(2 * 60 * 60 * 1000); // 2 小時後

  // Act — 執行動作
  const result = () => resetPassword(token, 'newPass123');

  // Assert — 驗證結果
  expect(result).toThrow('連結已過期，請重新申請');
});
```

每個測試只驗證一個行為。如果一個測試有多個 Assert，考慮拆分。

## 從 .feature 到測試的轉化

`.feature` scenario 直接映射為測試：

```gherkin
# .feature
Example: 過期 token 被拒絕
  Given 用戶 "alice@example.com" 已請求密碼重設
  When 用戶在 2 小時後使用 token 重設密碼
  Then 應顯示 "連結已過期，請重新申請"
```

```typescript
// 測試
test('expired token should be rejected', () => {
  // Given
  const token = createResetToken('alice@example.com');
  // When（2 小時後）
  advanceTime(2 * 60 * 60 * 1000);
  // Then
  expect(() => resetPassword(token, 'newPass123'))
    .toThrow('連結已過期，請重新申請');
});
```

## 測試品質原則

### 1. 測試獨立
每個測試不依賴其他測試的執行結果或順序。使用 `beforeEach` 重設狀態，不要在測試間共享可變狀態。

### 2. 測試可讀
測試是活的文件。讀測試就能理解系統行為，不需要額外解釋。

### 3. 不要測試實作細節
```typescript
// ❌ 測試實作細節（脆弱）
expect(service.internal_cache.size).toBe(1);

// ✅ 測試行為（穩定）
expect(service.getUser('alice')).toBeDefined();
```

### 4. 邊界案例由 .feature 驅動
如果 .feature 沒有列出某個邊界案例，不要自己在測試中加。回報給 spec-writer 更新 .feature，讓行為規格保持為單一來源。

### 5. 失敗訊息要有意義
```typescript
// ❌ 不知道為什麼失敗
expect(result).toBeTruthy();

// ✅ 清楚知道期望什麼
expect(result.status).toBe('expired');
```

## RED 的有效性

確認 RED 測試是「正確地失敗」：

| 失敗類型 | 有效 RED？ | 處理方式 |
|---------|----------|---------|
| 功能尚未實作 | ✅ 有效 | 繼續進入 GREEN |
| import 路徑錯誤 | ❌ 無效 | 修正 import 後重新確認 |
| 語法錯誤 | ❌ 無效 | 修正語法後重新確認 |
| 測試框架設定問題 | ❌ 無效 | 修正設定後重新確認 |
| 測試在沒有實作時就通過 | ❌ 測試有 bug | 測試沒有真正驗證行為，重寫 |
