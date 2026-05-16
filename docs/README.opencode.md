# Superpowers-JA — OpenCode インストールガイド

[OpenCode.ai](https://opencode.ai) で superpowers-ja を使うための完全ガイドです。

## インストール

`opencode.json`（グローバルまたはプロジェクト単位）の `plugin` 配列に追加します：

```json
{
  "plugin": ["superpowers@git+https://github.com/sscodeai/superpowers-ja.git"]
}
```

OpenCode を再起動します。プラグインが Bun 経由で自動インストールされ、すべての skills が登録されます。

確認方法：「どんな superpowers を持っていますか?」と質問します。

## 使い方

### Skills を探す

OpenCode の `skill` ツールで利用可能な skills を一覧表示できます：

```
use skill tool to list skills
```

### Skill をロード

```
use skill tool to load superpowers/brainstorming
```

### 個人 Skills

`~/.config/opencode/skills/` 配下に自分の skill を作成できます：

```bash
mkdir -p ~/.config/opencode/skills/my-skill
```

`~/.config/opencode/skills/my-skill/SKILL.md` を作成：

```markdown
---
name: my-skill
description: [条件] のときに使う - [機能の説明]
---

# My Skill

[skill の本文]
```

### プロジェクト Skills

プロジェクトの `.opencode/skills/` 配下にプロジェクト単位の skill を配置できます。

**優先度**: プロジェクト skills > 個人 skills > Superpowers skills

## アップデート

OpenCode を再起動するたびに自動更新されます。プラグインは起動時に git リポジトリから再インストールされます。

特定バージョンに固定する場合：

```json
{
  "plugin": ["superpowers@git+https://github.com/sscodeai/superpowers-ja.git#vX.Y.Z"]
}
```

## 仕組み

プラグインは 2 つのことを行います：

1. **ブートストラップ context の注入** — `experimental.chat.system.transform` hook で、各対話に superpowers の利用ルールを注入
2. **skills ディレクトリの登録** — `config` hook で OpenCode にすべての skills を発見させる（シンボリックリンクや手動設定は不要）

### ツールマッピング

Claude Code 向けに書かれた skills は OpenCode 用に自動適応されます：

- `TodoWrite` → `todowrite`
- `Task`（サブエージェント） → OpenCode の `@mention` システム
- `Skill` ツール → OpenCode の `skill` ツール
- ファイル操作 → OpenCode のネイティブツール

## トラブルシューティング

### プラグインが読み込まれない場合

1. OpenCode のログを確認：`opencode run --print-logs "hello" 2>&1 | grep -i superpowers`
2. `opencode.json` のプラグイン設定が正しいか確認
3. OpenCode が最新版か確認

### Skills が見つからない場合

1. `skill` ツールで利用可能な skill 一覧を確認
2. プラグインが正しくロードされているか確認（上記参照）
3. 各 skill に有効な YAML frontmatter を持つ `SKILL.md` があるか確認

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- OpenCode 公式ドキュメント: https://opencode.ai/docs/
