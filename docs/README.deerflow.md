# Superpowers-JA — DeerFlow 2.0 インストールガイド

[DeerFlow 2.0](https://github.com/bytedance/deer-flow)（ByteDance OSS SuperAgent）で superpowers-ja を使うための完全ガイドです。

## クイックインストール

```bash
cd /your/deerflow-project
npx superpowers-ja
```

インストールスクリプトが `deer_flow/` を自動検出し、skills を `skills/custom/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/deerflow-project/skills/custom
cp -r superpowers-ja/skills/* /your/deerflow-project/skills/custom/
```

## 仕組み

DeerFlow 2.0 は **Custom Skills** 機構で Agent 能力を拡張します：

- **ディレクトリ**: `skills/custom/`
- **フォーマット**: 各 skill は 1 ディレクトリで、`SKILL.md`（Markdown + YAML frontmatter）を含む
- **読み込み**: DeerFlow は `skills/custom/` 配下を自動走査し、`description` フィールドで skill をマッチング

### Skills フォーマット互換性

superpowers-ja の SKILL.md は DeerFlow の custom skills フォーマットと完全互換です。インストール後、DeerFlow が自動的にすべての skills を発見・読み込みます。

### 環境変数

DeerFlow プロジェクトがカレントディレクトリにない場合、インストールパスを手動指定できます：

```bash
export DEERFLOW_SKILLS_DIR=/path/to/deerflow/skills/custom
cp -r superpowers-ja/skills/* $DEERFLOW_SKILLS_DIR/
```

## 使い方

インストール後、DeerFlow との対話で skill 名を指示するだけです：

- 「ブレインストーミングでこの要件を分析してください」
- 「TDD でこの機能を実装してください」
- 「systematic-debugging の流れでこのバグを調査してください」

DeerFlow が skill の `description` に基づいて自動マッチングし、ロードします。

## アップデート

```bash
cd /your/deerflow-project
npx superpowers-ja
```

インストールコマンドを再実行するだけで最新版に更新できます。

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- DeerFlow 公式リポジトリ: https://github.com/bytedance/deer-flow
