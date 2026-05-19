# Superpowers-JA — Gemini CLI インストールガイド

[Gemini CLI](https://github.com/google-gemini/gemini-cli) で superpowers-ja を使うための完全ガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.gemini/` を自動検出し、skills を `.gemini/skills/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.gemini/skills
cp -r superpowers-ja/skills/* /your/project/.gemini/skills/
```

または Gemini 拡張として（グローバル）インストール：

```bash
mkdir -p ~/.gemini/extensions/superpowers-ja/skills
cp -r superpowers-ja/skills/* ~/.gemini/extensions/superpowers-ja/skills/
cp superpowers-ja/gemini-extension.json ~/.gemini/extensions/superpowers-ja/
```

## GEMINI.md から参照する

プロジェクトルートの `GEMINI.md` で skills を参照します：

```markdown
# 作業手法

.gemini/skills/ 配下の SKILL.md を参照してください。
新機能開発時はまず brainstorming skill を使ってください。
コード実装時は test-driven-development skill に従ってください。
```

## Skill 読み込み優先度

| 配置場所 | 優先度 | 説明 |
|---------|--------|------|
| `.gemini/skills/` | 最高 | プロジェクト単位、当該プロジェクトのみ |
| `~/.gemini/extensions/*/skills/` | 中 | 拡張単位、全プロジェクト共通 |

## トラブルシューティング

### Skills が認識されない場合

1. `.gemini/skills/` ディレクトリが存在し、skill フォルダが含まれていることを確認
2. 各 skill に有効な YAML frontmatter を持つ `SKILL.md` があることを確認
3. Gemini CLI を再起動

### 拡張モードで読み込まれない場合

1. `gemini-extension.json` が拡張ディレクトリに正しく配置されていることを確認
2. ディレクトリ構造が `~/.gemini/extensions/superpowers-ja/` になっていることを確認

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- Gemini CLI 公式ドキュメント: https://github.com/google-gemini/gemini-cli
