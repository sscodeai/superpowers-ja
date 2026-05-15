---
name: systematic-debugging
description: bug、test failure、異常動作に遭遇した場合、修正案を出す前に使用する。
---

# Systematic Debugging

## Overview

思いつきの修正は時間を浪費し、新しい bug を生む。急いで当てた patch は、深い問題を隠すだけである。

**Core principle:** 修正を試す前に、必ず root cause を見つける。symptom だけを直すのは失敗である。

**形だけ process をなぞることは、debugging の精神に反する。**

## Iron Law

```text
root cause investigation なしに fix proposal を出さない
```

Phase 1 を完了していないなら、fix proposal を出してはいけない。

## When To Use

あらゆる technical issue に使う。

- test failure
- production bug
- abnormal behavior
- performance issue
- build failure
- integration issue

**特に次の場合は必ず使う。**

- time pressure がある（緊急時ほど guessing fix に流れやすい）
- 「小さな変更で直る」と感じている
- すでに複数の fix を試した
- 前回の fix が効かなかった
- 問題を完全には理解していない

**次の場合も skip しない。**

- 問題が単純に見える（simple bug にも root cause はある）
- 急いでいる（急ぐほど手戻りが増える）
- 上司や関係者が即時修正を求めている（systematic debugging は trial-and-error より速い）

## Four Phases

各 phase を完了してから次へ進む。

### Phase 1: Root Cause Investigation

**fix を試す前に行う。**

1. **error message を注意深く読む**
   - error や warning を飛ばさない
   - 解決の手がかりがその中にあることが多い
   - stack trace を最後まで読む
   - line number、file path、error code を記録する

2. **安定して再現する**
   - reliable に trigger できるか
   - exact reproduction steps は何か
   - 毎回再現するか
   - 再現できない場合は、guess せず追加 data を集める

3. **recent changes を確認する**
   - どの変更が原因になり得るか
   - git diff、recent commits
   - new dependency、configuration change
   - environment difference

4. **multi-component system では evidence を集める**

   **system が複数 component を持つ場合（CI → build → signing、API → service → database など）:**

   **fix proposal の前に diagnostic instrumentation を入れる。**

   ```text
   component boundary ごとに:
     - component に入る data を記録する
     - component から出る data を記録する
     - environment / config の伝播を検証する
     - 各 layer の state を確認する

   一度実行して evidence を集め、break point を特定する
   evidence を分析し、faulty component を見つける
   その component を深掘りする
   ```

   **example（multi-layer system）:**

   ```bash
   # layer 1: workflow
   echo "=== Secrets available in workflow: ==="
   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"

   # layer 2: build script
   echo "=== Env vars in build script: ==="
   env | grep IDENTITY || echo "IDENTITY not in environment"

   # layer 3: signing script
   echo "=== Keychain state: ==="
   security list-keychains
   security find-identity -v

   # layer 4: actual signing
   codesign --sign "$IDENTITY" --verbose=4 "$APP"
   ```

   **分かること:** どの layer で壊れているか（secrets → workflow pass、workflow → build fail など）

5. **data flow を trace する**

   **error が call stack の深い位置で起きている場合:**

   full backtracking technique は同 directory の `root-cause-tracing.md` を参照する。

   **short version:**
   - wrong value はどこで生まれたか
   - 誰がその wrong value でここを呼んだか
   - source まで上流へ trace し続ける
   - symptom の場所ではなく source で直す

### Phase 2: Pattern Analysis

**pattern を見つけてから fix する。**

1. **working example を探す**
   - 同じ codebase 内で似た正常 code を探す
   - 正常な code と壊れている code は何が似ているか

2. **reference implementation と比較する**
   - pattern を実装している場合、reference implementation を完全に読む
   - skim しない。line by line で読む
   - 適用前に pattern を理解しきる

3. **difference を特定する**
   - 正常 code と壊れている code の違いは何か
   - 小さく見えるものも含め、すべて列挙する
   - 「これは影響しないはず」と仮定しない

4. **dependency を理解する**
   - この機能はどの component に依存するか
   - どの setting、config、environment が必要か
   - どんな implicit assumption があるか

### Phase 3: Hypothesis And Verification

**scientific method:**

1. **single hypothesis を立てる**
   - 「root cause は X だと思う。理由は Y」と明確に述べる
   - 書き出す
   - 具体的にする。曖昧にしない

2. **minimal test を行う**
   - hypothesis を検証する最小変更をする
   - 一度に一つの variable だけ変える
   - 複数 issue を同時に fix しない

3. **続行前に検証する**
   - 効いたか。yes → Phase 4 へ
   - 効かなかったか。new hypothesis を立てる
   - 上からさらに fix を重ねない

4. **不確実な場合**
   - 「X を理解できていない」と言う
   - 分かったふりをしない
   - help を求める
   - 追加調査する

### Phase 4: Implementation

**root cause を修正する。symptom ではない。**

1. **failing test case を作る**
   - 最小 reproduction
   - 可能な限り automated test
   - test framework がなければ one-off test script
   - fix 前に必ず test がある
   - proper failing test の作成には `superpowers:test-driven-development` skill を使う

2. **single fix を実装する**
   - 特定済みの root cause を修正する
   - 一度に一箇所だけ変える
   - 「ついでに」の最適化をしない
   - refactor を bundle しない

3. **fix を検証する**
   - test は今 pass するか
   - 他の test は壊れていないか
   - 問題は本当に解消したか

4. **fix が効かない場合**
   - 停止する
   - 何回 fix を試したか数える
   - 3 回未満: Phase 1 に戻り、新情報で再分析する
   - **3 回以上: architecture を疑う（次の step 5）**
   - architecture discussion なしに 4 回目の fix を試さない

5. **3 回以上 fix が失敗した場合: architecture を疑う**

   **次の pattern は architecture issue を示す。**
   - 各 fix が別の shared state / coupling / location の問題を露出させる
   - fix に large refactor が必要になる
   - fix するたびに別の symptom が出る

   **根本的な問いを立てる。**
   - この pattern は根本的に妥当か
   - inertia-driven で間違った approach に固執していないか
   - architecture を見直すべきか、symptom patch を続けるべきか

   **さらに fix を試す前に、人間の担当者と議論する。**

   これは hypothesis failure ではない。architecture が間違っている。

## Red Lines - Stop And Follow The Process

次の考えが浮かんだら停止する。

- 「先に temporary fix して、後で調べる」
- 「X を変えて試してみよう」
- 「複数箇所を一度に変えて test してみよう」
- 「test は skip して manual verify する」
- 「たぶん X だから直す」
- 「完全には理解していないが、これで行けるはず」
- 「pattern は X と言っているが、別の使い方をする」
- 「主な問題はこれらです: [調査前の fix list]」
- data flow を trace せず solution を出す
- **「もう一回だけ fix を試す」（すでに 2 回以上試している）**
- **fix のたびに別の場所で新しい問題が出る**

**これらはすべて、停止して Phase 1 へ戻る合図である。**

**3 回以上 fix が失敗した場合:** architecture を疑う（Phase 4 step 5）。

## 人間の担当者からの Signal - Approach が間違っている

**次の言葉に注意する。**

- 「本当にそうですか」— 検証なしに assumption を置いている
- 「それで何が分かりますか」— 先に evidence を集めるべき
- 「guess しないで」— 理解せずに fix を提案している
- 「深く考えて」— symptom ではなく fundamental issue を問うべき
- 「詰まっていますか」（frustrated tone）— approach が機能していない

**この signal を見たら:** 停止する。Phase 1 に戻る。

## Common Excuses

| Excuse | Reality |
| --- | --- |
| 「simple issue なので process は不要」 | simple issue にも root cause はある。simple bug なら process はすぐ終わる。 |
| 「緊急なので process の時間がない」 | systematic debugging は guessing fix の反復より速い。 |
| 「先に試してから調べる」 | 最初の fix が流れを決める。最初から正しく進める。 |
| 「fix が効くと確認してから test を書く」 | test なしの fix は残らない。先に test を書くことで fix の有効性を証明する。 |
| 「複数 issue を一度に直す方が早い」 | 何が効いたか isolate できない。new bug も入る。 |
| 「reference が長いので自分で調整する」 | 半端な理解は必ず bug を生む。完全に読む。 |
| 「問題が見えたので直す」 | symptom が見えたことと root cause を理解したことは違う。 |
| 「もう一回試す」（2 回以上失敗後） | 3 回以上の失敗 = architecture issue。pattern を疑い、fix を重ねない。 |

## Quick Reference

| Phase | Key Activity | Pass Criteria |
| --- | --- | --- |
| **1. Root cause** | error を読む、reproduce、change 確認、evidence 収集 | 何が、なぜ壊れたか理解している |
| **2. Pattern** | working example を探す、compare | difference を特定した |
| **3. Hypothesis** | theory を立て、minimal verification | hypothesis が検証された、または new hypothesis が生まれた |
| **4. Implementation** | test 作成、fix、verify | bug が直り、test が pass した |

## When The Process Shows "No Root Cause"

systematic investigation の結果、問題が environment、timing、external factor によるものだと本当に分かった場合:

1. process は完了している
2. 調べた内容を記録する
3. 適切な handling を実装する（retry、timeout、error message）
4. 後続調査のため monitoring / logging を追加する

**ただし:** 「root cause が見つからない」の 95% は調査不足である。

## Supporting Techniques

次の techniques は systematic debugging の一部であり、この directory にある。

- **`root-cause-tracing.md`** - call stack を逆に辿り、bug の最初の trigger を見つける
- **`defense-in-depth.md`** - root cause 発見後、複数 layer に validation を追加する
- **`condition-based-waiting.md`** - hard-coded wait の代わりに condition polling を使う

**Related skills:**

- **superpowers:test-driven-development** - failing test case を作る（Phase 4 step 1）
- **superpowers:verification-before-completion** - 成功宣言前に fix が本当に有効か検証する

## Practical Impact

debugging practice の観測値:

- systematic approach: 15-30 分で fix
- ad hoc approach: 2-3 時間の trial-and-error
- first-fix success rate: 95% vs 40%
- introduced new bug: almost zero vs frequent
