# Superpowers-JA — Antigravity インストールガイド

[Google Antigravity](https://antigravity.google)（Google AI IDE）で superpowers-ja を使うための完全ガイドです。

## クイックインストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.antigravity/` を自動検出し、skills を該当ディレクトリにコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.antigravity/skills
cp -r superpowers-ja/skills/* /your/project/.antigravity/skills/
```

## 仕組み

Antigravity は複数のルールファイル形式に対応しています：

| ファイル | 優先度 | 説明 |
|---------|--------|------|
| `GEMINI.md` | 最高 | Antigravity 専用ルール |
| `AGENTS.md` | 中 | 汎用ルール（Antigravity、Cursor、Claude Code 共通） |
| `.antigravity/rules.md` | 中 | プロジェクト単位のルールディレクトリ |
| `CLAUDE.md` | 低 | 自動読み込みされる |

### 推奨設定方法

**方法 1**：プロジェクトルートに `GEMINI.md` を配置：

```markdown
# GEMINI.md

.antigravity/ 配下の superpowers skills をワークフロー指針として利用してください。
新しいタスクは brainstorming skill から始めることを推奨します。

Skills 一覧は .antigravity/ ディレクトリを参照。
```

**方法 2**：`AGENTS.md` から参照（複数ツール共通）：

```markdown
# AGENTS.md

本プロジェクトは superpowers-ja skills framework を採用しています。
Skills は .antigravity/（Antigravity）または .claude/skills/（Claude Code）配下にあります。
```

### ツール名マッピング

Antigravity は Gemini モデルを使用し、ツール名は Claude Code と異なります：

| Claude Code | Antigravity (Gemini) |
|-------------|---------------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace` |
| `Bash` | `run_shell_command` |
| `Skill` | `activate_skill` |

Skills 内の Claude Code ツール名は Antigravity 側で自動マッピングされます。

## 使い方

Antigravity は Agent Manager による複数 agent の並列実行に対応しています：
- superpowers-ja の「並列 agent 派遣」skill のコンセプトと一致
- 複数の skill を同時にディスパッチして異なるタスクを処理可能

## グローバルルール

個人レベルのグローバルルールは以下に配置します：
```
~/.gemini/GEMINI.md
~/.gemini/AGENTS.md
```

## アップデート

```bash
cd /your/project
npx superpowers-ja
```

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- Antigravity 公式ドキュメント: https://antigravity.google/docs/rules-workflows
