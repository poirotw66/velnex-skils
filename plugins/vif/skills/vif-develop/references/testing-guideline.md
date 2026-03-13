# Testing Guideline

## TDD 硬性約束

沒有失敗的測試，不寫 production code。這不是建議，是約束。

```
正確：寫測試（RED）→ 寫實作（GREEN）→ 重構（REFACTOR）
錯誤：寫實作 → 補測試
```

寫了 production code 但沒有先寫測試 → 刪掉，從測試開始。

## 逐任務 TDD

不要一次寫完所有測試再實作。按 spec.md 任務清單，每個任務獨立走完 RED → GREEN → REFACTOR。

## 測試金字塔

```
        /\
       / E2E \         少量（完整使用者流程）
      /--------\
     / Integration\    適量（跨模組互動）
    /--------------\
   /  Unit Tests    \  大量（單一函式/方法）
  /------------------\
```

| 類型 | 何時寫 | 執行速度 |
|------|--------|---------|
| Unit | 每個任務都寫 | 毫秒級 |
| Integration | 跨模組任務寫 | 秒級 |
| E2E | Phase 3 或獨立任務 | 數秒~分鐘 |

**預設是 Unit test。**

## 覆蓋率目標

| 範圍 | 目標 |
|------|------|
| 整體 | ≥ 80% |
| 核心邏輯（UseCase / Service） | ≥ 90% |

## 測試命名

用**行為描述**，不用實作描述：

```typescript
// ✅ 好
test('expired token should be rejected with clear error message')
test('new reset request should invalidate previous tokens')

// ❌ 壞
test('validateToken returns false')
test('database query filters expired')
```

格式：`[subject] should [expected behavior] [when condition]`

## 測試結構

使用 Arrange-Act-Assert（AAA）：

```typescript
test('expired token should be rejected', () => {
  // Arrange — 設定前置條件
  const token = createResetToken('alice@example.com');
  advanceTime(2 * 60 * 60 * 1000);

  // Act — 執行動作
  const result = () => resetPassword(token, 'newPass123');

  // Assert — 驗證結果
  expect(result).toThrow('連結已過期，請重新申請');
});
```

## 測試品質原則

1. **測試獨立** — 不依賴其他測試的執行結果或順序
2. **測試可讀** — 讀測試就能理解系統行為
3. **不測試實作細節** — 測試行為，不測試內部結構
4. **邊界案例由 .feature 驅動** — .feature 沒列的不自行加
5. **失敗訊息有意義** — `expect(result.status).toBe('expired')` 而非 `expect(result).toBeTruthy()`

## RED 有效性

| 失敗類型 | 有效 RED？ | 處理方式 |
|---------|----------|---------|
| 功能尚未實作 | ✅ 有效 | 進入 GREEN |
| import 路徑錯誤 | ❌ 無效 | 修正後重新確認 |
| 語法錯誤 | ❌ 無效 | 修正後重新確認 |
| 測試框架設定問題 | ❌ 無效 | 修正後重新確認 |
| 沒有實作就通過 | ❌ 測試有 bug | 重寫測試 |

## Testing Anti-Patterns

- **測試 mock 行為而非真實行為** — mock 通過不代表真實程式碼通過
- **在 production class 加 test-only 方法** — 污染生產程式碼
- **不理解依賴就 mock** — 先理解依賴，再決定是否 mock
- **忽略整合測試** — unit test 通過不代表模組互動正確
- **測試間共享可變狀態** — 導致測試順序依賴
