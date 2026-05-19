# Release Checklist

`superpowers-ja` を npm / plugin marketplace 向けに出す前の確認手順です。
通常の開発では quick audit で十分ですが、release 前は配布物と version metadata まで確認します。

## 1. Version metadata

```bash
npm version patch --no-git-tag-version
npm run version
git diff -- package.json .claude-plugin/plugin.json .claude-plugin/marketplace.json .cursor-plugin/plugin.json .codex-plugin/plugin.json gemini-extension.json
```

- `package.json` と各 plugin manifest の version が一致していること
- `.claude-plugin/marketplace.json` の `plugins[0].version` が更新されていること
- 意図しない formatting 差分が出ていないこと

## 2. Local quality gate

```bash
node bin/superpowers-ja.js --help
node bin/superpowers-ja.js --version
bash scripts/audit.sh --quick --no-upstream
```

quick audit は local / offline 環境向けです。upstream alignment は network と upstream remote に依存するため、release 前には次の full audit も実行します。

```bash
bash scripts/audit.sh
```

full audit で確認すること:

- installer の install / reinstall / uninstall が全対応 tool で通ること
- upstream alignment の warning / failure が意図した差分だけであること
- README / docs / skill reference が壊れていないこと

## 3. Package contents

```bash
npm pack --dry-run --json
```

確認観点:

- `skills/` 配下の 23 skills が入っていること
- `bin/superpowers-ja.js` が executable mode で入っていること
- `docs/`、`hooks/`、plugin manifest、`RELEASE-NOTES.md`、`ROADMAP.md` が入っていること
- `evals/` や test transcript など、公開 package に含めない運用資料が入っていないこと

## 4. Eval evidence

original skill を追加または大きく更新した場合は、release 前に `evals/transcripts/` を更新します。

```bash
ls evals/transcripts
```

transcript には次を残します。

- scenario と user prompt
- expected behavior
- 実際の出力要約
- pass / fail 判定と理由
- follow-up が必要な改善点

## 5. Release notes

`RELEASE-NOTES.md` の `Unreleased` を見直し、ユーザーに伝えるべき変更だけを残します。

- 新規 skill / 主要改善 / breaking change を優先する
- 内部 refactor は、利用者に影響がある場合だけ書く
- release date を JST の実日付で記録する

## 6. Final smoke test

一時ディレクトリで最小 install / uninstall を確認します。

```bash
tmp="$(mktemp -d)"
(
  cd "$tmp"
  node /path/to/superpowers-ja/bin/superpowers-ja.js --tool codex
  test -f .codex/skills/using-superpowers/SKILL.md
  node /path/to/superpowers-ja/bin/superpowers-ja.js --uninstall
)
rm -rf "$tmp"
```

問題がなければ tag / publish に進みます。
