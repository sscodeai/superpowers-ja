---
name: using-git-worktrees
description: 現在の作業ツリーから隔離した feature 開発を始める場合、または実装計画の実行前に使用する。git worktree で安全な隔離作業区を作る。
---

# Using Git Worktrees

## Overview

作業が isolated workspace で行われるようにする。まず platform の native worktree tool を優先する。native tool がない場合だけ、manual `git worktree` に fallback する。

**Core principle:** 先に existing isolation を検出する。次に native tool を使う。最後に git fallback。harness と対立しない。

**開始時の宣言:** 「using-git-worktrees skill を使って、隔離された作業区を準備します。」

## Step 0: Existing Isolation を検出する

**何かを作成する前に、すでに isolated workspace にいるか確認する。**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard:** git submodule 内でも `GIT_DIR != GIT_COMMON` になる。worktree 内と判断する前に、submodule ではないことを確認する。

```bash
# path が返る場合、ここは submodule 内であり worktree ではない。通常 repository として扱う
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**`GIT_DIR != GIT_COMMON` かつ submodule でない場合:** すでに linked worktree 内にいる。Step 3（project setup）へ進む。**新しい worktree を作らない。**

branch 状態に応じて報告する。

- branch 上: 「すでに isolated workspace `<path>`、branch `<name>` にいます。」
- detached HEAD: 「すでに isolated workspace `<path>` にいます（detached HEAD、外部管理）。完了時に branch 作成が必要です。」

**`GIT_DIR == GIT_COMMON`、または submodule 内の場合:** 通常の repository checkout にいる。

ユーザーが instructions で worktree preference をすでに示しているか確認する。示していない場合は、worktree 作成前に同意を取る。

> 「現在の branch を保護するため、隔離された worktree を作って作業しますか。」

ユーザーがすでに preference を示している場合は従い、再確認しない。拒否された場合は current directory で作業し、Step 3 へ進む。

## Step 1: Isolated Workspace を作成する

**二つの mechanism がある。次の順で試す。**

### 1a. Native Worktree Tool（preferred）

Step 0 で isolated workspace の作成に同意がある。すでに worktree を作る native method があるか確認する。例: `EnterWorktree`、`WorktreeCreate` tool、`/worktree` command、`--worktree` flag。

使える場合はそれを使い、Step 3 へ進む。

native tool は directory placement、branch creation、cleanup を自動で扱う。native tool があるのに `git worktree add` を使うと、harness が見えず管理できない phantom state を作る。

native worktree tool がない場合だけ Step 1b へ進む。

### 1b. Git Worktree Fallback

**Step 1a が使えない場合だけ使う。** native worktree tool がないため、manual に git で worktree を作る。

#### Directory Selection

次の優先順位で選ぶ。明示的なユーザー preference は、observed filesystem state より常に優先する。

1. **instructions に worktree directory preference があるか確認する。** ユーザーが指定している場合は、質問せず使う。

2. **project local worktree directory があるか確認する。**

   ```bash
   ls -d .worktrees 2>/dev/null     # preferred, hidden directory
   ls -d worktrees 2>/dev/null      # fallback
   ```

   見つかったものを使う。両方ある場合は `.worktrees` を優先する。

3. **global directory があるか確認する。**

   ```bash
   project=$(basename "$(git rev-parse --show-toplevel)")
   ls -d ~/.config/superpowers/worktrees/$project 2>/dev/null
   ```

   見つかった場合は使う（legacy global path との互換）。

4. **他に判断材料がない場合**、project root 配下の `.worktrees/` を default とする。

#### Safety Verification（project local directory のみ）

**worktree 作成前に、directory が ignore されていることを必ず確認する。**

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**ignore されていない場合:** `.gitignore` に追加し、その変更を commit してから続行する。

**なぜ重要か:** worktree content が repository に誤って commit されることを防ぐ。

global directory（`~/.config/superpowers/worktrees/`）ではこの確認は不要。

#### Create Worktree

```bash
project=$(basename "$(git rev-parse --show-toplevel)")

# selected location に応じて path を決める
# project local: path="$LOCATION/$BRANCH_NAME"
# global: path="~/.config/superpowers/worktrees/$project/$BRANCH_NAME"

git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**sandbox fallback:** `git worktree add` が permission error（sandbox denial）で失敗した場合、sandbox が worktree 作成をブロックしたことをユーザーに伝える。current directory で作業し、setup と baseline test をその場で実行する。

## Step 3: Project Setup

該当する setup command を自動検出して実行する。

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

## Step 4: Clean Baseline を検証する

test を実行し、workspace の初期状態が clean であることを確認する。

```bash
# project に合う command を使う
npm test / cargo test / pytest / go test ./...
```

**test が fail した場合:** failure を報告し、続行するか調査するか確認する。

**test が pass した場合:** ready と報告する。

### Report

```text
worktree ready: <full-path>
tests passed (<N> tests, 0 failures)
ready to implement <feature-name>
```

## Quick Reference

| Situation | Action |
| --- | --- |
| already in linked worktree | creation を skip（Step 0） |
| in submodule | normal repository として扱う（Step 0 guard） |
| native worktree tool available | それを使う（Step 1a） |
| no native tool | git worktree fallback（Step 1b） |
| `.worktrees/` exists | 使う（ignore 済みを verify） |
| `worktrees/` exists | 使う（ignore 済みを verify） |
| both exist | `.worktrees/` を使う |
| neither exists | instructions file を確認し、その後 `.worktrees/` default |
| global path exists | 使う（backward compatibility） |
| directory not ignored | add to `.gitignore` + commit |
| permission error during creation | sandbox fallback、current directory で作業 |
| baseline test fails | failure を報告 + 確認 |
| no package.json / Cargo.toml | dependency install を skip |

## Common Mistakes

### Fighting The Harness

- 問題: platform がすでに isolation を提供しているのに `git worktree add` を使う
- fix: Step 0 で existing isolation を検出する。Step 1a で native tool に任せる

### Skipping Detection

- 問題: existing worktree の中に another worktree を nested create する
- fix: 何かを作る前に必ず Step 0 を実行する

### Skipping Ignore Verification

- 問題: worktree content が tracked され、git status を汚す
- fix: project local worktree 作成前に必ず `git check-ignore` を使う

### Assuming Directory Location

- 問題: inconsistency を生み、project convention に反する
- fix: priority に従う。existing directory > global legacy path > instructions file > default

### Continuing With Failing Tests

- 問題: new bug と existing issue を区別できない
- fix: failure を報告し、明示許可を得てから続行する

## Red Lines

**絶対にしないこと:**

- Step 0 で existing isolation が検出されたのに worktree を作る
- `EnterWorktree` のような native worktree tool があるのに `git worktree add` を使う。これが #1 mistake。あるなら使う
- Step 1a を skip して Step 1b の git command へ直行する
- ignore 確認なしに project local worktree を作る
- baseline test verification を skip する
- failing tests のまま、確認なしに続行する

**必ずすること:**

- 最初に Step 0 detection を実行する
- native tool を優先し、次に git fallback
- directory priority に従う: existing directory > global legacy path > instructions file > default
- project local directory は ignore 済みを verify する
- project setup を自動検出して実行する
- clean baseline test を verify する

## Integration

**この skill を呼び出す skill:**

- **brainstorming** - design 承認後、実装が必要な場合
- **subagent-driven-development** - task 実行前に必須
- **executing-plans** - task 実行前に必須
- isolated workspace が必要なすべての skill

**併用する skill:**

- **finishing-a-development-branch** - 作業完了後の cleanup に必須
