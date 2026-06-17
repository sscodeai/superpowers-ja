---
name: japanese-code-review-graph
description: code-review-graph を任意導入している repository で、PR/MR の影響範囲、依存関係、risk、test gap を日本の IT 開発現場向けに整理する。大規模 codebase、既存システム、SI/受託開発、Backlog / Redmine / Jira のレビュー証跡、リリース判定で blast radius analysis が必要な場合に使用する。code-review-graph が未導入の場合は導入を強制せず、通常の code review に fallback する。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [japanese, code-review, graph]
---

# 日本向け Code Review Graph 活用

## 目的

`code-review-graph` を任意導入している repository で、変更の影響範囲を graph context から整理し、日本の IT 開発現場で使いやすい review 証跡に落とします。default install には含めず、必要な project だけが追加導入します。

## 前提

- `code-review-graph` は optional integration
- superpowers-ja の installer は `code-review-graph` を自動 install しない
- tool が未導入、MCP 未設定、graph 未作成の場合は、無理に使わず通常の `japanese-code-review` または `requesting-code-review` に切り替える
- graph output は補助情報であり、最終判断は diff、test、仕様、運用制約で確認する

## いつ使うか

- PR / MR の影響範囲を説明したい
- 大きい既存 codebase で、関連 file を人手で追い切れない
- 変更が service、controller、DB、batch、外部連携へ波及する可能性がある
- review コメントに「なぜこの file も確認したか」の証跡を残したい
- リリース判定で test gap、監視、rollback 影響を整理したい

小さい変更、単一 file の軽微修正、graph が古い repository では使わなくてよいです。

## 導入メモ

利用する project 側で、`code-review-graph` の公式手順に従って install と graph build を行います。superpowers-ja 側では dependency として固定しません。

```bash
# 例。実際の導入方法は code-review-graph の README を確認する
code-review-graph install
code-review-graph build
```

導入後、AI agent から MCP tool として graph query、blast radius、risk review などを利用できる場合があります。tool 名や command は利用環境に合わせて読み替えてください。

## Review workflow

1. **差分を確認する**
   - branch、base SHA、head SHA
   - 変更 file、変更目的、関連 ticket

2. **graph context を取得する**
   - 変更 file の依存先 / 依存元
   - 呼び出し関係、route、entrypoint、DB / schema / batch への接続
   - 影響が大きい module

3. **影響範囲を分類する**
   - user-facing: 画面、API、batch、notification
   - data: DB、migration、cache、search index
   - external: payment、mail、S3、CRM、基幹 system
   - operations: monitoring、alert、runbook、rollback

4. **risk と test gap を出す**
   - 重大度: `[must]` / `[should]` / `[nits]` / `[question]`
   - test が足りない path
   - regression risk
   - リリース前に確認すべき環境差分

5. **日本向け review 証跡にまとめる**
   - Backlog / Redmine / Jira ticket へ貼れる粒度にする
   - 断定しすぎず、根拠と未確認事項を分ける

## 出力テンプレート

```markdown
# Code Review Graph 影響範囲レビュー

## 1. 変更概要

- Ticket:
- PR/MR:
- Base / Head:
- 対象 file:

## 2. Graph から見た影響範囲

| 区分 | 影響候補 | 根拠 | 確認状況 |
| --- | --- | --- | --- |
| API / 画面 | <module> | <graph relation / diff> | 未確認 |
| DB / data | <table / model> | <relation> | 未確認 |
| batch / job | <job> | <caller / callee> | 未確認 |
| external | <service> | <relation> | 未確認 |

## 3. Review findings

### [must]

- <merge 前に必ず直す issue>

### [should]

- <原則対応したい issue>

### [question]

- <仕様、影響範囲、運用判断の確認>

## 4. Test gap

- <不足している test>
- <手動確認が必要な scenario>
- <UAT / staging での確認>

## 5. リリース前確認

- monitoring:
- rollback:
- migration:
- runbook:
- customer notice:

## 6. 関連証跡

- Graph query / output:
- CI:
- Test result:
- Ticket:
```

## 注意点

- graph が示す関係は review の入口であり、正解ではありません
- generated code、dynamic import、reflection、framework magic は graph に出ない場合があります
- graph が古い場合は再 build するか、結果を信用しないでください
- 機密情報や実顧客名を transcript や ticket に貼らないでください
- 影響範囲に自信がない場合は `[question]` として残し、断定しないでください

## 完了前チェック

- graph output と実 diff の両方を確認した
- 影響範囲が API / data / batch / external / operations に分かれている
- test gap と手動確認観点がある
- release / rollback / monitoring への影響を確認した
- Backlog / Redmine / Jira に貼れる review 証跡になっている
