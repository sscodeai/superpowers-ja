---
name: requesting-code-review
description: task 完了時、重要機能の実装後、merge 前に使用し、成果物が要求を満たしているか検証する。
---

# Requesting Code Review

code review subagent を dispatch し、問題が後続作業へ広がる前に見つける。reviewer には、評価のために精緻に組み立てた context だけを渡す。あなたの session history は渡さない。これにより reviewer は思考過程ではなく成果物へ集中でき、あなた自身の context も保てる。

**Core principle:** 早く review し、頻繁に review する。

## When To Request Review

**必ず review する:**

- subagent-driven development で各 task が完了した後
- important feature 完了後
- main へ merge する前

**任意だが価値が高い:**

- stuck しているとき（別視点を得る）
- refactor 前（baseline を作る）
- complex bug を修正した後

## How To Request

**1. git SHA を取得する。**

```bash
BASE_SHA=$(git rev-parse HEAD~1)  # または origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. code review subagent を dispatch する。**

Task tool を使い、`general-purpose` type を指定し、`code-reviewer.md` の template を埋める。

**placeholder:**

- `{DESCRIPTION}` - 完了した内容の短い説明
- `{PLAN_OR_REQUIREMENTS}` - 期待される機能、計画、受入条件
- `{BASE_SHA}` - start commit
- `{HEAD_SHA}` - end commit

**3. feedback を処理する。**

- Critical issue はすぐ修正する
- Important issue は続行前に修正する
- Minor issue は記録し、必要に応じて後で対応する
- reviewer が間違っている場合は、technical reason で反論する

## Example

```text
[task 2: validation feature を追加した直後]

あなた: 続行前に code review を依頼します。

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[code review subagent を dispatch]
  DESCRIPTION: verifyIndex() と repairIndex() を追加し、4 種類の issue type に対応
  PLAN_OR_REQUIREMENTS: docs/superpowers/plans/deployment-plan.md の task 2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661

[subagent result]:
  良い点: architecture が明確で、test は real behavior を検証している
  issue:
    Important: progress indicator がない
    Minor: report interval に magic number (100) がある
  assessment: continue possible

あなた: [progress indicator を修正]
[task 3 へ進む]
```

## Workflow Integration

**Subagent-driven development:**

- 各 task 完了後に review する
- issue が積み重なる前に見つける
- 修正してから次の task へ進む

**Executing plans:**

- 各 task 完了後、または自然な checkpoint で review する
- feedback を受け、反映し、続行する

**Ad hoc development:**

- merge 前に review する
- stuck したときに review する

## Red Flags

**絶対にしないこと:**

- 「simple だから」と review を skip する
- Critical issue を無視する
- unresolved Important issue を抱えたまま進む
- 妥当な technical feedback に感情的に反論する

**reviewer が間違っている場合:**

- technical reason で反論する
- 実際に動くことを示す code / test を提示する
- clarification を求める

template: `requesting-code-review/code-reviewer.md`
