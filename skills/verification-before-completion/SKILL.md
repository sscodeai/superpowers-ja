---
name: verification-before-completion
description: 完了、修正済み、テスト通過を宣言する前、commit や PR 作成前に使用する。検証コマンドを実行し、証拠に基づいて述べる。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [verification, quality]
---

# Verification Before Completion

## Overview

検証なしに「完了」と言うのは、効率的ではない。不誠実である。

**Core principle:** conclusion は常に evidence で支える。

**この rule を形だけ扱うことは、rule の精神に反する。**

## Iron Law

```text
fresh verification evidence なしに completion を宣言しない
```

この message の中で verification command を実行していないなら、test が通ったとは言えない。

## Gate Function

```text
状態を宣言する、または満足を表明する前に:

1. Determine: どの command がこの conclusion を証明するか
2. Run: full command を実行する（再実行、完全実行）
3. Read: output を最後まで読み、exit code と failure count を確認する
4. Verify: output は conclusion を支えているか
   - no: evidence に基づいて実際の状態を述べる
   - yes: evidence とともに conclusion を述べる
5. Only then: conclusion を出す

どれか一つでも skip したら、それは verification ではなく lying である
```

## Common Failure Modes

| Conclusion | Required | Not enough |
| --- | --- | --- |
| test passed | test command output: 0 failures | previous run、「通るはず」 |
| linter clean | linter output: 0 errors | partial check、inference |
| build succeeded | build command: exit 0 | linter passed、log が良さそう |
| bug fixed | original symptom test: pass | code を変えた、fix したはず |
| regression test valid | red-green cycle verified | test が一度 pass しただけ |
| agent completed | VCS diff shows changes | agent の「成功」report |
| requirement satisfied | item-by-item checklist | tests passed |

## Red Lines - Stop

- 「should」「probably」「seems」を使っている
- verification 前に満足を表明している（「素晴らしい」「完璧」「完了」など）
- commit / push / PR 作成直前なのに verification していない
- agent の success report を信じている
- partial verification に依存している
- 「今回だけ」と考えている
- 疲れて終わらせたい
- **success を暗示するが、実際には verification を実行していない表現**

## Prevent Rationalization

| Excuse | Reality |
| --- | --- |
| 「通るはず」 | verification command を実行する |
| 「自信がある」 | confidence は evidence ではない |
| 「今回だけ」 | exception はない |
| 「linter は通った」 | linter は compiler ではない |
| 「agent が成功と言った」 | independent verification |
| 「疲れた」 | fatigue は excuse ではない |
| 「partial check で十分」 | partial check は何も証明しない |
| 「別表現なら rule は適用されない」 | spirit は literal wording より上位 |

## Key Patterns

**Tests:**

```text
✅ [test command を実行] [34/34 pass を確認] "all tests passed"
❌ "通るはず" / "見た感じ正しい"
```

**Regression test (TDD red-green):**

```text
✅ write → run (pass) → revert fix → run (must fail) → restore → run (pass)
❌ "regression test を書いた"（red-green verification なし）
```

**Build:**

```text
✅ [build を実行] [exit 0 を確認] "build passed"
❌ "linter passed"（linter は compile を確認しない）
```

**Requirements:**

```text
✅ plan を読み直す → checklist を作る → item-by-item verify → gap または completion を報告
❌ "tests passed なので phase completed"
```

**Agent delegation:**

```text
✅ agent success report → VCS diff を確認 → changes を verify → actual state を報告
❌ agent report を信じる
```

## Why This Matters

24 件の failure record から:

- 人間の担当者が「信じられない」と言う — trust が壊れる
- undefined function が delivery される — 直接 crash する
- missing requirement が delivery される — feature が incomplete
- false completion が時間を浪費する → rework → redo
- principle violation: 「honesty is core value. If you lie, you will be replaced.」

## When To Use

**次の前に必ず使う。**

- success / completion statement のあらゆる形
- 満足の表明
- work status についての positive statement
- commit、PR 作成、task complete marking
- next task へ進む
- agent へ delegate する

**この rule は次に適用される。**

- exact wording
- synonym や言い換え
- success の暗示
- done / correct を伝えるあらゆる communication

## Bottom Line

**verification に shortcut はない。**

command を実行する。output を読む。それから result を述べる。

これは交渉不可。
