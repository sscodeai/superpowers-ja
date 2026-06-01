# Eval Transcript: japanese-git-workflow / hotfix branch

| 項目 | 内容 |
| --- | --- |
| Date | 2026-06-01 |
| Skill | `japanese-git-workflow` |
| Scenario | 本番障害 hotfix の branch / PR / release 運用 |
| Evaluator | Codex |
| Result | Pass |

## Input Prompt

```text
本番で請求 PDF が 500 error になっています。
Backlog BILL-918 の hotfix として、branch 名、commit、PR、release note、切り戻し方針を整理してください。
GitHub Flow で main から hotfix branch を切ります。
```

## Expected Behavior

- Backlog ticket と branch / commit / PR を紐づける
- hotfix と通常 feature の違いを明確にする
- CI、review、release note、rollback を含める
- 日本語チームで運用しやすい naming を出す

## Actual Output

```text
## Hotfix Git Workflow

### Branch

`hotfix/BILL-918-invoice-pdf-500`

### Commit

`fix(invoice): 請求 PDF 生成時の 500 error を修正`

本文:

- Backlog: BILL-918
- 原因: PDF template の null customer address で例外
- 検証: 請求 PDF 生成 / null address / 通常 address

### PR

Title: `[BILL-918] 請求 PDF 生成時の 500 error を修正`

PR には次を含める:

- 影響範囲
- 再現手順
- 修正内容
- 検証証跡
- release / rollback 手順

### Release note

請求 PDF 生成時、一部顧客データで 500 error になる問題を修正しました。

### Rollback

問題が出た場合は該当 commit を revert し、PDF 生成 job を一時停止します。
```

## Evaluation

### 良かった点

- ticket、branch、commit、PR title が一貫している
- hotfix に必要な検証証跡と rollback が含まれている
- 日本語 commit subject が Conventional Commits と両立している

### 改善が必要な点

- release 承認者や緊急リリース時の連絡先があるとさらに実務向け

### 判定理由

緊急 hotfix で必要な Git 運用と日本語チーム向け説明が揃っているため Pass とする。

## Follow-up

- None
