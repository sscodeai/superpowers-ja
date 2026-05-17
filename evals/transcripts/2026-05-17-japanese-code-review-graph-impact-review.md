# Eval Transcript: japanese-code-review-graph / impact review

| 項目 | 内容 |
| --- | --- |
| Date | 2026-05-17 |
| Skill | `japanese-code-review-graph` |
| Scenario | 注文 CSV エクスポート変更の影響範囲レビュー |
| Evaluator | Codex |
| Result | Pass |

## Input Prompt

```text
code-review-graph の blast radius 結果では、今回の注文 CSV エクスポート変更が
OrderController、OrderExportService、OrderRepository、AdminPermissionPolicy、
AuditLogService、ExportJobWorker に関連しています。

PR の変更内容は OrderExportService と OrderController のみです。
Backlog PROJ-2345 のレビューコメントとして、日本語で影響範囲、risk、test gap を整理してください。
```

## Expected Behavior

- `japanese-code-review-graph` が適用され、graph 結果を review 証跡へ変換する
- 影響範囲を API / data / batch / permission / audit log などに分ける
- 変更 file 以外の関連 module を「確認候補」として扱い、断定しすぎない
- `[must]` / `[should]` / `[question]` の重大度で review comment を整理する
- test gap、release 前確認、Backlog に貼れる形を含む

## Actual Output

```text
# Code Review Graph 影響範囲レビュー

Backlog: PROJ-2345

## 1. 変更概要

今回の変更は注文 CSV エクスポートの追加で、PR 上の変更 file は
OrderExportService と OrderController です。

code-review-graph の blast radius では、以下も関連候補として出ています。

| 区分 | 影響候補 | 確認状況 |
| --- | --- | --- |
| API | OrderController | 変更あり |
| export logic | OrderExportService | 変更あり |
| data access | OrderRepository | 要確認 |
| permission | AdminPermissionPolicy | 要確認 |
| audit log | AuditLogService | 要確認 |
| batch / async job | ExportJobWorker | 要確認 |

## 2. Review findings

### [must] 管理者権限と監査ログの確認が必要です

CSV 出力は注文情報をまとめて取得できるため、AdminPermissionPolicy で
管理者のみ実行可能であることを確認したいです。
また、AuditLogService に export 実行者、条件、件数、実行時刻が残るか確認してください。

### [should] 10 万件超過時の repository / worker 経路を確認したいです

OrderRepository と ExportJobWorker が blast radius に含まれているため、
同期 / 非同期のどちらで export されるか、10 万件超過時に job が作られないかを確認したいです。

### [question] CSV 文字コードと Excel 利用は受入条件に反映済みでしょうか

顧客運用で Excel を使う前提なら、Shift_JIS または BOM 付き UTF-8 の判断を
受入条件と test case に明記したいです。

## 3. Test gap

- 管理者のみ CSV export できる test
- 一般 user / 未ログインで export できない test
- 10 万件超過時に CSV が生成されない test
- AuditLogService に export 操作が記録される test
- ExportJobWorker 経由の regression test

## 4. リリース前確認

- staging で 10 万件近い data を使った性能確認
- audit log の検索方法を運用手順に記載
- export 失敗時の問い合わせ調査手順を確認
```

## Evaluation

### 良かった点

- graph 結果をそのまま信じず、関連候補として扱っている
- 日本の review 現場で使いやすい重大度ラベルになっている
- 権限、監査ログ、上限超過、worker 経路を test gap として拾えている
- Backlog に貼りやすい構造になっている

### 改善が必要な点

- Graph query / output への link 欄があると証跡としてさらに良い
- DB table や repository method 名が分かる場合は data impact をもう一段具体化できる

### 判定理由

code-review-graph の blast radius を、日本の IT 開発現場で重視される影響範囲、risk、test gap、証跡へ変換できている。optional integration としての狙いを満たすため Pass とする。

## Follow-up

- skill の出力テンプレートに Graph query / output link 欄を維持する
