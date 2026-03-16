# 研究背景與目的

> 研究日期：2026-03-12 ~ 2026-03-16
> 作者：Vito（AI 協作產出）

## 動機

在 AI 輔助開發工具日益成熟的 2025-2026 年，傳統的軟體開發方法論（BDD、TDD）正在與 AI 協作模式融合。同時，Spec-Driven Development（SDD）正在成為連接人類意圖與 AI 生成程式碼的橋樑。

本研究旨在調查現有生態系和框架，從中汲取最佳實踐，設計一套兼顧 solo 開發者與企業團隊的 AI 驅動開發流程。

## 研究目標

1. 調查 Claude Code Skills 生態系中 BDD、TDD、產品發想相關的 skills
2. 調查 BDD / TDD 在 AI 協作中的最新趨勢與作法
3. 分析五大框架：Spec Kit、Superpowers、OpenSpec、ECC、gstack
4. 釐清 SDD、BDD、TDD、EDD 四者的關聯性
5. 基於現有專案實踐基礎，設計統一開發流程
6. 產出 vif plugin（11 skills + 6 agents），支援完全自動化與輔助自動化兩種模式

## 研究成果

本研究的最終成果為 **vif**（AI-Driven Development Flow），一個 Claude Code plugin：

- 11 個 skills 涵蓋從架構決策到收尾的完整開發生命週期
- 6 個 agents 提供 TDD 紀律、獨立審查、安全檢查
- 兩種模式：完全自動化（Solo）+ 輔助自動化（企業團隊）
- 整合五大框架的精華

詳見 [README.md](../README.md)。

## 文件索引

| 檔案 | 內容 |
|------|------|
| [01-skills-ecosystem.md](./01-skills-ecosystem.md) | Claude Code Skills 生態系調查（BDD / TDD / Discovery） |
| [02-trends.md](./02-trends.md) | PRD / BDD / SDD / TDD / EDD 在 AI 協作時代的趨勢 |
| [03-framework-analysis.md](./03-framework-analysis.md) | 五大框架分析（Spec Kit、Superpowers、OpenSpec、ECC、gstack） |
| [04-methodology-relationships.md](./04-methodology-relationships.md) | SDD、BDD、TDD、EDD 的關聯性 |
| [05-project-baseline.md](./05-project-baseline.md) | 現有專案基礎盤點 |
| [06-design-decisions.md](./06-design-decisions.md) | vif 流程設計決策（為什麼這樣設計） |

## 閱讀建議

- 想了解**整體流程** → 直接看 [README.md](../README.md)
- 想了解**為什麼這樣設計** → 從 [06-design-decisions.md](./06-design-decisions.md) 開始
- 想了解**參考了哪些框架** → 看 [03-framework-analysis.md](./03-framework-analysis.md)
- 想了解**研究背景** → 從本文件依序閱讀
