# Skill Design における説得原理

## 概要

LLM は、人間向け文書と同じように、権威、コミットメント、希少性などの説得パターンに反応します。これは操作のためではなく、重要な practice が pressure 下でも守られるように skill を設計するために使います。

**研究背景:** Meincke ら (2025) は N=28,000 の AI conversation で 7 種類の説得原理を検証し、説得 technique によって compliance rate が大きく変わることを報告しています。数値や最新の解釈が必要な場合は原論文を確認してください。

## 7 つの原理

### 1. Authority

専門性、公式性、明確な規則に従う傾向。

Skill での使い方:
- 「必ず」「してはいけない」「例外なし」を明確に書く
- 決定疲れと合理化を減らす
- 安全、TDD、検証などの discipline に使う

例:

```markdown
OK: test より先に code を書いたら削除し、RED からやり直す。例外なし。
NG: 可能なら test を先に書くことを検討する。
```

### 2. Commitment

自分が宣言したことや前の選択と一貫しようとする傾向。

Skill での使い方:
- skill 使用を宣言させる
- A/B/C のように明確な選択を求める
- checklist や todo で進捗を可視化する

例:

```markdown
OK: この skill を使う場合、最初に「writing-plans を使います」と宣言する。
NG: 使っている skill を必要なら伝える。
```

### 3. Scarcity

時間制限や順序制約によって「今やる」必要性を感じる傾向。

Skill での使い方:
- 「次に進む前に」
- 「完了宣言の前に」
- 「実装を書く前に」

例:

```markdown
OK: 完了と述べる前に検証 command を実行する。
NG: 便利なタイミングで検証する。
```

### 4. Social Proof

標準 practice や皆が守る規範に従いやすい傾向。

Skill での使い方:
- common failure を明示する
- 「毎回」「通常」「標準」を慎重に使う
- team norm を作る

例:

```markdown
OK: checklist を tracking しない multi-step task は step が抜ける。毎回 tracking する。
NG: checklist tracking は役立つことがある。
```

### 5. Unity

共有 identity や同じ目的を持つ感覚。

Skill での使い方:
- collaborative review
- honest feedback
- team quality culture

例:

```markdown
OK: 私たちは同じ codebase を守る同僚です。率直な技術判断を返してください。
NG: もしよければ問題点を教えてください。
```

### 6. Reciprocity

受けた利益を返したくなる傾向。

Skill ではほとんど不要です。compliance を guilt や恩返しで引き出す設計は避けます。

### 7. Liking

好感を持つ相手に協力しやすい傾向。

Discipline-enforcing skill では避けます。flattery や過剰同調は、正直な review や検証を弱めます。

## Skill Type 別の組み合わせ

| Skill type | 使う | 避ける |
| --- | --- | --- |
| Discipline | Authority + Commitment + Social proof | Liking, Reciprocity |
| Technique | Moderate authority + clear checklist | 過剰な命令調 |
| Collaboration | Unity + Commitment | 過剰な authority |
| Reference | Clarity only | 説得 technique 全般 |

## なぜ効くか

明確な rule は合理化を減らします。

- 「必ず」は decision fatigue を減らす
- 「例外なし」は「今回は別」を塞ぐ
- trigger + required action は実行意図を作る
- declaration -> action の流れは一貫性を促す

LLM は人間の文章パターンで訓練されているため、authority wording、commitment sequence、social norm の pattern に影響されます。

## 倫理的な使い方

正当:
- 重要 practice を守らせる
- 予測可能な失敗を防ぐ
- user の真の利益を守る

不当:
- personal benefit のための操作
- false urgency
- guilt-based compliance
- ユーザー意図に反する誘導

判断基準:

**ユーザーがこの technique を完全に理解していても、それはユーザーの利益にかなっているか。**

## 参考

**Cialdini, R. B. (2021).** *Influence: The Psychology of Persuasion (New and Expanded).* Harper Business.

**Meincke, L., Shapiro, D., Duckworth, A. L., Mollick, E., Mollick, L., & Cialdini, R. (2025).** *Call Me A Jerk: Persuading AI to Comply with Objectionable Requests.* University of Pennsylvania.

## Quick Reference

Skill を設計するときに確認:

1. これは discipline、technique、collaboration、reference のどれか
2. 変えたい agent 行動は何か
3. どの原理が最小限必要か
4. 原理を詰め込みすぎていないか
5. user が理解しても正当と言えるか
