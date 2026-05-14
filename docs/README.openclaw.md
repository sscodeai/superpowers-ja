# Superpowers-JA — OpenClaw インストールガイド

[OpenClaw](https://github.com/anthropics/openclaw) で superpowers-ja を使うための完全ガイドです。

## クイックインストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.openclaw/` を自動検出し、skills を `skills/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
cp -r superpowers-ja/skills/* /your/project/skills/
```

または、全プロジェクト共通（グローバル）にインストール：

```bash
cp -r superpowers-ja/skills/* ~/.openclaw/skills/
```

## 仕組み

OpenClaw は以下の優先度で skills をロードします：

| 配置場所 | 優先度 | 説明 |
|---------|--------|------|
| `<workspace>/skills/` | 最高 | ワークスペース単位、現プロジェクト専用 |
| `~/.openclaw/skills/` | 中 | ユーザー単位、全プロジェクト共通 |
| 内蔵 skills | 最低 | OpenClaw 標準同梱 |

各 skill は `skills/{name}/SKILL.md` で、YAML frontmatter と指示本体を含みます。OpenClaw が自動発見・ロードします。

### 推奨設定方法

プロジェクトルートの `CLAUDE.md` または `AGENTS.md` で参照します：

```markdown
# CLAUDE.md

本プロジェクトは superpowers-ja skills framework を採用しています。
新しいタスクは brainstorming skill から始めることを推奨します。
Skills は skills/ 配下にあります。
```

### ツールマッピング

OpenClaw は Claude Code と同じツール名を使うため、skills の追加適応は不要です：

| 用途 | OpenClaw | Claude Code |
|------|----------|-------------|
| ファイル読み込み | `Read` | `Read` |
| ファイル書き込み | `Write` | `Write` |
| 編集 | `Edit` | `Edit` |
| ターミナル | `Bash` | `Bash` |
| Skills | `Skill` | `Skill` |

## 使い方

インストール完了後 OpenClaw を再起動すると、すべての skills が有効になります。AI はタスクの context に応じて自動的に skill を呼び出します：

- 新しいタスク / 新機能 → `brainstorming`
- commit message を書く → `japanese-commit-conventions`
- バグ調査 → `systematic-debugging`
- タスク完了後 → `requesting-code-review`

手動の slash command は不要です。AI は skill frontmatter の `description` から自律的に skill を選択します。明示的に skill を呼び出したい場合は指示文で名指ししてください：「brainstorming で X の進め方を整理してほしい」

## グローバル Skills

全プロジェクトで superpowers-ja を使いたい場合：

```bash
mkdir -p ~/.openclaw/skills
cp -r superpowers-ja/skills/* ~/.openclaw/skills/
```

`~/.openclaw/openclaw.json` で追加 skills ディレクトリを指定することもできます：

```json
{
  "skills": {
    "load": {
      "extraDirs": ["/path/to/superpowers-ja/skills"]
    }
  }
}
```

## アップデート

```bash
cd /your/project
npx superpowers-ja
```

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
