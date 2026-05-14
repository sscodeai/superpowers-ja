# Superpowers-JA — Trae インストールガイド

[Trae](https://www.trae.ai)（ByteDance AI IDE）で superpowers-ja を使うための完全ガイドです。

## クイックインストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.trae/` を自動検出し、skills を `.trae/rules/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.trae/rules
cp -r superpowers-ja/skills/* /your/project/.trae/rules/
```

## 仕組み

Trae は `.rules` 機構で AI の振る舞いを管理します：

- **ディレクトリ**: `.trae/rules/`
- **フォーマット**: Markdown + metadata（description、globs、alwaysApply、priority）
- **ルール種別**:
  - **プロジェクトルール**（Project Rules）— 当該プロジェクトにのみ適用
  - **個人ルール**（Personal Rules）— ユーザー単位、プロジェクトルールにより上書き可能
- **優先度**: 1〜4（数値が大きいほど優先）

### Skills の適合

superpowers-ja の SKILL.md は Trae の rules としてそのまま利用できます。Trae は初期化時に `.trae/rules/` 配下のすべてのルールファイルをロードします。

### 推奨設定

インストール完了後、Trae の Builder Mode またはチャットで skill 名を指示すると起動します：

```
brainstorming skill でこの要件を分析してください
```

## 日本語サポート

Trae は日本語をネイティブサポートしており、superpowers-ja と相性が良いです：
- すべての skills が日本語
- 日本語コードレビュー、日本語 Git ワークフローなど日本向け skills がそのまま使える
- MCP プロトコル拡張に対応

## アップデート

```bash
cd /your/project
npx superpowers-ja
```

## アンインストール / 誤インストールの清掃

ホームディレクトリ（`~`）で誤って `npx superpowers-ja` を実行すると、skills と `.trae/rules/superpowers-ja.md` がホームに書き込まれることがあります。v0.1.0 では能動的に拒否しますが、古いバージョンで汚染されている可能性があります。清掃方法：

```bash
cd ~                                    # または対象プロジェクトディレクトリ
npx superpowers-ja@latest --uninstall
```

`.trae/skills/` にインストールされた skill、`.trae/rules/superpowers-ja.md`、および `CLAUDE.md` などのファイル内 superpowers-ja セクションが削除されます（自分で書いた内容は保持されます）。

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- Trae 公式ドキュメント: https://docs.trae.ai/ide/rules
