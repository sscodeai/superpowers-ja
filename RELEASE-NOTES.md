# Superpowers-JA Release Notes

本ドキュメントは `sscodeai/superpowers-ja` 日本語 fork 自身のリリース履歴を記録します。上流 `obra/superpowers` の変更履歴については上流リポジトリを参照してください。

## Unreleased

### 改善

- `scripts/audit.sh` の説明、category 名、failure message を日本語 fork 向けに整理
- README に「品質監査」section を追加し、audit category と local / CI での使い分けを明記
- demo 録画 guide と VHS tape の sample prompt / output を日本語 scenario に更新
- installer / version sync script の保守 comment を英語・日本語 project 向けに整理
- release 前の version sync、audit、package contents、eval transcript 確認を `docs/release-checklist.md` に整理

## v0.3.0 (2026-05-17)

### 追加

- `japanese-incident-report` を追加
  - 日本の IT 開発・運用現場向けの障害初報、続報、最終報告、原因分析、再発防止策を支援
  - 顧客向け / 社内向けの文体、JST 時系列、影響範囲、暫定対応、恒久対応、検証証跡を整理
- `japanese-acceptance-test-spec` を追加
  - 顧客検収、UAT、受入条件、証跡付き test case、判定基準を整理
  - Backlog / Redmine / Jira ticket と紐づく受入テスト仕様書の作成を支援
- `japanese-code-review-graph` を追加
  - `code-review-graph` 任意導入時に、影響範囲、risk、test gap を日本向け review 証跡へ整理
  - default install には外部 dependency を追加せず、optional integration として扱う
- `subagent-driven-development` を日本語化
  - main skill と 3 つのサブエージェント prompt template を日本語化
  - 上流の continuous execution 方針を反映し、同一 session での計画実行を明確化
- eval transcript 運用を追加
  - `evals/README.md` と transcript template を追加
  - `japanese-incident-report` の顧客向け最終報告 scenario を初回 eval として記録
  - `japanese-acceptance-test-spec` の注文 CSV エクスポート scenario を eval として追加
  - `japanese-code-review-graph` の影響範囲レビュー scenario を eval として追加

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

- 上流由来の長文 skill と参考資料には、まだ移植元の中文表現が残る箇所があります。日本語化の優先順位と進捗は [ROADMAP.md](ROADMAP.md) を参照してください。
- 日本向け original skill は継続的に拡充します。今後、日本の SI / 受託開発で頻出する基本設計書、受入テスト仕様書などへの対応を予定しています。

### 検証

```bash
node bin/superpowers-ja.js --help
node bin/superpowers-ja.js --version
```

Claude target で 20 skills の install / uninstall が成功することを確認済みです。
