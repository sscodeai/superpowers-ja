# Superpowers-JA — Cursor インストールガイド

Cursor で superpowers-ja を使うためのガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja --tool cursor
```

プロジェクトに `.cursor/` ディレクトリまたは `.cursorrules` がある場合は自動検出されます：

```bash
npx superpowers-ja
```

インストールスクリプトは skills を `.cursor/skills/` にコピーします。

## 何が追加されるか

| Path | 用途 |
| --- | --- |
| `.cursor/skills/` | 23 skills の配置先 |
| `.cursor-plugin/plugin.json` | Cursor plugin 配布用 manifest |
| `hooks/hooks-cursor.json` | Cursor session start hook 設定 |

Cursor plugin として導入する場合、SessionStart hook は `using-superpowers` skill を起動時 context に注入します。通常の project install では `.cursor/skills/` に skills を置き、Cursor の context から参照できる状態にします。

## 推奨プロジェクト設定

必要に応じて `.cursorrules` で skills の場所を明示します。

```text
This project uses superpowers-ja skills.
Before implementing non-trivial changes, check .cursor/skills/ for a matching SKILL.md and follow it.
Use Japanese for user-facing explanations unless the task requires English.
```

既存の `.cursorrules` がある場合は、上記のような短い方針だけを追記してください。

## 使い方

Cursor を再起動した後、タスクに応じて skill 名を明示できます：

```text
brainstorming skill でこの仕様変更を整理してください
```

```text
japanese-git-workflow skill の観点で PR の進め方を確認してください
```

よく使う流れ：

| 場面 | Skill |
| --- | --- |
| 要件整理、仕様確認 | `brainstorming` |
| 実装計画 | `writing-plans` |
| TDD | `test-driven-development` |
| 不具合調査 | `systematic-debugging` |
| 日本語レビュー | `japanese-code-review` |
| commit message | `japanese-commit-conventions` |

## アンインストール

```bash
npx superpowers-ja --uninstall
```

`.cursor/skills/` に入った superpowers-ja skills を削除します。自分で書いた `.cursorrules` の内容は変更しません。

## トラブルシューティング

### Skills が認識されない場合

1. `.cursor/skills/` に skill フォルダがコピーされていることを確認
2. 各 skill に `SKILL.md` と YAML frontmatter があることを確認
3. Cursor を再起動
4. 自動検出されない場合は `npx superpowers-ja --tool cursor` を使う

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
