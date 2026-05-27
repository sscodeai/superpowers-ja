# Superpowers-JA — Kiro インストールガイド

[Kiro](https://kiro.dev)（Amazon AI IDE）で superpowers-ja を使うための完全ガイドです。

## クイックインストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.kiro/` を自動検出し、skills を `.kiro/steering/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
cp -r superpowers-ja/skills/* /your/project/.kiro/steering/
```

## 仕組み

Kiro は **Steering** で AI の振る舞いルールを管理します：

- **ディレクトリ**: `.kiro/steering/`
- **フォーマット**: Markdown + YAML frontmatter
- **読み込みモード**:
  - `alwaysApply: true` — 全対話で自動ロード
  - `globs: "*.ts"` — 特定ファイルに合致したときロード
  - 手動参照 — チャットに `#steering-file-name` と入力

### Skills と Steering の対応

superpowers-ja の SKILL.md フォーマットは Kiro Steering と互換（どちらも Markdown + YAML frontmatter）です。インストール後、Kiro が自動的に skills を認識・ロードします。

### 自動生成される bootstrap

`npx superpowers-ja --tool kiro` は `.kiro/steering/superpowers-ja.md` を自動生成します。手動インストールする場合だけ、同等の steering file を作成してください：

```markdown
---
description: superpowers-ja skills framework をロードする
alwaysApply: true
---

.kiro/steering/ 配下の superpowers-ja skills をワークフロー指針として利用してください。
新しいタスクは brainstorming skill から始めることを推奨します。
```

## 使い方

Kiro では以下のように skills を利用できます：
- skill 名を直接指示：「ブレインストーミングでこの要件を分析してください」
- 手動参照：チャットで `#brainstorming` と入力
- タスクの内容に応じて skills が自動的にアクティベートされる

## アップデート

```bash
cd /your/project
npx superpowers-ja
```

インストールコマンドを再実行するだけで最新版に更新できます。

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- Kiro 公式ドキュメント: https://kiro.dev/docs/steering/
