# Superpowers-JA — Codex CLI インストールガイド

Codex で superpowers-ja を使うための完全ガイドです。

## クイックインストール

プロジェクトディレクトリで実行します：

```bash
cd /your/project
npx superpowers-ja --tool codex
```

`superpowers-ja` は project-local に `.codex/skills/` を作成し、skills をコピーします。ホームディレクトリ (`~`) へのインストールは推奨しません。

## 手動インストール

### 前提条件

- OpenAI Codex CLI
- Git

### 手順

1. リポジトリをクローン：
   ```bash
   git clone https://github.com/sscodeai/superpowers-ja.git /tmp/superpowers-ja
   ```

2. project-local な skills ディレクトリへコピー：
   ```bash
   mkdir -p /your/project/.codex/skills
   cp -R /tmp/superpowers-ja/skills/* /your/project/.codex/skills/
   ```

3. Codex を再起動

4. **サブエージェント skill（任意）：** `dispatching-parallel-agents` と `subagent-driven-development` は Codex のマルチエージェント機能が必要です。Codex の設定に以下を追加してください：
   ```toml
   [features]
   multi_agent = true
   ```

### Windows

PowerShell で project-local にコピーします：

```powershell
New-Item -ItemType Directory -Force -Path ".codex\skills"
Copy-Item -Recurse -Force "C:\path\to\superpowers-ja\skills\*" ".codex\skills\"
```

## 仕組み

Codex は skill discovery をネイティブにサポートしています。プロジェクト内の `.codex/skills/` を走査して SKILL.md の frontmatter を解析し、必要に応じて skill をロードします。

```
.codex/skills/using-superpowers/SKILL.md
.codex/skills/brainstorming/SKILL.md
.codex/skills/test-driven-development/SKILL.md
```

`using-superpowers` skill が自動的に発見され、skill 利用ルールを強制します。追加設定は不要です。

## 使い方

Skills は自動発見されます。Codex は以下の場合に skill を起動します：
- skill 名を指示したとき（例：「use brainstorming」）
- タスクが skill description に合致したとき
- `using-superpowers` skill が他の skill を呼ぶよう指示したとき

## アップデート

```bash
cd /your/project
npx superpowers-ja --tool codex
```

インストールコマンドを再実行すると、`.codex/skills/` の superpowers-ja skills が更新されます。

## アンインストール

```bash
npx superpowers-ja --uninstall
```

**Windows (PowerShell):**
```powershell
npx superpowers-ja --uninstall
```

手動コピーした場合は `.codex/skills/` 配下の superpowers-ja skill directory を削除してください。

## 個人グローバル運用（上級者向け）

複数プロジェクトで同じ checkout を共有したい場合だけ、Codex の user-level skill discovery に symlink / junction を置きます。この運用は全プロジェクトに影響するため、チーム利用では project-local install を推奨します。

```bash
git clone https://github.com/sscodeai/superpowers-ja.git ~/.codex/superpowers-ja
mkdir -p ~/.agents/skills
ln -s ~/.codex/superpowers-ja/skills ~/.agents/skills/superpowers
```

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
