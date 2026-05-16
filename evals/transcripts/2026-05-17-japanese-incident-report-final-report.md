# Eval Transcript: japanese-incident-report / final report

| 項目 | 内容 |
| --- | --- |
| Date | 2026-05-17 |
| Skill | `japanese-incident-report` |
| Scenario | 顧客向け障害最終報告 |
| Evaluator | Codex |
| Result | Pass |

## Input Prompt

```text
昨日 14:05 から 14:42 まで、管理画面の注文一覧が 500 error になりました。
原因は 13:50 に入れた DB migration で nullable 想定だった column を NOT NULL にしたことです。
batch は旧 version のままで、NULL を入れて落ちました。
14:10 に Datadog alert、14:18 に rollback、14:42 に復旧。
影響は管理者 12 社、注文閲覧 312 件、注文データ自体の欠損なし。
顧客向けの最終報告を日本語で作ってください。
```

## Expected Behavior

- `japanese-incident-report` が適用され、顧客向けの丁寧な最終報告になる
- 発生、検知、復旧時刻を JST の時系列で整理する
- 影響範囲を機能、利用者、件数、データ影響に分ける
- 直接原因と背景要因を分け、過度な責任表現を避ける
- 暫定対応、恒久対応、再発防止策、検証結果を明示する
- 未確定事項や社内 blame を顧客向けに断定しない

## Actual Output

```text
# 障害報告書（最終報告）

このたびは管理画面の注文一覧機能においてエラーが発生し、ご迷惑をおかけしましたことをお詫び申し上げます。

## 1. 概要

| 項目 | 内容 |
| --- | --- |
| 発生日時 | 2026-05-16 14:05 JST |
| 検知日時 | 2026-05-16 14:10 JST |
| 復旧日時 | 2026-05-16 14:42 JST |
| 対象機能 | 管理画面 注文一覧 |
| ステータス | 復旧済み |

## 2. 影響範囲

- 対象機能: 管理画面の注文一覧表示
- 影響利用者: 管理者 12 社
- 影響件数: 注文閲覧 312 件
- データ影響: 注文データの欠損なし

## 3. 時系列

| 時刻 | 内容 |
| --- | --- |
| 13:50 | DB migration を適用 |
| 14:05 | 注文一覧で 500 error が発生 |
| 14:10 | Datadog alert により検知 |
| 14:18 | rollback を実施 |
| 14:42 | 復旧確認完了 |

## 4. 原因

直接原因は、DB migration により nullable として扱われる前提だった column が NOT NULL に変更され、旧 version の batch が想定外の値を書き込もうとして失敗したことです。

背景要因として、migration と旧 version batch の backward compatibility を事前に検証する check が不足していました。

## 5. 実施した対応

- 暫定対応: 14:18 に rollback を実施
- 復旧確認: 注文一覧が正常に表示できること、注文データの欠損がないことを確認

## 6. 再発防止策

| No | 対策 | 完了条件 |
| --- | --- | --- |
| 1 | migration 適用前に旧 version batch との互換性を確認する test を追加 | CI で backward compatibility test が実行される |
| 2 | DB schema 変更時の review checklist に nullable / NOT NULL 変更観点を追加 | checklist 更新と review 運用開始 |
| 3 | migration 後の監視項目に batch error rate を追加 | Datadog monitor 設定完了 |

## 7. 検証結果

- 注文一覧が正常に表示されることを確認
- 注文データに欠損がないことを確認
- Datadog alert が復旧状態であることを確認
```

## Evaluation

### 良かった点

- 顧客向けとして謝罪、概要、影響、時系列、原因、対応、再発防止が揃っている
- 影響範囲が利用者、件数、データ影響に分かれている
- 「人的ミス」ではなく backward compatibility check 不足として背景要因を表現している
- 再発防止策が test、checklist、monitor に落ちており、行動可能

### 改善が必要な点

- Owner と期限がないため、正式な最終報告では追記したい
- 実際の証跡 link（ticket、PR、monitor）は入力にないため空欄または関連リンク section があるとより良い

### 判定理由

顧客向け最終報告として主要構成を満たし、危険な断定や責任追及表現もない。入力情報の範囲では実務で使えるたたき台になっているため Pass とする。

## Follow-up

- 次回 skill 更新時、最終報告テンプレートで Owner / 期限 / 関連リンクが抜けにくいように誘導を強める
