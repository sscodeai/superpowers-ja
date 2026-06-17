---
name: japanese-documentation
description: 日本語技術文書の作成参考。仕様書、基本設計、詳細設計、README、API 仕様、運用手順での日英混在、敬体/常体、表記ゆれ、受入条件、証跡の残し方。ユーザーが明示的に /japanese-documentation を指定した場合のみ使用し、自動起動しない。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [japanese, documentation]
---

# 日本語技術ドキュメント規約

## 基本方針

- 読者を先に決める: 開発者、レビュアー、QA、運用、顧客、監査
- 仕様と実装メモを分ける
- 決定事項、未決事項、前提、除外範囲を明記する
- 日英の技術語を自然に混在させ、無理に翻訳しない
- 後から追跡できるよう、チケット、PR/MR、議事録、検証結果へリンクする

## 文体

| 用途 | 推奨 |
| --- | --- |
| README / 社内手順 | です・ます調 |
| 設計書 / ADR / API 仕様 | である調、または簡潔な名詞止め |
| コメント / commit body | 簡潔な常体 |
| 顧客向け資料 | です・ます調、断定しすぎない |

1 つの文書内では文体を混ぜないでください。

## 日英混在ルール

- 技術固有名詞は英語のまま: React、Spring Boot、PostgreSQL、Kubernetes
- コード、コマンド、環境変数、HTTP method は backtick で囲む
- 日本語と英単語の間は読みやすさ優先で半角スペースを入れる
- UI 文言、API field 名、DB column 名は実物と同じ表記にする
- 「ユーザ」「ユーザー」などの表記はプロジェクト用語集に合わせる

例:

```markdown
管理画面では `POST /api/users/export` を呼び出し、CSV を非同期生成する。
生成完了後、S3 の pre-signed URL を返す。
```

## 仕様書テンプレート

```markdown
# <機能名> 仕様

## 目的

## 背景

## 対象範囲

## 対象外

## 利用者

## 受入条件

- [ ] <条件 1>
- [ ] <条件 2>
- [ ] <条件 3>

## 業務ルール

## 画面 / API / Batch 仕様

## 権限

## 個人情報・監査ログ

## エラー処理

## 移行・互換性

## テスト観点

## 未決事項

## 関連リンク

- Backlog:
- PR/MR:
- 議事録:
```

## API 仕様テンプレート

```markdown
## ユーザー CSV エクスポート

| 項目 | 内容 |
| --- | --- |
| Method | `POST` |
| Path | `/api/users/export` |
| Auth | 管理者権限 |
| Content-Type | `application/json` |

### Request

| field | type | required | description |
| --- | --- | --- | --- |
| `keyword` | string | no | 氏名またはメールアドレス |
| `status` | string | no | `active` / `inactive` |

### Response

| field | type | description |
| --- | --- | --- |
| `jobId` | string | 非同期 job ID |
| `status` | string | `queued` |

### Error

| status | code | description |
| --- | --- | --- |
| 403 | `FORBIDDEN` | 権限不足 |
| 422 | `INVALID_FILTER` | 検索条件不正 |
```

## 設計書で必ず残す観点

- なぜこの方式にしたか
- 採用しなかった代替案
- 性能見積もり
- 障害時の復旧手順
- 個人情報や機密情報の扱い
- ログに出してよい情報、出してはいけない情報
- migration と rollback
- release / feature flag / phased rollout

## 避けたい表現

```text
適宜対応する
いい感じにする
必要に応じて
など
問題ないことを確認
```

代わりに、条件と確認方法を書く:

```text
CSV 生成が 10 万件以内で 60 秒以内に完了することを staging で確認する。
10 万件を超える場合は非同期 job として実行し、完了通知メールを送信する。
```
