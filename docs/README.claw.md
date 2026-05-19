# Superpowers-JA — Claw Code インストールガイド

Claw Code で superpowers-ja を使うためのガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja --tool claw
```

プロジェクトに `.claw/` ディレクトリまたは `CLAW.md` がある場合は自動検出されます：

```bash
npx superpowers-ja
```

インストールスクリプトは skills を `.claw/skills/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.claw/skills
cp -r superpowers-ja/skills/* /your/project/.claw/skills/
```

全プロジェクト共通で使う場合：

```bash
mkdir -p ~/.claw/skills
cp -r superpowers-ja/skills/* ~/.claw/skills/
```

## 推奨プロジェクト設定

プロジェクトルートの `CLAW.md` に、superpowers-ja skills の利用方針を短く書いておくと安定します。

```markdown
# CLAW.md

本プロジェクトは superpowers-ja skills を作業手法として採用しています。
新機能や仕様変更では、実装前に brainstorming skill で要求と制約を整理してください。
Skills は `.claw/skills/` 配下にあります。
```

## 使い方

Claw Code を再起動した後、タスクに応じて skill 名を明示できます：

```text
brainstorming skill でこの要件を整理してください
```

```text
japanese-code-review skill の観点でこの差分をレビューしてください
```

よく使う流れ：

| 場面 | Skill |
| --- | --- |
| 要件整理、仕様確認 | `brainstorming` |
| 実装計画 | `writing-plans` |
| テスト先行の実装 | `test-driven-development` |
| 不具合調査 | `systematic-debugging` |
| 完了前確認 | `verification-before-completion` |
| PR / MR 前レビュー | `japanese-code-review` |

## トラブルシューティング

### Skills が認識されない場合

1. `.claw/skills/` に skill フォルダがコピーされていることを確認
2. 各 skill に `SKILL.md` と YAML frontmatter があることを確認
3. Claw Code を再起動
4. 自動検出されない場合は `npx superpowers-ja --tool claw` を使う

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
