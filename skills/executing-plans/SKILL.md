---
name: executing-plans
description: レビュー checkpoint を含む実装計画を、別 session で段階的に実行する場合に使用する。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [planning, execution]
---

# 実装計画の実行

## 概要

計画を読み込み、批判的に確認し、task を順番に実行し、完了時に結果を報告する。

**開始時の宣言:** 「executing-plans skill を使って、この計画を実行します。」

**注意:** Subagent を使える platform（Claude Code、Codex など）では、Superpowers は subagent と組み合わせると効果が高い。利用可能な場合は、この skill だけで進めず、`superpowers:subagent-driven-development` の利用を優先する。

## 手順

### Step 1: 計画を読み込み、批判的に確認する

1. 計画 file を読む
2. 計画を批判的に review し、問題や懸念を洗い出す
3. 懸念がある場合は、実装前に人間の担当者へ確認する
4. 懸念がない場合は TodoWrite を作成し、実行へ進む

**review で確認する観点:**

- task 間の依存関係に抜けがないか（A が B に依存するのに B が後ろにある、など）
- 検証条件が具体的か（「動作確認」ではなく「`npm test` が全件通る」まで書かれているか）
- 暗黙の環境前提がないか（Node version、DB 接続、API key など）

**review 例:**

```text
計画 file: docs/plan.md
task 数: 5

review 結果:
- task 3（DB migration 追加）は task 2（data model 作成）の後で、順序は妥当
- task 4 の検証条件が「動作確認」のみで曖昧。具体的な test command が必要
- Python version の前提が計画にない

確認事項:
「計画は概ね実行可能です。2 点だけ確認したいです。
1. task 4 の検証条件を `pytest tests/test_api.py` 全件通過にしてよいですか。
2. Python version は 3.12 前提でよいですか。」
```

### Step 2: task を実行する

各 task について次を行う。

1. **In progress にする** — TodoWrite を更新する
2. **目的を理解する** — task 説明と完了条件を読み直す
3. **実装する** — 計画に書かれた手順に従う
4. **検証する** — 指定された test / check を実行する
5. **commit する** — task 完了ごとに commit し、message に task 番号を入れる
6. **Done にする** — TodoWrite を更新する

**task ごとの進め方:**

```text
--- task 2/5: user validation を追加 ---
[in_progress に更新]

目的: /api/users に入力 validation を追加する
完了条件: validation test が全件通り、不正入力は 400 を返す

[実装]
- validateUser() middleware を追加
- email format、password strength、username length の 3 rule を追加

[検証]
$ npm test -- --grep "validation"
  ✓ rejects invalid email (12ms)
  ✓ rejects weak password (8ms)
  ✓ rejects long username (5ms)
  3 passing

[commit]
$ git add src/middleware/validate.js tests/validation.test.js
$ git commit -m "feat: add user input validation (task 2/5)"

[done に更新]
--- task 2/5 完了 ---
```

**batch review checkpoint:**

- 3 task 完了ごとに一度止まり、全体方針が計画からずれていないか確認する
- 前の実装に問題が見つかった場合は、先に修正してから次へ進む

### Step 3: よくある例外を処理する

**テスト失敗:**

1. error message を読み、失敗原因を特定する
2. 実装 bug、test 側の問題、計画の問題のどれかを切り分ける
3. 実装 bug の場合は修正して再実行する
4. test 側の問題の場合は test を修正し、理由を説明する
5. 計画の問題の場合は停止し、人間の担当者へ報告して修正案を出す

**依存関係の不足:**

```text
task 3 には Redis 接続が必要ですが、計画に Redis 設定が含まれていません。
ここで停止します。
提案: task 3 の前に「Redis 接続設定を追加する」task を挿入してください。
```

**指示が曖昧:**

- 意図を推測しない
- 理解していることと不明点を列挙する
- 回答を待ってから続行する

### Step 4: 開発を完了する

全 task が完了し、検証も通ったら:

- 「finishing-a-development-branch skill を使って、この作業の完了処理を進めます」と宣言する
- **必須 subskill:** `superpowers:finishing-a-development-branch`
- その skill の指示に従って、再検証、選択肢提示、merge / PR / 保持 / 破棄を行う

**完了報告 template:**

```markdown
## 実行報告

**計画:** docs/plan.md
**branch:** feature/user-validation
**task:** 5/5 completed

### 完了した task
1. ✅ project structure を初期化
2. ✅ user validation を追加
3. ✅ database migration を追加
4. ✅ API endpoint を実装
5. ✅ integration test を追加

### 検証結果
- unit test: 23/23 passed
- integration test: 8/8 passed
- lint: 0 warnings

### 計画との差分
- task 3: Redis 設定を env ではなく config.yaml へ変更（事前確認済み）

### 次の処理
finishing-a-development-branch skill に従って merge / PR を判断します
```

## 停止して確認する条件

**次の場合はすぐに停止する。**

- 依存不足、test failure、曖昧な指示などの blocker がある
- 計画に重大な欠陥があり、開始できない
- 指示の意味が理解できない
- 同じ test が 2 回以上連続で失敗する

不確実な場合は推測せず、確認する。

## 前の手順へ戻る条件

**Step 1 の review に戻る条件:**

- 人間の担当者が計画を更新した
- 根本的な approach を再検討する必要がある

blocker を抱えたまま強行しない。

## 注意事項

- 実装前に計画を批判的に review する
- 計画の手順に沿って実行する
- 検証を省略しない
- task ごとに commit し、commit message に task 番号を入れる
- 計画が要求する skill を使う
- blocker があれば止まり、推測で進めない
- ユーザーの明示同意なしに main / master branch で実装を始めない

## Integration

**必須 workflow skill:**

- **superpowers:using-git-worktrees** - 開始前に隔離された worktree を作る
- **superpowers:writing-plans** - この skill で実行する計画を作る
- **superpowers:finishing-a-development-branch** - 全 task 完了後に開発 branch を完了させる
