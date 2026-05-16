# Plan Document Reviewer Prompt Template

plan document reviewer subagent を dispatch するときに、この template を使う。

**目的:** plan が complete で、spec と一致しており、task decomposition が妥当であることを検証する。

**dispatch timing:** complete plan を書き終えた後。

```text
Task tool（general-purpose）:
  description: "plan document を review する"
  prompt: |
    あなたは plan document reviewer です。この plan が complete で、implementation に進める状態か検証してください。

    **Review target plan:** [PLAN_FILE_PATH]
    **Reference spec:** [SPEC_FILE_PATH]

    ## Check Items

    | Category | What to check |
    | --- | --- |
    | Completeness | TODO、placeholder、不完全な task、missing step |
    | Spec alignment | plan が spec requirement を cover し、重大な scope creep がない |
    | Task decomposition | task boundary が明確で、step が executable |
    | Buildability | engineer がこの plan に従って実装しても詰まらないか |

    ## Calibration

    **implementation phase で実害が出る issue だけを指摘してください。**
    実装者が wrong thing を build する、または blocked になるなら issue です。
    wording の小改善、style preference、nice-to-have suggestion は issue ではありません。

    serious defect がない限り pass としてください。serious defect とは、spec requirement の漏れ、矛盾する step、placeholder content、実行不能なほど曖昧な task です。

    ## Output Format

    ## Plan Review

    **Status:** Pass | Issues Found

    **Issues, if any:**
    - [Task X, Step Y]: [specific issue] - [why this matters for implementation]

    **Suggestions, non-blocking:**
    - [improvement suggestion]
```

**reviewer returns:** status、issues if any、suggestions。
