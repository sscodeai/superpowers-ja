# Superpowers-JA — Codex CLI インストールガイド

Codex で superpowers-ja を使うための完全ガイドです。

## クイックインストール

Codex に以下を伝えるだけです：

```
Fetch and follow instructions from https://raw.githubusercontent.com/sscodeai/superpowers-ja/refs/heads/main/.codex/INSTALL.md
```

## 手動インストール

### 前提条件

- OpenAI Codex CLI
- Git

### 手順

1. リポジトリをクローン：
   ```bash
   git clone https://github.com/sscodeai/superpowers-ja.git ~/.codex/superpowers-ja
   ```

2. skills のシンボリックリンクを作成：
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/superpowers-ja/skills ~/.agents/skills/superpowers
   ```

3. Codex を再起動

4. **サブエージェント skill（任意）：** `dispatching-parallel-agents` と `subagent-driven-development` は Codex のマルチエージェント機能が必要です。Codex の設定に以下を追加してください：
   ```toml
   [features]
   multi_agent = true
   ```

### Windows

シンボリックリンクの代わりに junction を使います（開発者モード不要）：

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
cmd /c mklink /J "$env:USERPROFILE\.agents\skills\superpowers" "$env:USERPROFILE\.codex\superpowers-ja\skills"
```

## 仕組み

Codex は skill discovery をネイティブにサポートしています。起動時に `~/.agents/skills/` を走査して SKILL.md の frontmatter を解析し、必要に応じて skill をロードします。1 つのシンボリックリンクですべての skills を登録できます：

```
~/.agents/skills/superpowers/ → ~/.codex/superpowers-ja/skills/
```

`using-superpowers` skill が自動的に発見され、skill 利用ルールを強制します。追加設定は不要です。

## 使い方

Skills は自動発見されます。Codex は以下の場合に skill を起動します：
- skill 名を指示したとき（例：「use brainstorming」）
- タスクが skill description に合致したとき
- `using-superpowers` skill が他の skill を呼ぶよう指示したとき

## アップデート

```bash
cd ~/.codex/superpowers-ja && git pull
```

シンボリックリンク経由なので、skills は即座に反映されます。

## アンインストール

```bash
rm ~/.agents/skills/superpowers
```

**Windows (PowerShell):**
```powershell
Remove-Item "$env:USERPROFILE\.agents\skills\superpowers"
```

クローンしたリポジトリも削除する場合：`rm -rf ~/.codex/superpowers-ja`

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
