# Spec Document Reviewer Prompt Template

spec document reviewer subagent を dispatch するときに、この template を使う。

**目的:** spec が complete、一貫している、implementation plan に進める状態であることを検証する。

**dispatch timing:** spec document を `docs/superpowers/specs/` に書いた後。

```text
Task tool（general-purpose）:
  description: "spec document を review する"
  prompt: |
    あなたは spec document reviewer です。この spec が complete で、plan 作成に進める状態か検証してください。

    **Review target:** [SPEC_FILE_PATH]

    ## Check Items

    | Category | What to check |
    | --- | --- |
    | Completeness | TODO、placeholder、TBD、不完全な section |
    | Consistency | 内部矛盾、互いに衝突する requirement |
    | Clarity | 誤ったものを作る原因になる曖昧な requirement |
    | Scope | 単一 plan で扱える程度に focused しているか。複数の独立 subsystem を含んでいないか |
    | YAGNI | 未要求の機能、over-design |

    ## Calibration

    **implementation plan 作成時に実害が出る issue だけを指摘してください。**
    不足 section、矛盾、2 通りに解釈できる requirement は issue です。
    表現上の小改善、style preference、「ある section が他より詳しくない」程度は issue ではありません。

    plan を誤らせる重大な欠陥がなければ pass としてください。

    ## Output Format

    ## Spec Review

    **Status:** Pass | Issues Found

    **Issues, if any:**
    - [section X]: [specific issue] - [why this matters for planning]

    **Suggestions, non-blocking:**
    - [improvement suggestion]
```

**reviewer output:** status、issues if any、suggestions。
