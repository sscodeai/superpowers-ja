---
name: japanese-commit-conventions
description: 日本語チーム向け commit / changelog 規約。Conventional Commits を日本語 subject/body、Backlog/Redmine/Jira チケット、release note、commitlint と合わせて運用する参考。ユーザーが明示的に /japanese-commit-conventions を指定した場合のみ使用し、自動起動しない。
---

# 日本語 Commit 規約

## 基本形式

Conventional Commits の type は英語のまま残し、scope と説明を日本語で書きます。

```text
<type>(<scope>): <概要>

<本文>

<footer>
```

例:

```text
fix(請求): 税率変更時に税込金額が再計算されない問題を修正

税率マスタ更新後もキャッシュ済みの税率を参照していたため、
請求明細の税込金額が古い税率で計算されるケースがありました。

対応:
- 税率マスタ更新時に cache key を invalidation
- 請求再計算の回帰テストを追加

Refs: BACKLOG-PROJ-1234
```

## type 一覧

| type | 用途 |
| --- | --- |
| `feat` | 機能追加 |
| `fix` | 不具合修正 |
| `docs` | ドキュメント |
| `style` | フォーマットのみ |
| `refactor` | 振る舞いを変えないリファクタ |
| `perf` | 性能改善 |
| `test` | テスト追加・修正 |
| `build` | build system / dependency |
| `ci` | CI/CD |
| `chore` | 雑務、設定、生成物 |
| `revert` | revert |

## subject のルール

- 50 文字前後を目安にする
- 末尾に句点を付けない
- 「修正」「追加」「削除」「更新」「移行」「分離」など、何をしたかが分かる動詞を使う
- 「対応」「修正しました」「レビュー反映」だけで終わらせない
- scope はチームで読める粒度にする: `認証`, `請求`, `管理画面`, `batch`, `infra`

良い例:

```text
feat(管理画面): CSV エクスポートに検索条件を反映
fix(auth): SSO 失敗時にセッションが残る問題を修正
docs(API): 注文作成 API のエラーコードを追記
test(請求): 月末締め処理の境界値テストを追加
```

避けたい例:

```text
fix: バグ修正
chore: レビュー対応
update: いろいろ修正
feat: 対応しました
```

## footer のチケット表記

```text
Refs: PROJ-1234
Closes: PROJ-1234
Backlog: PROJ-1234
Redmine: #1234
Jira: PAY-567
```

複数ある場合:

```text
Refs: PROJ-1234, PAY-567
Related: https://example.backlog.com/view/PROJ-1234
```

## Breaking Change

API、DB schema、設定ファイル、外部連携、運用手順に互換性のない変更がある場合は必ず明記します。

```text
feat(api)!: ユーザー詳細 API のレスポンス構造を変更

profile 配下へ avatarUrl と displayName を移動しました。

BREAKING CHANGE: GET /api/users/:id のレスポンス構造が変わります。
移行手順:
1. frontend の参照パスを user.profile.* へ変更
2. mobile app v3.2.0 未満は旧 API を使用
```

## commitlint 設定例

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'subject-empty': [2, 'never'],
    'header-max-length': [1, 'always', 72],
  },
};
```

## Changelog セクション例

```javascript
export default {
  types: [
    { type: 'feat', section: '機能追加' },
    { type: 'fix', section: '不具合修正' },
    { type: 'perf', section: '性能改善' },
    { type: 'refactor', section: 'リファクタリング' },
    { type: 'docs', section: 'ドキュメント' },
    { type: 'test', section: 'テスト' },
    { type: 'build', section: 'Build', hidden: true },
    { type: 'ci', section: 'CI', hidden: true },
    { type: 'chore', section: 'その他', hidden: true },
  ],
};
```
