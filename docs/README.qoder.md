# Superpowers-JA — Qoder インストールガイド

[Qoder](https://qoder.com) で superpowers-ja を使うためのガイドです。

Qoder は skill directory と rules を組み合わせて AI の振る舞いを制御します。superpowers-ja では skills 本体を `.qoder/skills/` に配置し、`.qoder/rules/superpowers-ja.md` に常時有効の bootstrap rule を生成します。

## 自動インストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.qoder/` を検出すると、次を実行します。

- 23 個の skills を `.qoder/skills/<skill-name>/SKILL.md` にコピー
- `.qoder/rules/superpowers-ja.md` を生成
- rule に `trigger: always_on` を設定し、会話開始時に基本ルールと skill index を参照しやすくする

`.qoder/` がまだない project では、明示的に指定できます。

```bash
npx superpowers-ja --tool qoder
```

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.qoder/skills
cp -r superpowers-ja/skills/* /your/project/.qoder/skills/
```

> 手動コピーでは `.qoder/rules/superpowers-ja.md` の bootstrap rule は生成されません。自動呼び出しを安定させる場合は `npx superpowers-ja --tool qoder` を推奨します。

## Skill 読み込み優先度

| 配置場所 | 優先度 | 説明 |
|---------|--------|------|
| `.qoder/skills/` | 最高 | プロジェクト単位、当該プロジェクトのみ |
| `~/.qoder/skills/` | 中 | ユーザー単位、全プロジェクト共通 |

同名 skill がある場合は project 側を優先します。

## 使い方

インストール後、Qoder を再起動してください。`/` から skill を確認できる場合は、必要に応じて `/<skill-name>` で明示的に呼び出せます。

Qoder の rule schema は公開ドキュメントだけでは細部が変わる可能性があります。`trigger: always_on` が期待通りに動かない場合は、Qoder Settings から rule type を確認してください。

## Tool Mapping

skills 内の Claude Code tool 名は、多くの場合 Qoder でも同名または近い tool に対応します。

| Claude Code | Qoder |
| --- | --- |
| `Read` / `Write` / `Edit` | 同名または同等の file edit tool |
| `Bash` | shell / terminal 実行 tool |
| `Grep` / `Glob` | code search / file search |
| `Task` | Qoder の agent delegation |
| `TodoWrite` | task / todo 管理 |
| `EnterPlanMode` / `ExitPlanMode` | Spec mode 相当 |

日本語 project では、要件、検収条件、障害対応、運用引き継ぎの確認を先に行うよう、`brainstorming` と日本向け skills を優先してください。

## アンインストール

```bash
cd /your/project
npx superpowers-ja --uninstall
```

`.qoder/skills/` にコピーした superpowers-ja skills と `.qoder/rules/superpowers-ja.md` が削除されます。

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- プロジェクトホーム: https://github.com/sscodeai/superpowers-ja
- Qoder: https://qoder.com
