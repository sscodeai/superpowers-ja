# Superpowers-JA Release Notes

本ドキュメントは `sscodeai/superpowers-ja` 日本語 fork 自身のリリース履歴を記録します。上流 `obra/superpowers` の変更履歴については上流リポジトリを参照してください。

## v0.1.0 (2026-05)

`obra/superpowers` をベースに日本 IT 開発向け fork として最初のリリースを行いました。

### 初期構成

- **20 個の skill を提供**
  - 上流由来の汎用 skill 16 個（brainstorming、executing-plans、systematic-debugging、test-driven-development、verification-before-completion など）
  - 日本向け original skill 4 個
    - `japanese-code-review` — 重大度ラベル付き、丁寧な日本語レビュー表現
    - `japanese-commit-conventions` — 日本語 Conventional Commits
    - `japanese-documentation` — 日本の業務ドキュメント慣習
    - `japanese-git-workflow` — Backlog / Redmine / Jira 連携を意識した Git 運用

- **マルチツール対応**
  - Claude Code / Cursor / Codex CLI / Gemini CLI / Aider / Windsurf / Kiro / OpenCode / VSCode Copilot など主要 AI coding tool に対応
  - `npx superpowers-ja` 一行で導入可能

- **日本語 bootstrap**
  - セッション開始時に日本語で skill 一覧と利用方法を agent に提示

### 既知の制限

- 上流由来の長文 skill と参考資料には、まだ移植元の中文表現が残る箇所があります。次は `brainstorming`、`using-superpowers`、`test-driven-development`、`systematic-debugging`、`verification-before-completion` の順で日本語化します。詳細は [ROADMAP.md](ROADMAP.md) を参照してください。
- 日本向け original skill は 4 つです。今後、日本の SI / 受託開発で頻出する障害報告書、基本設計書、受入テスト仕様書などへの対応を予定しています。

### 検証

```bash
node bin/superpowers-ja.js --help
node bin/superpowers-ja.js --version
```

Claude target で 20 skills の install / uninstall が成功することを確認済みです。
