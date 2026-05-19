# Superpowers-JA — Aider インストールガイド

[Aider](https://aider.chat) で superpowers-ja を使うための完全ガイドです。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.aider.conf.yml` を自動検出し、skills を `.aider/skills/` 配下にコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.aider/skills
cp -r superpowers-ja/skills/* /your/project/.aider/skills/
```

## CONVENTIONS.md から参照する

Aider は `CONVENTIONS.md` をネイティブにサポートしています。以下のように skills を参照します：

```markdown
# プロジェクト規約

## 作業手法

本プロジェクトは superpowers-ja skills を作業手法として採用しています。
Skills は `.aider/skills/` 配下にあり、各サブディレクトリの SKILL.md が
1 つのワークフローを定義します。

- 新機能開発：まず brainstorming skill を使う
- コード実装：test-driven-development skill に従う
- 問題調査：systematic-debugging skill を使う
```

## .aider.conf.yml で読み込む

`.aider.conf.yml` に `read` 設定を追加して skills を読み込みます：

```yaml
read:
  - .aider/skills/brainstorming/SKILL.md
  - .aider/skills/test-driven-development/SKILL.md
  - .aider/skills/systematic-debugging/SKILL.md
```

## トラブルシューティング

### Skills が認識されない場合

1. `.aider/skills/` ディレクトリが存在し、skill フォルダが含まれていることを確認
2. `CONVENTIONS.md` または `.aider.conf.yml` で skills を参照していることを確認
3. Aider は `CONVENTIONS.md` を自動読み込みするため、追加設定は不要です

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- Aider 公式ドキュメント: https://aider.chat/docs/
