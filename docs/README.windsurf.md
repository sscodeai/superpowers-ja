# Superpowers-JA — Windsurf インストールガイド

[Windsurf](https://codeium.com/windsurf) で superpowers-ja を使うための完全ガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.windsurf/` を自動検出し、skills を `.windsurf/skills/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
cp -r superpowers-ja/skills /your/project/.windsurf/skills
```

または、グローバルインストール：

```bash
cp -r superpowers-ja/skills ~/.windsurf/skills
```

## Skill 読み込み優先度

| 配置場所 | 優先度 | 説明 |
|---------|--------|------|
| `.windsurf/skills/` | 最高 | プロジェクト単位、当該プロジェクトのみ |
| `~/.windsurf/skills/` | 中 | ユーザー単位、全プロジェクト共通 |

## 使い方

インストール完了後 Windsurf を再起動すると、skills が自動的に有効になります。

`.windsurfrules` から skills ディレクトリを参照することもできます：

```
.windsurf/skills/ 配下の SKILL.md を作業手法として参照してください。
```

## トラブルシューティング

### Skills が認識されない場合

1. `.windsurf/skills/` ディレクトリが存在し、skill フォルダが含まれていることを確認
2. 各 skill に有効な YAML frontmatter を持つ `SKILL.md` があることを確認
3. Windsurf を再起動

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- Windsurf 公式ドキュメント: https://docs.codeium.com/windsurf
