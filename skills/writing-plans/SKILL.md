---
name: writing-plans
description: 仕様や要求があり、多段階 task として実装する必要がある場合、コードを書く前に使用する。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [planning, implementation]
---

# Writing Plans

## Overview

comprehensive implementation plan を書く。実装者はこの codebase の context をほぼ持たず、testing design も得意ではないと仮定する。必要な情報をすべて記録する。各 task が変更する file、code、test、参照すべき document、test 方法を明記する。全体を小さな step task に分解する。DRY。YAGNI。TDD。frequent commit。

実装者は経験ある developer だが、この toolchain と domain にはほぼ初見だと仮定する。test design は過信しない。

**開始時の宣言:** 「writing-plans skill を使って implementation plan を作成します。」

**Context:** この skill は dedicated worktree 内で実行する（brainstorming skill によって作成済み）。

**plan 保存先:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

- plan location についてユーザーの希望がある場合は、それを優先する

## Scope Check

spec が複数の independent subsystem を含む場合、本来は brainstorming phase で subproject spec に分けるべきである。まだ分かれていない場合は、独立した plan へ分割することを提案する。各 plan は、単独で working, testable software を生める必要がある。

## File Structure

task を定義する前に、作成または変更する file と、それぞれの responsibility を列挙する。ここで decomposition decision を固定する。

- boundary が明確で interface が定義された unit を設計する。各 file は一つの明確な responsibility を持つ
- agent は context に収まる code ほど推論しやすく、file が focused であるほど編集が reliable になる。多機能な巨大 file より、小さく focused な file を優先する
- 一緒に変更される file は近くに置く。technical layer ではなく responsibility で分ける
- 既存 codebase では existing pattern に従う。codebase が大きな file を使っている場合、勝手に大規模 refactor しない。ただし、変更対象 file が管理困難になっているなら、plan に分割を含めるのは妥当

この structure が task decomposition を決める。各 task は独立した meaningful change を生むべきである。

## Small-Step Task Granularity

**各 step は一つの operation（2-5 分）にする。**

- "failing test を書く" - one step
- "実行して failure を確認する" - one step
- "test を通す最小 code を実装する" - one step
- "test を実行して pass を確認する" - one step
- "commit" - one step

## Plan Document Header

**各 plan は必ずこの header で始める。**

```markdown
# [Feature Name] Implementation Plan

> **AI agent worker 向け:** 必須 subskill: `superpowers:subagent-driven-development`（推奨）または `superpowers:executing-plans` を使って、この plan を task ごとに実装する。進捗 tracking には checkbox（`- [ ]`）syntax を使う。

**Goal:** [何を build するかを一文で説明]

**Architecture:** [approach を 2-3 文で説明]

**Tech Stack:** [key technology / library]
---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: failing test を書く**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: test を実行して failure を確認する**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL, error "function not defined"

- [ ] **Step 3: 最小 implementation code を書く**

```python
def function(input):
    return expected
```

- [ ] **Step 4: test を実行して pass を確認する**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## No Placeholders

各 step は、実装者が必要とする actual content を含まなければならない。次は**plan defect**であり、絶対に書かない。

- "TBD"、"TODO"、"later"、"add details"
- "適切な error handling を追加" / "validation を追加" / "edge case を処理"
- "上記 code の test を書く"（actual test code がない）
- "Task N と同様"（実装者は task を順番に読まないかもしれない）
- 何をするかだけ説明し、どうするかを示さない step（code step には code block が必要）
- どの task でも定義されていない type、function、method を参照する

## Notes

- 常に exact file path を使う
- 各 step に complete code を含める。code change を伴う step なら code を示す
- exact command と expected output を書く
- DRY、YAGNI、TDD、frequent commit

## Self-Check

complete plan を書いた後、新しい視点で spec を見直し、plan と照合する。これは自分で実行する checklist であり、subagent dispatch ではない。

**1. spec coverage:** spec の各 section / requirement を確認する。それを実装する task を指せるか。漏れをすべて列挙する。

**2. placeholder scan:** plan 内の red flag を検索する。上の "No Placeholders" section の pattern があれば修正する。

**3. type consistency:** later task で使う type、method signature、property name は earlier task で定義したものと一致しているか。Task 3 では `clearLayers()`、Task 7 では `clearFullLayers()` になっているなら bug。

問題を見つけたら inline で修正する。再 review を待つ必要はない。修正して続行する。spec requirement に対応する task がない場合は task を追加する。

## Execution Handoff

plan を保存したら、execution option を提示する。

```text
plan を作成し、`docs/superpowers/plans/<filename>.md` に保存しました。実行方法は二つあります。

1. subagent-driven（推奨） - task ごとに新しい subagent を dispatch し、task 間で review しながら素早く進める

2. inline execution - current session で `executing-plans` を使って task を実行し、batch ごとに checkpoint を置く

どちらで進めますか。
```

**subagent-driven を選ぶ場合:**

- **必須 subskill:** `superpowers:subagent-driven-development`
- task ごとに new subagent + two-stage review

**inline execution を選ぶ場合:**

- **必須 subskill:** `superpowers:executing-plans`
- batch execution + review checkpoint
