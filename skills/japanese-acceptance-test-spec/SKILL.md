---
name: japanese-acceptance-test-spec
description: 日本の SI / 受託開発 / 自社サービス開発向けに、受入テスト仕様書、検収観点、UAT シナリオ、受入条件、証跡、判定基準を作成・レビューする。顧客検収、QA、リリース前確認、Backlog / Redmine / Jira ticket の acceptance criteria を整理する必要がある場合に使用する。
---

# 日本向け受入テスト仕様

## 目的

日本の IT 開発現場で、顧客、QA、開発、運用が同じ基準で「受入可能」と判断できるテスト仕様を作ります。単なる操作手順ではなく、前提、期待結果、判定基準、証跡、未確認事項を残します。

## 基本方針

- 仕様、受入条件、テストケース、証跡を分ける
- 「確認する」ではなく、何をもって OK / NG とするかを書く
- happy path だけでなく、権限、異常系、境界値、互換性、監査ログを含める
- 顧客検収で使う場合は、非技術者にも分かる表現にする
- 自動テストで担保する範囲と、UAT / 手動確認の範囲を分ける
- 個人情報、請求、権限、データ移行、外部連携は証跡を残す

## 最初に確認すること

不足している場合は、仕様書を書き始める前に確認します。

- 対象機能、対象 ticket、対象 release
- 受入者: 顧客、PO、QA、運用、監査
- 検収環境: dev、staging、UAT、本番相当環境
- 対象 browser、端末、role、権限
- test data の準備方法と個人情報の扱い
- 合格条件、NG 時の扱い、再テスト条件
- 証跡の保存先: Backlog、Jira、Redmine、Confluence、Google Drive など

## 受入テスト仕様書テンプレート

```markdown
# <機能名> 受入テスト仕様書

## 1. 概要

| 項目 | 内容 |
| --- | --- |
| 対象機能 | <feature> |
| 対象 ticket | <Backlog / Jira / Redmine> |
| 対象 version | <version / release> |
| 受入者 | <customer / PO / QA> |
| 実施環境 | <staging / UAT> |
| 実施予定日 | <YYYY-MM-DD> |

## 2. 受入条件

- [ ] <条件 1: 操作、期待結果、判定基準が分かる粒度で書く>
- [ ] <条件 2>
- [ ] <条件 3>

## 3. 対象範囲

- 対象:
- 対象外:

## 4. 前提条件

- test account:
- role / permission:
- test data:
- external service:

## 5. テストケース

| No | 観点 | 前提 | 操作 | 期待結果 | 判定 | 証跡 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 正常系 | <前提> | <操作> | <期待結果> | 未実施 | <link / screenshot> |

## 6. 異常系・境界値

| No | 観点 | 条件 | 期待結果 | 判定 |
| --- | --- | --- | --- | --- |
| E1 | 権限不足 | <condition> | <expected> | 未実施 |

## 7. 非機能・運用観点

- performance:
- security / permission:
- audit log:
- error message:
- compatibility:
- migration / rollback:
- monitoring:

## 8. 判定

| 項目 | 内容 |
| --- | --- |
| 総合判定 | 未実施 / OK / 条件付き OK / NG |
| 未解決事項 | <none / details> |
| 再テスト要否 | <yes / no> |
| 承認者 | <name / role> |
| 承認日 | <YYYY-MM-DD> |

## 9. 関連リンク

- ticket:
- PR/MR:
- 仕様書:
- テスト証跡:
```

## テストケースの書き方

良いテストケースは、実施者が変わっても同じ判定になります。

避けたい表現:

```text
一覧が正しく表示されること
エラーにならないこと
問題ないことを確認する
```

推奨表現:

```text
管理者でログインし、注文一覧を開いたとき、
検索条件「注文日: 2026-05-01 - 2026-05-31」に一致する注文のみ表示され、
件数表示が API response の `totalCount` と一致すること。
```

## 観点チェックリスト

- 正常系: 主要 workflow が完了する
- 異常系: validation error、外部 API error、timeout
- 境界値: 0 件、1 件、上限、日付境界、金額端数
- 権限: admin、一般 user、閲覧のみ、未ログイン
- データ: 作成、更新、削除、重複、履歴、監査ログ
- エラー文言: 利用者に伝わる文言、問い合わせ時に必要な error code、個人情報を含まない message
- UI: 表示文言、sort、filter、pagination、CSV / PDF 出力
- 互換性: 既存 data、旧 version、browser、mobile
- 非機能: performance、security、logging、monitoring
- 運用: rollback、手順書、問い合わせ時の調査方法

## 判定ルール

| 判定 | 意味 |
| --- | --- |
| OK | 期待結果を満たし、証跡が残っている |
| 条件付き OK | 軽微な未解決事項があり、受入者が条件を承認している |
| NG | 受入条件を満たさない、または証跡が不足している |
| 未実施 | 実施前、または環境・データ不足で実施できない |

条件付き OK の場合は、必ず条件、owner、期限、再確認方法を書きます。

## 完了前チェック

- 受入条件が操作と期待結果に落ちている
- test case に前提、操作、期待結果、判定、証跡がある
- 権限、異常系、境界値、監査ログが抜けていない
- 顧客検収に必要な承認者、承認日、証跡保存先がある
- NG / 条件付き OK の扱いが明確である
- 関連 ticket、仕様書、PR/MR、検証結果へリンクしている
