---
name: japanese-git-workflow
description: 日本の IT 開発現場向け Git / PR / CI 運用参考。GitHub、GitLab、Bitbucket、Backlog、Redmine、Jira、ブランチ戦略、承認、証跡、リリース管理。ユーザーが明示的に /japanese-git-workflow を指定した場合のみ使用し、自動起動しない。
---

# 日本向け Git ワークフロー

## 想定環境

日本の現場では、次のような組み合わせがよくあります。

| 領域 | よくある選択肢 |
| --- | --- |
| Git hosting | GitHub Enterprise、GitLab、Bitbucket、Azure DevOps |
| Ticket | Backlog、Redmine、Jira、GitHub Issues |
| CI/CD | GitHub Actions、GitLab CI、Bitbucket Pipelines、Jenkins、CircleCI |
| Review | PR / MR、承認者 1-2 名、CODEOWNERS |
| Release | staging 確認、本番承認、リリース手順書、rollback 手順 |

## ブランチ戦略

### 小規模・自社開発

短命 feature branch + mainline を推奨します。

```text
main      --o--o--o--o--o
             \   \   \
feature       o---o   o
```

ルール:

- `main` は常に deploy 可能
- feature branch は 1-3 日以内に merge
- 未完成機能は feature flag で隠す
- PR は小さく、レビュー可能な単位に分ける

### SI / 受託 / 固定リリース

`main`、`develop`、`release/*` を分ける運用が現実的な場合があります。

```text
main       --o-----------o
             \         /
release       o--o--o--
             /
develop   --o--o--o--o--
            \   \
feature      o---o
```

ルール:

- `main`: 本番相当。直接 push 禁止
- `develop`: 結合・検証環境
- `release/*`: リリース前の bug fix のみ
- `hotfix/*`: 本番障害対応。`main` と `develop` の両方へ反映

## ブランチ命名

```text
feat/PROJ-1234-user-export
fix/PAY-567-tax-rounding
docs/API-42-order-spec
refactor/auth-session-store
hotfix/2026-05-14-login-timeout
release/2026-05
```

推奨:

- type prefix を付ける: `feat/`, `fix/`, `docs/`, `refactor/`, `hotfix/`
- チケット番号を含める
- 英小文字と hyphen を基本にする
- 個人名だけの branch を避ける

## PR / MR テンプレート

```markdown
## 概要

## 関連チケット

- Backlog:
- Redmine:
- Jira:

## 変更内容

## 影響範囲

## 確認観点

- [ ] Unit test
- [ ] Integration test
- [ ] 権限
- [ ] 個人情報 / ログ
- [ ] migration / rollback
- [ ] staging 確認

## スクリーンショット / 実行結果

## リリース時の注意

## レビュアーへの補足
```

## Merge 条件

- CI が成功している
- 必須 reviewer が approve している
- ticket の受入条件を満たしている
- 仕様変更、DB migration、環境変数、運用手順の変更が PR に書かれている
- 本番影響がある場合、rollback 手順がある

## CI の最低ライン

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

## リリース運用

リリース前に残すもの:

- 対象 commit / tag
- 対象チケット一覧
- DB migration の有無
- feature flag の切り替え手順
- deploy 手順
- smoke test
- rollback 手順
- 障害時連絡先

## hotfix 手順

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c hotfix/PROJ-9999-login-timeout

# fix and verify
git commit -m "fix(auth): ログインタイムアウト時の再認証処理を修正"
git push -u origin hotfix/PROJ-9999-login-timeout
```

merge 後:

- `main` へ merge
- tag を作成
- 本番 deploy
- `develop` へ backport
- 障害報告書 / postmortem へリンク

## 日本の現場での注意点

- 「承認済み」だけでなく、何を確認したかを PR に残す
- 仕様確認中のまま merge しない
- 口頭合意は ticket / PR / 議事録へ転記する
- Excel / CSV / 文字コード / タイムゾーン / 和暦など、日本固有の利用条件を受入条件へ入れる
- 個人情報、監査ログ、委託先アクセス権限は早めに確認する
