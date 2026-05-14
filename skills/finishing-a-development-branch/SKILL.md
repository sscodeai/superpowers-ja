---
name: finishing-a-development-branch
description: 実装完了後、テスト通過後、作業を merge / PR / 保持 / 破棄のどれで終えるか判断する場合に使用する。
---

# 開発ブランチの完了

## 概要

開発作業の終わり方を、明確な選択肢として提示し、選ばれた workflow を安全に実行する。

**基本原則:** テスト検証 → 環境確認 → 選択肢提示 → 選択内容の実行 → 必要な cleanup。

**開始時の宣言:** 「finishing-a-development-branch skill を使って、この作業の完了処理を進めます。」

## 手順

### Step 1: テストを検証する

**選択肢を提示する前に、テストが通ることを確認する。**

```bash
# プロジェクトの test suite を実行する
npm test / cargo test / pytest / go test ./...
```

**テストが失敗した場合:**

```text
テストが失敗しています（<N> 件）。先に修正が必要です。

[失敗内容を表示]

テストが通るまで merge / PR 作成には進めません。
```

ここで停止する。Step 2 へ進まない。

**テストが通った場合:** Step 2 へ進む。

### Step 2: 作業環境を確認する

**選択肢を提示する前に、現在の worktree 状態を確認する。**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

この結果で、提示する menu と cleanup 方針が決まる。

| 状態 | Menu | Cleanup |
| --- | --- | --- |
| `GIT_DIR == GIT_COMMON`（通常 repository） | 標準の 4 択 | cleanup する worktree なし |
| `GIT_DIR != GIT_COMMON` かつ named branch | 標準の 4 択 | 作成元を確認して判断 |
| `GIT_DIR != GIT_COMMON` かつ detached HEAD | merge なしの 3 択 | 外部管理として cleanup しない |

### Step 3: base branch を特定する

```bash
# よく使われる base branch を試す
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

不明な場合は確認する: 「この branch は main から切ったもので合っていますか。」

### Step 4: 選択肢を提示する

**通常 repository または named branch worktree の場合は、正確に次の 4 択を提示する。**

```text
実装は完了しています。次を選んでください。

1. ローカルで <base-branch> に merge する
2. push して Pull Request を作成する
3. branch / worktree をこのまま残す
4. この作業を破棄する

どれにしますか。
```

**detached HEAD の場合は、正確に次の 3 択を提示する。**

```text
実装は完了しています。現在は detached HEAD です（外部管理の worktree と判断します）。

1. 新しい branch として push し、Pull Request を作成する
2. 現状をこのまま残す
3. この作業を破棄する

どれにしますか。
```

余計な説明を足さず、選択肢を簡潔に保つ。

### Step 5: 選択内容を実行する

#### Option 1: ローカル merge

```bash
# main repository root へ移動し、CWD を安全にする
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# 先に merge する。何かを削除する前に merge 成功を確認する
git checkout <base-branch>
git pull
git merge <feature-branch>

# merge 後の状態で再度 test を検証する
<test command>
```

merge と検証が成功した後、Step 6 の cleanup を行い、branch を削除する。

```bash
git branch -d <feature-branch>
```

#### Option 2: push して PR を作成

```bash
git push -u origin <feature-branch>

gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
- <変更点 1>
- <変更点 2>

## Test Plan
- [ ] <検証手順>
EOF
)"
```

PR feedback への対応で worktree が必要になるため、cleanup しない。

#### Option 3: 現状を残す

次のように報告する。

```text
branch <name> を残しました。worktree は <path> に残っています。
```

worktree は cleanup しない。

#### Option 4: 破棄

**先に確認する。**

```text
次の内容を完全に削除します。

- branch: <name>
- commits: <commit-list>
- worktree: <path>

破棄する場合は `discard` と入力してください。
```

正確に `discard` と入力されるまで実行しない。

確認後:

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

Step 6 の cleanup を行い、branch を強制削除する。

```bash
git branch -D <feature-branch>
```

### Step 6: worktree を cleanup する

**Option 1 と Option 4 の場合だけ実行する。** Option 2 と Option 3 では常に worktree を残す。

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**`GIT_DIR == GIT_COMMON` の場合:** 通常 repository なので cleanup する worktree はない。終了する。

**worktree path が `.worktrees/`、`worktrees/`、または `~/.config/superpowers/worktrees/` 配下の場合:** Superpowers が作成した worktree と判断し、cleanup 対象にする。

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune
```

**それ以外の場合:** harness や外部 tool が管理している worktree と判断し、削除しない。platform に worktree 終了用の手段があればそれを使う。なければそのまま残す。

## Quick Reference

| Option | Merge | Push | Worktree を残す | Branch cleanup |
| --- | --- | --- | --- | --- |
| 1. ローカル merge | yes | no | no | yes |
| 2. PR 作成 | no | yes | yes | no |
| 3. 現状維持 | no | no | yes | no |
| 4. 破棄 | no | no | no | yes, force |

## よくある失敗

**テスト検証を省略する**

- 問題: 壊れた code を merge したり、失敗する PR を作成したりする
- 対応: 選択肢を提示する前に必ず test を実行する

**自由回答の質問にする**

- 問題: 「次にどうしますか」だけでは曖昧
- 対応: 通常時は 4 択、detached HEAD では 3 択を正確に提示する

**Option 2 で worktree を cleanup する**

- 問題: PR feedback 対応に必要な worktree を消してしまう
- 対応: cleanup は Option 1 と Option 4 のみに限定する

**branch を先に消してから worktree を消そうとする**

- 問題: branch が worktree に参照されていて `git branch -d` が失敗する
- 対応: merge、worktree cleanup、branch 削除の順で進める

**削除対象 worktree の中で `git worktree remove` を実行する**

- 問題: CWD が削除対象内にあると command が失敗しやすい
- 対応: 実行前に main repository root へ `cd` する

**harness 管理の worktree を削除する**

- 問題: 外部環境が保持している作業状態を壊す
- 対応: Superpowers が作成したと判断できる path だけ cleanup する

**破棄時に確認を取らない**

- 問題: 作業成果を意図せず削除する
- 対応: `discard` の明示入力を要求する

## Red Lines

**絶対にしないこと:**

- テスト失敗のまま進める
- merge 後の状態で test を検証しない
- 確認なしに成果物を削除する
- 明示依頼なしに force push する
- merge 成功を確認する前に worktree を削除する
- 自分が作成したと判断できない worktree を削除する
- 削除対象 worktree の中で `git worktree remove` を実行する

**必ずすること:**

- 選択肢を提示する前に test を検証する
- menu を出す前に環境を確認する
- 通常時は 4 択、detached HEAD では 3 択を正確に提示する
- Option 4 では明示確認を取る
- cleanup は Option 1 と Option 4 のみに限定する
- worktree remove 前に main repository root へ移動する
- remove 後に `git worktree prune` を実行する

## Integration

**この skill を呼び出す skill:**

- **subagent-driven-development** - 全 task 完了後
- **executing-plans** - 全 batch 完了後

**併用する skill:**

- **using-git-worktrees** - この skill が作成した worktree の cleanup 方針と合わせる
