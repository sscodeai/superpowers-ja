# superpowers-ja

AI コーディングのための Superpowers 日本語・日本 IT 開発版です。

Upstream の [obra/superpowers](https://github.com/obra/superpowers) をベースに、汎用的な開発 skills を日本語化し、日本の SIer、受託開発、自社サービス開発でよく使うレビュー、Git、ドキュメント、コミット運用を追加しています。

## 特徴

| 項目 | 内容 |
| --- | --- |
| Skills | 20 個: upstream 系 14 個 + 日本向け 4 個 + 追加ワークフロー 2 個 |
| 対応ツール | Claude Code / Cursor / Codex / Gemini CLI / OpenCode / Kiro / Windsurf / Aider / Trae / VS Code Copilot など |
| 日本向け要素 | Backlog / Redmine / Jira、GitHub / GitLab / Bitbucket、稟議・承認・証跡、丁寧だが曖昧にしないレビュー、日英混在ドキュメント |
| インストール | `npx superpowers-ja` でプロジェクト内の AI 開発ツールを自動検出 |

## 何が変わるか

superpowers なし:

```text
あなた: ユーザー一覧に CSV エクスポートを追加して
AI: 実装します
AI: exportUsers() を追加しました
あなた: 仕様と違う。文字コード、権限、大量データ、監査ログは?
```

superpowers-ja あり:

```text
あなた: ユーザー一覧に CSV エクスポートを追加して
AI: 実装前に確認します。
    1. 文字コードは Shift_JIS / UTF-8 どちらですか?
    2. 想定件数と非同期処理の要否は?
    3. 権限、個人情報、監査ログの要件はありますか?
    4. Backlog / Jira のチケット番号はありますか?
```

## 日本向け Skills

下記 4 つは手動呼び出し用の参考 skill です。通常の自動ワークフローを邪魔しないよう、必要なときに明示して使います。

| Skill | 用途 | 呼び出し |
| --- | --- | --- |
| `japanese-code-review` | 日本のチームで使いやすいレビュー表現、指摘レベル、承認前チェック | `/japanese-code-review` |
| `japanese-git-workflow` | GitHub / GitLab / Bitbucket / Backlog / Redmine / Jira を前提にしたブランチ、PR/MR、CI 運用 | `/japanese-git-workflow` |
| `japanese-documentation` | 仕様書、設計書、README、API 仕様の日英混在ルールと日本語表現 | `/japanese-documentation` |
| `japanese-commit-conventions` | Conventional Commits を日本語チームで運用するための commit / changelog 規約 | `/japanese-commit-conventions` |

## Upstream 系 Skills

| Skill | 用途 |
| --- | --- |
| `brainstorming` | 実装前に要求、制約、設計方針を整理 |
| `writing-plans` | 仕様を実装計画へ分解 |
| `executing-plans` | 計画をチェックポイント付きで実行 |
| `test-driven-development` | テストを先に書いて実装 |
| `systematic-debugging` | 不具合を根本原因から調査 |
| `requesting-code-review` | 完了前にレビュー agent を依頼 |
| `receiving-code-review` | レビュー指摘を技術的に検証して反映 |
| `verification-before-completion` | 完了宣言前に検証コマンドを実行 |
| `dispatching-parallel-agents` | 独立タスクを並列 agent に分配 |
| `subagent-driven-development` | サブ agent とレビューを使って実装 |
| `using-git-worktrees` | 作業を隔離する git worktree 運用 |
| `finishing-a-development-branch` | PR、マージ、保持、破棄を判断 |
| `writing-skills` | 新しい skill の作成と検証 |
| `using-superpowers` | skills の使い方を定義するメタ skill |

## クイックスタート

```bash
cd /path/to/your/project
npx superpowers-ja
```

自動検出できない場合:

```bash
npx superpowers-ja --tool claude
npx superpowers-ja --tool cursor
npx superpowers-ja --tool codex
npx superpowers-ja --tool gemini
```

ユーザーのホームディレクトリ (`~`) にはインストールしないでください。プロジェクトごとの `CLAUDE.md`、`GEMINI.md`、skills ディレクトリへ bootstrap を追加する設計です。

## 対応ツール

| ツール | インストール先 |
| --- | --- |
| Claude Code / Copilot CLI | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Codex CLI | `.codex/skills/` |
| Gemini CLI | `.gemini/skills/` |
| OpenCode | `.opencode/skills/` |
| Aider | `.aider/skills/` |
| Kiro | `.kiro/steering/` |
| Windsurf | `.windsurf/skills/` |
| Trae | `.trae/skills/` |
| VS Code Copilot | `.github/superpowers/` |
| Hermes Agent | `.hermes/skills/` |
| Antigravity | `.antigravity/skills/` |
| OpenClaw | `skills/` |
| DeerFlow | `skills/custom/` |
| Qwen Code | `.qwen/skills/` |
| Claw Code | `.claw/skills/` |

## アンインストール

```bash
cd /path/to/your/project
npx superpowers-ja --uninstall
```

インストール済みの skill ディレクトリと、`CLAUDE.md` / `GEMINI.md` / `HERMES.md` / `CONVENTIONS.md` に追加した superpowers-ja セクションを削除します。既存の手書き内容は保持します。

## 開発方針

この fork は「日本の現場で AI agent がそのまま使える作法」を重視します。

- レビューは丁寧に、ただし重大度は曖昧にしない
- 仕様、受入条件、影響範囲、検証証跡を残す
- チケット番号、PR/MR、CI 結果、リリースノートをつなげる
- 個人情報、監査ログ、障害対応、運用引き継ぎを実装前に確認する
- 日本語と英語の技術用語を自然に混在させる

## License

MIT
