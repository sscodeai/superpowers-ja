@./skills/using-superpowers/SKILL.md
@./skills/using-superpowers/references/gemini-tools.md

# Superpowers-JA 日本語・日本 IT 開発版

superpowers-ja skill フレームワーク（20 skills）を読み込んでいます。

## 基本ルール

1. **タスクを受けたら、該当する skill がないか先に確認する** — 1% でも可能性があれば確認する
2. **設計を実装より先に行う** — 機能追加や仕様変更では、まず brainstorming skill で要求と制約を整理する
3. **テストを実装より先に考える** — 可能な限り TDD で進める
4. **完了宣言より先に検証する** — 完了、修正済み、テスト済みと述べる前に検証コマンドを実行し、結果を確認する

## 日本向け Skills

- **japanese-code-review**: 日本の開発現場向けコードレビュー参考。丁寧だが曖昧にしない指摘、重大度ラベル、承認前チェック、SI/受託/自社開発での証跡の残し方。
- **japanese-commit-conventions**: 日本語チーム向け commit / changelog 規約。Conventional Commits、Backlog/Redmine/Jira、release note と合わせた運用。
- **japanese-documentation**: 仕様書、設計書、README、API 仕様、運用手順での日英混在、表記ゆれ、受入条件、証跡の残し方。
- **japanese-git-workflow**: GitHub、GitLab、Bitbucket、Backlog、Redmine、Jira、ブランチ戦略、承認、証跡、リリース管理。

## 使い方

タスクが skill に該当する場合は、対応する `.gemini/skills/<skill-name>/SKILL.md` を読み込み、その手順に従ってください。
