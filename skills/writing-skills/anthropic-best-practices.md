# Skill Authoring Best Practices

> Claude が見つけやすく、実際に使いやすい skill を書くための実務チェックリスト。

この reference は Anthropic の agent skills best practices を、superpowers-ja の運用向けに要約したものです。正式な最新仕様が必要な場合は公式 docs を確認してください。

## Core Principles

### 簡潔にする

Context window は共有資源です。`SKILL.md` が load された後は、会話履歴や他 skill と同じ budget を使います。

書く前に確認:
- Claude が本当にこの説明を必要としているか
- 標準的な知識として省けないか
- その token cost に見合う判断情報か

良い例:

```markdown
## PDF text extraction

Use `pdfplumber`:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
```

悪い例:

```markdown
PDF は portable document format であり、多くの文書が...
```

Claude が既に知っている背景説明は省き、task 固有の判断だけを残します。

### 自由度を調整する

脆い作業ほど詳細に、判断余地がある作業ほど heuristic にします。

高自由度:
- review
- design exploration
- trade-off analysis
-文章編集

低自由度:
- compliance checklist
- destructive operation
- security handling
- file format conversion
- regulated output

低自由度の例:

```markdown
## CSV export

1. Write UTF-8 with BOM unless the ticket says otherwise
2. Quote every field
3. Use CRLF line endings
4. Add audit log before returning success
5. Run `npm test -- csv-export`
```

### 実際に使う model で test する

Skill は model の能力を補完します。Haiku / Sonnet / Opus など、実際に使う model で試してください。

- 小さい model: 十分な具体性があるか
- 中間 model: 無駄なく clear か
- 強い model: 過剰説明で邪魔していないか

## Skill Structure

### Frontmatter

`SKILL.md` の先頭に YAML frontmatter を置きます。

```markdown
---
name: skill-name
description: いつこの skill を使うべきかを具体的に書く
---
```

原則:
- `name` は短く、英数字と hyphen
- `description` は discovery metadata
- trigger、symptom、context を含める
- workflow 全体を要約しない

### Description

良い description は「読むべきか」を判断させます。

悪い:

```yaml
description: test を先に書いて、失敗を見て、実装して、refactor する TDD workflow
```

良い:

```yaml
description: 機能実装または bug 修正時、実装コードを書く前に使用する。
```

workflow を書くと、agent が本文を読まずに description だけで実行することがあります。

## Progressive Disclosure

`SKILL.md` は entry point です。長い内容は必要な時だけ読める file に分けます。

良い構造:

```text
skills/pdf-processing/
  SKILL.md
  reference/forms.md
  reference/redaction.md
  scripts/extract_fields.py
```

`SKILL.md` には次だけ置きます。
- いつ使うか
- 最初に何を確認するか
- どの reference / script をいつ読むか
- failure mode と verification

重い reference は一段深さまでにしてください。`SKILL.md -> reference.md -> details.md` のような chain は見落としを増やします。

## Workflow Design

### Checklist を使う

複数 step の workflow は checklist にします。

```markdown
## Release review

- [ ] diff を確認
- [ ] migration / rollback を確認
- [ ] test evidence を確認
- [ ] release note を更新
- [ ] owner approval を確認
```

Checklist は agent が進捗を保持しやすく、抜け漏れを見つけやすい形式です。

### Verification loop を入れる

品質が重要な task では、plan -> verify -> execute -> verify の loop を作ります。

例:

```markdown
1. `changes.json` に変更計画を書く
2. `node scripts/validate-changes.js changes.json` を実行
3. error があれば計画を修正
4. 変更を適用
5. 同じ validator と test を再実行
```

Machine-verifiable な中間成果物を作ると、実行前に誤りを見つけやすくなります。

### 時間依存情報を避ける

「2025 年 8 月までは旧 API」のような記述はすぐ古くなります。必要なら `Legacy patterns` section に隔離し、current path を明確にします。

## Output Templates

出力 format が重要な skill では template を置きます。

厳密な template:

```markdown
## Findings

- Severity:
- File:
- Issue:
- Recommendation:

## Verification

- Command:
- Result:
```

自由度を残す template:

```markdown
Use these sections when relevant:
- Findings
- Open questions
- Verification
- Follow-up
```

## Examples

Example は少数でよく、具体的な input / output pair にします。

```markdown
Input: JWT login を追加
Output: feat(auth): JWT ログインを追加
```

長い narrative は避けます。agent が general rule を見失うためです。

## Scripts

決定的に検証できる処理は script にします。

Script を bundle する利点:
- generated code より安定する
- token を節約できる
- 同じ validation を繰り返せる
- error message を具体化できる

Instruction では実行意図を明確にします。

```markdown
Run `scripts/validate_schema.py output.json`.
Do not reimplement the validator.
```

## Runtime Assumptions

環境差を明示します。

- network が必要か
- npm / pip install が必要か
- Windows / macOS / Linux path 差があるか
- file system access が必要か
- MCP tool が必要か

MCP tool を参照する場合は server prefix を含めます。

```markdown
Use `GitHub:create_issue` to create the issue.
Use `BigQuery:bigquery_schema` to inspect the table.
```

## Common Mistakes

**Too much background:** Claude が既に知っている一般論を長く書く。

**Description に workflow を書く:** 本文を読ませるための trigger に徹する。

**Deep reference chains:** 必要情報まで 2 hop 以上必要にする。

**No verification:** 完了条件や確認 command がない。

**Assuming dependencies:** package や tool がある前提で書く。

**No failure modes:** 何が危険で、何を避けるべきかが書かれていない。

**Stale time references:** 日付や version を固定して古くなる。

## Review Checklist

公開前に確認:

- [ ] `name` と `description` が valid
- [ ] description は具体的な trigger を含む
- [ ] description は workflow を要約していない
- [ ] `SKILL.md` は短く、必要なら reference file に分割済み
- [ ] reference は一段深さで到達できる
- [ ] examples は短く具体的
- [ ] verification command / checklist がある
- [ ] error handling / failure mode が明確
- [ ] dependency と runtime assumption が明確
- [ ] Windows path を不要に仮定していない
- [ ] time-sensitive な情報がない、または legacy として隔離済み
- [ ] 実際の model で test 済み
- [ ] pressure がある skill は `testing-skills-with-subagents.md` で検証済み

## Summary

良い skill は、短く、見つけやすく、必要な reference にすぐ到達でき、検証方法が明確です。Claude に一般知識を教え直すのではなく、その task で間違えやすい判断と具体的な guardrail を渡してください。
