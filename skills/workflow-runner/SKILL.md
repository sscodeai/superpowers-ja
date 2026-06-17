---
name: workflow-runner
description: Claude Code / OpenClaw / Cursor などで YAML multi-agent workflow を直接実行する。API key は不要で、現在の会話の LLM を実行エンジンとして使う。ユーザーが .yaml workflow を渡した場合、または複数ロールでの協調作業を求めた場合に使用する。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [workflow, orchestration]
---

# Workflow Runner

現在の AI coding session 内で YAML workflow を実行します。外部 orchestrator や API key は不要です。各 step の role 定義を読み込み、現在の LLM または subagent がその role として作業します。

## 適用場面

- ユーザーが `.yaml` / `.yml` workflow file を指定した
- 複数の役割でレビュー、設計、検証を行いたい
- `agents_dir` 配下に role 定義 Markdown がある

## Workflow 形式

```yaml
name: "workflow-name"
agents_dir: "agents"
inputs:
  - name: ticket_id
    required: true
  - name: target
    required: false
    default: "current project"
steps:
  - id: spec_review
    role: "product/spec-reviewer"
    task: "Review {{target}} for ticket {{ticket_id}}"
    output: spec_review
  - id: architecture_review
    role: "engineering/architect"
    task: "Review implementation approach based on {{spec_review}}"
    depends_on: [spec_review]
    output: architecture_review
```

`llm`、`concurrency`、`timeout`、`retry` など CLI 向け設定があっても、この skill では現在の session の制約に合わせて扱います。

## 実行手順

### 1. Workflow を読む

指定された YAML file を読み、`name`、`agents_dir`、`inputs`、`steps`、`depends_on` を抽出します。

role directory は次の順に探します。

1. 現在の作業ディレクトリの `{agents_dir}/`
2. workflow file と同じディレクトリから見た `{agents_dir}/`
3. 親ディレクトリの `{agents_dir}/`
4. `./agents/`
5. `./.agents/`

見つからない場合は停止し、必要な role file のパスをユーザーに伝えます。

### 2. 入力を集める

- `required: true` の input がユーザー発話や workflow にない場合は質問する
- `default` がある optional input は default を使う
- default がない optional input は空文字として扱う

### 3. DAG を組む

`depends_on` から実行順を作ります。

```text
Execution plan:
  Layer 1: spec_review
  Layer 2: architecture_review, qa_review
  Layer 3: summary
```

同じ layer の step は独立しているため、利用可能なら subagent で並列実行できます。

### 4. Role を読み込む

各 step の role file は `{agents_dir}/{role}.md` です。

role file から以下を取得します。

- frontmatter の `name`
- frontmatter の `description`
- markdown body の system prompt / role instructions

role file が見つからない場合は、その step を実行せず停止します。

### 5. Step を実行する

task 内の `{{variable}}` を input または前 step の output で置換します。

単独 step:

```markdown
### Step 1/3: spec_review (Spec Reviewer)

<role instructions に従って task を実行>
```

並列 step:

- subagent が使える場合は step ごとに subagent を起動する
- subagent prompt には role file の全文、rendered task、期待 output を含める
- subagent が使えない場合は同じ会話内で順番に実行し、並列実行できなかったことを明記する

### 6. 結果を保存する

可能なら次の形式で保存します。

```text
.workflow-output/<workflow-name>-<YYYY-MM-DD>/
├── steps/
│   ├── 1-spec_review.md
│   └── 2-architecture_review.md
├── summary.md
└── metadata.json
```

保存できない環境では、各 step の結果と summary を会話内に提示します。

## Hard Gates

- role file を読まずに role を演じない
- step を勝手に省略しない
- dependency order を壊さない
- required input を推測で埋めない
- 最終 summary には、実行した step、失敗した step、未解決事項を含める

## YAML がない場合

ユーザーが「PM と architect でレビューして」など複数 role の協調を求めた場合:

1. 簡易 workflow 案を作る
2. ユーザーに確認する
3. 確認後に実行する

確認なしに大きな multi-agent workflow を走らせないでください。
