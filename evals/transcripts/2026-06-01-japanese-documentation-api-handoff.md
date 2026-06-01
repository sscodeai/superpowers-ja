# Eval Transcript: japanese-documentation / API handoff

| 項目 | 内容 |
| --- | --- |
| Date | 2026-06-01 |
| Skill | `japanese-documentation` |
| Scenario | 外部連携 API の引き継ぎ document |
| Evaluator | Codex |
| Result | Pass |

## Input Prompt

```text
配送会社 API 連携を保守チームへ引き継ぎます。
認証、rate limit、retry、エラー時の問い合わせ先、環境変数、運用手順を含めた日本語 document の構成を作ってください。
```

## Expected Behavior

- 読者、目的、前提、除外範囲を明確にする
- 認証、環境変数、error handling、問い合わせ先、運用手順を分ける
- 未決事項と owner を残す
- 日本語と英語 technical terms を自然に混在させる

## Actual Output

```text
# 配送会社 API 連携 引き継ぎ資料

## 目的

保守チームが配送会社 API の障害調査、設定変更、問い合わせを行える状態にする。

## 対象読者

- 保守運用担当
- 開発担当
- CS 二次対応担当

## 前提 / 除外範囲

- 本資料は運用手順を対象とする
- API 仕様そのものは配送会社公式 document を参照する

## 認証 / 環境変数

| Key | 用途 | 管理場所 | 更新手順 |
| --- | --- | --- | --- |
| DELIVERY_API_KEY | API 認証 | Secret Manager | 申請 ticket 経由 |

## Rate Limit / Retry

- 429 は exponential backoff で retry
- 5xx は最大 3 回 retry 後に alert

## Error Handling

| Error | 一次対応 | Escalation |
| --- | --- | --- |
| 401 | secret 有効期限確認 | 開発担当 |
| 429 | retry 状況確認 | 配送会社 support |

## 問い合わせ先

## 未決事項

| Item | Owner | Due |
| --- | --- | --- |
```

## Evaluation

### 良かった点

- 対象読者、目的、前提、除外範囲が明確
- API 運用で必要な認証、rate limit、retry、error handling が分かれている
- 未決事項 table があり、引き継ぎ後の穴を追える

### 改善が必要な点

- 問い合わせ先 section に具体例が入るとさらに使いやすい

### 判定理由

保守チームへの引き継ぎ document として構成が十分で、未決事項も管理できるため Pass とする。

## Follow-up

- None
