# Superpowers-JA — Claude Code インストールガイド

Claude Code / Copilot CLI で superpowers-ja を使うためのガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja --tool claude
```

プロジェクトに `.claude/` ディレクトリがある場合は自動検出されます：

```bash
npx superpowers-ja
```

インストールスクリプトは skills を `.claude/skills/` にコピーし、`CLAUDE.md` に superpowers-ja の bootstrap セクションを追加します。

## 何が追加されるか

| Path | 用途 |
| --- | --- |
| `.claude/skills/` | 23 skills の配置先 |
| `CLAUDE.md` | skill 利用ルールと skills 一覧の bootstrap |

`CLAUDE.md` に既存の内容がある場合、superpowers-ja セクションだけを追記します。既存の手書き内容は保持します。

## Plugin として使う場合

Claude plugin として導入する場合は、この repository の `.claude-plugin/` manifest と `hooks/` が使われます。

SessionStart hook は `using-superpowers` skill を起動時 context に注入し、Claude Code では通常のファイル読み込みではなく `Skill` tool で各 skill を読み込むよう促します。

## 使い方

Claude Code を再起動した後、タスクに応じて skill 名を明示できます：

```text
brainstorming skill でこの要件を整理してください
```

```text
verification-before-completion skill で完了前チェックをしてください
```

よく使う流れ：

| 場面 | Skill |
| --- | --- |
| 要件整理、仕様確認 | `brainstorming` |
| 実装計画 | `writing-plans` |
| TDD | `test-driven-development` |
| 不具合調査 | `systematic-debugging` |
| レビュー依頼 | `requesting-code-review` |
| 完了前検証 | `verification-before-completion` |

## アンインストール

```bash
npx superpowers-ja --uninstall
```

`.claude/skills/` に入った superpowers-ja skills と、`CLAUDE.md` 内の superpowers-ja セクションを削除します。

## トラブルシューティング

### Skills が認識されない場合

1. `.claude/skills/using-superpowers/SKILL.md` が存在することを確認
2. Claude Code を再起動
3. `CLAUDE.md` に superpowers-ja セクションがあることを確認
4. 自動検出されない場合は `npx superpowers-ja --tool claude` を使う

### ホームディレクトリに入れてしまった場合

```bash
cd ~
npx superpowers-ja --uninstall
```

superpowers-ja はプロジェクト単位で導入する設計です。`~` へのインストールは避けてください。

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
