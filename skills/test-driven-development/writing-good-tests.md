# Writing Good Tests

**この reference を読む場面:** test を作成・変更する、mock を追加する、test cleanup / helper method を追加したくなったとき。

## Overview

test は特定の壊れ方を捕まえるために存在する。すべては 2 つの原則で決まる。

```text
1. すべての test は、捕まえる break を名指しする
2. すべての test は、real thing を実行する
```

厳密な TDD なら、この 2 つは自然に満たされる。先に書き、real code に対して fail を確認した test は、すでに「壊れ得る」ことを証明している。mock が許されるのは、real dependency が遅い、または外部にあると確認できた場合だけ。

## Principle 1: Name the Break

test body を書く前に答える: **どの production change でこの test は fail すべきか。それは bug か、意図的 decision か。**

test が存在する価値は、wrong branch、missing side effect、wrong argument、boundary case、broken contract を捕まえることにある。

**期待値は独立に導出する。** literal と手で確認した fixture を使う。table-driven test でも `want` は literal にする。期待値を code under test やその helper で計算すると、対象 code が何をしても pass してしまう。

```typescript
// bad: mirror assertion。同じ builder が両側を計算するので常に true
const expected = buildSearchQuery({ tag: 'urgent' });
expect(buildSearchQuery({ tag: 'urgent' })).toBe(expected);

// good: 手で導出した literal
expect(buildSearchQuery({ tag: 'urgent' })).toBe('tag:"urgent"');
```

**change detector を書かない。** constant の値、message の完全一致、private structure など、意図的 decision だけで fail する test は redesign で鳴り、bug では眠る。その decision に依存する behavior を test する。`expect(MAX_RETRIES).toBe(5)` ではなく、「失敗 call は 5 回 retry され、6 回目は発生しない」を test する。

**text ではなく behavior。** script、skill、config が特定の行を含むことを assert しても、source が source であることしか証明しない。script は controlled input で実行し、output、side effect、exit code を assert する。agent 向け文書は consuming agent の behavior で test する（superpowers:writing-skills）。人間向け prose は test を持たなくてよい。

**framework ではなく自分の code。** 自分の code が boundary で約束する contract を test する。登録する route、発行する query、生成する payload。upstream mechanics は upstream maintainer が test する領域である。upstream behavior に本当に驚かされた場合だけ、その前提を名指しする narrow characterization test を書く。constructor、getter、constant、trivial forwarding も同じで、validate、normalize、default、derive、enforce、side effect のどれかがないなら、それ自体ではなく最初の consumer-visible result を assert する。

### Gate Function

```text
test body を書く前に:
  この test を fail させる production change を名指しする。

  名指しできない              → observable behavior を中心に設計し直す
  "source text が変わった"    → artifact を実行して effect を assert する
  intentional decision だけ   → change detector。decision に依存する behavior を test する

  期待値が code under test から独立に導出されているか確認する。
  code の logic / helper を再利用しているなら:
    literal または手で確認した fixture に置き換える
```

## Principle 2: Exercise the Real Thing

**mock は assertion を受ける対象ではない。** mock assertion は mock があれば pass し、なければ fail する。component については何も言っていない。real component の behavior を assert する。mock そのものを確認しているなら、unmock するか assertion を削除する。

```typescript
// good: real behavior
expect(screen.getByRole('navigation')).toBeInTheDocument();

// bad: mock の存在
expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
```

**人間の担当者からの correction:** 「mock の behavior を test していますか。」

**正しい layer で mock する。** real method の side effect をすべて理解してから置き換える。遅い処理や外部 operation だけを mock し、test が依存する side effect は real のまま残す。迷うなら、まず real implementation に対して test を実行し、実際に何が必要か観察する。

```typescript
// bad: duplicate detection が読む config write まで mock が飲み込む
vi.mock('ToolCatalog', () => ({
  discoverAndCacheTools: vi.fn().mockResolvedValue(undefined)
}));

// good: 遅い server startup だけ mock し、config write は real のまま
vi.mock('MCPServerManager');
```

**double は具体的にする。** argument、call count、ordering が contract の一部なら assert する。何でも受け入れる fake は何も検証しない。success、error、malformed の branch ごとに fixture / spy を分け、wrong branch が期待値を満たせないようにする。

**real data を完全に mirror する。** mock は実際の structure を完全に表す。test が読む field だけでなく、documented field を含める。partial mock は downstream code が omitted field を読むと静かに壊れる。test は pass し、integration が壊れる。

**production class は production method だけを持つ。** test だけが必要とする cleanup は test utility に置く。production class に `destroy()` として生やさない。問う: この method は test からしか呼ばれないか。この class は resource lifecycle を所有しているか。答えが違うなら test utility。

**複雑な mock より real component を優先する。** mock setup が test logic より大きくなる、real component が持つ method を mock が漏らす、mock 変更で test が壊れる。その場合は real component を使う integration test に切り替える。

**人間の担当者からの question:** 「mock を使う必要がありますか。」

### Gate Function

```text
mock または test helper を追加する前に:
  real method の side effect を列挙する。
  test が依存する side effect は real のまま残し、遅い / 外部 layer だけ mock する。

  mock response は real structure を完全に mirror する。

  test だけが呼ぶ method は production ではなく test utility に置く。

  mock 自体を assert しようとしている?
    unmock するか assertion を削除する。
```

## Tests Ship With the Implementation

TDD cycle、つまり failing test、minimal implementation、refactor が「complete」の意味である。behavior に必要な test だけを implementation と一緒に ship する。trivial code と人間向け prose は test を持たない。process を満たすためだけの test は永続的な maintenance cost になる。

## The Mutation Check

完了前に production code を頭の中で mutate する。現実的な mutation ごとに少なくとも 1 つの test が fail するべきである。

- wrong constant / wrong argument
- wrong branch handler
- missing state change / missing side effect
- empty return / default return
- zero、empty、nil、unauthorized、malformed input の validation 抜け

何も捕まえない mutation があるなら、その behavior は無防備か、その test が tautological である。

## Quick Reference

| When you... | Do |
| --- | --- |
| test を書く | 捕まえる break を名指しする。decision ではなく bug |
| 期待値を作る | 手で導出する。code under test で計算しない |
| script / document を test する | 実行する / consumer を pressure-test する。source grep しない |
| dependency test に手が伸びる | documented mechanics ではなく、自分の boundary contract を test する |
| mocked element を assert したい | real component を test するか unmock する |
| method を mock しようとしている | side effect を調べ、遅い / 外部 layer だけ mock する |
| mock response を作る | real structure を完全に mirror する |
| test だけの cleanup が必要 | test utility に置く |
| mock setup が膨らむ | real component の integration test に切り替える |
| test file を終える | mutation check を行う |

## Warning Signs

- setup と assertion が同じ object を共有し、等価が保証されている
- test が panic、crash、missing selector でしか fail しない
- intentional change では毎回 fail するが accidental break では fail しない
- expected value が loop、builder、helper に隠れている
- source text を grep している、または removed symbol が消えたままか assert している
- framework だけが残っても意味がある test になっている
- coverage のためだけに存在し、side effect も outcome も確認していない
- assertion が `*-mock` test id を確認している、または mock を消すと fail する
- method が test file からしか呼ばれない
- mock setup が test の半分以上を占める、または mock が必要な理由を説明できない
- 「念のため」mock している
