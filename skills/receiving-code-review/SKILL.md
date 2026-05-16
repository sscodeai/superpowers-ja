---
name: receiving-code-review
description: コードレビュー指摘を受けた後、反映前に使用する。特に指摘が曖昧、または技術的疑問がある場合、盲目的に従わず検証する。
---

# Receiving Code Review

## Overview

code review に必要なのは technical evaluation であり、感情的な同意表明ではない。

**Core principle:** 実装前に検証する。推測する前に質問する。social comfort より technical correctness を優先する。

## Response Pattern

```text
code review feedback を受け取ったら:

1. Read: feedback を最後まで読み、すぐ反応しない
2. Understand: requirement を自分の言葉で言い換える、または質問する
3. Verify: codebase の実態と照合する
4. Evaluate: この codebase に対して technical に妥当か判断する
5. Respond: technical confirmation または根拠ある反論を返す
6. Implement: 一度に一項目ずつ実装し、個別に test する
```

## Forbidden Responses

**言ってはいけないこと:**

- 「その通りです！」（検証前の同意）
- 「良い指摘です！」（中身のない相づち）
- 「すぐ実装します」（検証前）

**代わりに行うこと:**

- technical requirement を言い換える
- clarifying question を出す
- review comment が間違っている場合は technical reason で反論する
- 直接実装する（言葉より action）

## Handling Ambiguous Feedback

```text
一つでも曖昧な項目がある場合:
  停止する。まだ何も実装しない。
  曖昧な項目について clarification を求める。

理由: 項目同士が関連している可能性がある。partial understanding = wrong implementation。
```

**Example:**

```text
担当者: "1-6 を修正してください"
あなたは 1, 2, 3, 6 を理解しているが、4, 5 が不明。

bad: 先に 1, 2, 3, 6 を実装し、4, 5 は後で聞く
good: "1, 2, 3, 6 は理解しました。4 と 5 は実装前に確認が必要です。"
```

## Treat Feedback By Source

### Feedback From Human Partner / Project Owner

- **trustworthy** — 理解できたら実装する
- scope が曖昧なら質問する
- 空の同意表明をしない
- 直接 action する、または technical confirmation を返す

### Feedback From External Reviewer

```text
実装前に:
  1. この codebase に対して technical に正しいか確認する
  2. existing functionality を壊さないか確認する
  3. current implementation に理由があるか確認する
  4. すべての platform / version に適用できるか確認する
  5. reviewer が full context を持っているか確認する

suggestion が間違っていそうなら:
  technical reason で反論する

容易に検証できないなら:
  状況を説明する: "[X] がないため、この点は検証できません。調査 / 質問 / 先行実装のどれで進めますか。"

人間の担当者の過去 decision と conflict するなら:
  停止し、担当者と相談する
```

**principle:** external feedback は疑ってかかる。ただし雑に退けず、丁寧に検証する。

## YAGNI Check - "Professionalized" Feature Suggestions

```text
reviewer が「ちゃんと実装する」ことを提案した場合:
  codebase で actual usage を grep する

  使われていない場合: "この interface は呼ばれていません。削除（YAGNI）でよいですか。"
  使われている場合: proper implementation を行う
```

**principle:** reviewer も実装者も project owner に対して責任がある。不要な機能は追加しない。

## Implementation Order

```text
複数項目の feedback の場合:
  1. まず曖昧な項目をすべて clarify する
  2. 次の順で実装する:
     - blocking issue（crash、security）
     - simple fix（typo、import）
     - complex fix（refactor、logic）
  3. 各 fix を個別に test する
  4. regression がないことを verify する
```

## When To Push Back

次の場合は反論する。

- suggestion が existing functionality を壊す
- reviewer が full context を持っていない
- YAGNI に反する（使われていない feature）
- current tech stack に対して technical に正しくない
- legacy / compatibility reason がある
- 人間の担当者の architecture decision と conflict する

**how to push back:**

- technical reason を使う。defensive tone にしない
- concrete question を出す
- working test / code を引用する
- architecture issue なら人間の担当者を巻き込む

## Accepting Correct Feedback

feedback が正しい場合:

```text
good: "修正しました。[何を変更したかの短い説明]"
good: "[具体的な問題] を確認しました。[場所] で修正しました。"
good: [直接修正し、code で示す]

bad: "その通りです！"
bad: "良い指摘です！"
bad: "見つけてくれてありがとうございます！"
bad: 感謝だけの response
```

**なぜ空の感謝を避けるか:** action が response である。直接修正する。code 自体が feedback を受け取った証拠になる。

**「ありがとう」と書きたくなったら:** 消す。修正内容を述べる。

## Correcting Your Own Pushback Gracefully

反論した後で自分が間違っていたと分かった場合:

```text
good: "確認したところ、あなたの指摘が正しかったです。[X] を見ると [Y] でした。実装します。"
good: "検証した結果、私の初期理解が誤っていました。理由は [reason] です。修正します。"

bad: 長い謝罪
bad: 反論したことの弁明
bad: 過剰説明
```

修正内容を正直に述べ、作業を続ける。

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| 空の同意表明 | requirement を言い換える、または直接 action |
| blindly implement | codebase と照合して verify する |
| batch implementation without testing | 一項目ずつ実装し、個別に test |
| reviewer は必ず正しいと仮定 | existing functionality を壊さないか確認 |
| pushback を避ける | technical correctness > social comfort |
| partial understanding で実装開始 | 先に全項目を clarify |
| verify できないのに進める | limitation を説明し、guidance を求める |

## Real Examples

**empty agreement（bad example）:**

```text
reviewer: "legacy code を削除してください"
bad: "その通りです！削除します..."
```

**technical verification（good example）:**

```text
reviewer: "legacy code を削除してください"
good: "確認しました。build target は 10.15+ ですが、この API は 13+ が必要です。backward compatibility のため legacy code は必要です。ただし current implementation の bundle ID が誤っています。bundle ID を修正しますか、それとも pre-13 support を落としますか。"
```

**YAGNI（good example）:**

```text
reviewer: "database、date filter、CSV export を含む complete metrics tracking を実装してください"
good: "codebase を grep したところ、この interface は呼ばれていません。削除（YAGNI）でよいですか。それとも見落としている call site がありますか。"
```

**ambiguous items（good example）:**

```text
担当者: "1-6 を修正してください"
あなたは 1, 2, 3, 6 を理解しているが、4, 5 が不明。
good: "1, 2, 3, 6 は理解しました。4 と 5 は実装前に確認が必要です。"
```

## GitHub Comment Replies

GitHub の inline review comment へ返答する場合は、comment thread に reply する（`gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies`）。top-level PR comment にしない。

## Bottom Line

**external feedback = evaluation すべき suggestion。must-execute command ではない。**

verify する。question する。それから implement する。

空の同意表明をしない。常に technical rigor を保つ。
