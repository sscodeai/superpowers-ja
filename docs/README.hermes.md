# Superpowers-JA — Hermes Agent インストールガイド

[Hermes Agent](https://github.com/NousResearch/hermes-agent) で superpowers-ja を使うための完全ガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja --tool hermes
```

インストールスクリプトが skills を `.hermes/skills/` にコピーし、`HERMES.md` ブートストラップファイル（ツールマッピングと skills 一覧を含む）を自動生成します。

プロジェクトにすでに `.hermes` ディレクトリまたは `HERMES.md` がある場合は自動検出されます：

```bash
npx superpowers-ja   # 自動検出
```

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.hermes/skills
cp -r superpowers-ja/skills/* /your/project/.hermes/skills/
```

## HERMES.md による起動時読み込み

Hermes Agent はセッション開始時に、プロジェクトルートの `HERMES.md`（または `.hermes.md`）を context として自動ロードします。インストーラがこのファイルを自動生成し、以下の内容を含みます：

- ツールマッピング表（Claude Code → Hermes Agent のツール名対応）
- 利用可能な skills の一覧と description
- 基本ルールと使い方の説明

## config.yaml で外部 skills ディレクトリを設定

superpowers-ja skills をグローバルに使う場合、`~/.hermes/config.yaml` で設定できます：

```yaml
skills:
  external_dirs:
    - /path/to/superpowers-ja/skills
```

## ツールマッピング

Skills 内で参照される Claude Code ツール名は、Hermes Agent の同等ツールに対応します：

| Claude Code | Hermes Agent |
|-------------|-------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `patch` |
| `Bash` | `terminal` |
| `Grep` / `Glob` | `search_files` |
| `Skill` | `skill_view` |
| `Task`（サブエージェント） | `delegate_task` |
| `WebSearch` | `web_search` |
| `WebFetch` | `web_extract` |
| `TodoWrite` | `todo` |

完全なマッピングは `skills/using-superpowers/references/hermes-tools.md` を参照してください。

## Skill の使い方

Hermes Agent は 3 段階の漸進ロードに対応しています：

```
# 利用可能な skill 一覧を取得
skills_list

# 特定 skill の本体をロード
skill_view("brainstorming")

# Skill が参照するファイルを表示
skill_view("using-superpowers", "references/hermes-tools.md")
```

## トラブルシューティング

### Skills が発見されない場合

1. `.hermes/skills/` が存在し、skill フォルダが含まれていることを確認
2. 各 skill ディレクトリに `SKILL.md` があることを確認
3. `skills_list` で発見された skill を確認

### HERMES.md がロードされない場合

1. ファイルがプロジェクトルート（`.hermes/` と同階層）にあることを確認
2. ファイル名は `HERMES.md` または `.hermes.md` のいずれか

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- Hermes Agent 公式ドキュメント: https://hermes-agent.nousresearch.com/docs/
