# コード品質 reviewer prompt template

コード品質 review サブエージェントを起動するときに使用します。

**目的:** 実装が良い作りになっているかを確認する（明瞭、test 済み、保守可能）。

**仕様適合 review が通った後にだけ起動してください。**

```text
Task tool (superpowers:code-reviewer):
  requesting-code-review/code-reviewer.md template を使用する

  WHAT_WAS_IMPLEMENTED: [実装者 report]
  PLAN_OR_REQUIREMENTS: [plan-file] の task N
  BASE_SHA: [task 開始前の commit]
  HEAD_SHA: [現在の commit]
  DESCRIPTION: [task summary]
```

**通常の code quality 観点に加えて、次も確認します。**
- 各 file は単一で明確な責務と、定義された interface を持っているか
- 各 unit は独立して理解・test できる粒度に分かれているか
- 実装は計画で定義された file structure に従っているか
- 今回の実装で大きすぎる新規 file を作ったり、既存 file を大きくしすぎたりしていないか。既存の file size 問題だけを指摘せず、今回の変更で増えた影響に集中する。

**code reviewer の返答:** Strengths、Issues（Critical / Important / Minor）、最終判断
