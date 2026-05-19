# Superpowers-JA — Qwen Code インストールガイド

[Qwen Code](https://tongyi.aliyun.com/qianwen)（通義霊碼）で superpowers-ja を使うための完全ガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.qwen/` を自動検出し、skills を `.qwen/skills/` にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.qwen/skills
cp -r superpowers-ja/skills/* /your/project/.qwen/skills/
```

または、グローバルインストール：

```bash
mkdir -p ~/.qwen/skills
cp -r superpowers-ja/skills/* ~/.qwen/skills/
```

## Skill 読み込み優先度

| 配置場所 | 優先度 | 説明 |
|---------|--------|------|
| `.qwen/skills/` | 最高 | プロジェクト単位、当該プロジェクトのみ |
| `~/.qwen/skills/` | 中 | ユーザー単位、全プロジェクト共通 |

## 使い方

インストール完了後 Qwen Code を再起動すると、skills が自動的に有効になります。

Qwen Code では以下のように skills を呼び出せます：

```
brainstorming skill でこの要件を分析してください
```

```
test-driven-development skill の手順でこの機能を実装してください
```

## トラブルシューティング

### Skills が認識されない場合

1. `.qwen/skills/` ディレクトリが存在し、skill フォルダが含まれていることを確認
2. 各 skill に有効な YAML frontmatter を持つ `SKILL.md` があることを確認
3. Qwen Code を再起動するか、セッションをリフレッシュ

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- 通義霊碼公式ドキュメント: https://tongyi.aliyun.com/lingma
