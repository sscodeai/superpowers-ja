# Testing Anti-patterns

**この reference を読む場面:** test の作成・変更、mock の追加、production code に test-only method を追加したくなったとき。

## Overview

test は real behavior を検証する。mock behavior を検証しない。Mock は isolation の手段であり、test target ではない。

**Core principle:** mock が何をしたかではなく、code が何をしたかを test する。

**TDD を厳密に守ると、これらの anti-pattern を防げる。**

## Iron Laws

```text
1. mock behavior を絶対に test しない
2. production class に test-only method を絶対に追加しない
3. dependency を理解せずに mock を絶対に使わない
```

## Anti-pattern 1: Testing Mock Behavior

**Violation:**

```typescript
// bad: mock の存在を test している
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
});
```

**Why this is wrong:**

- component が動くことではなく、mock が動くことを検証している
- mock が存在すれば pass し、なければ fail する
- real behavior について何も分からない

**人間の担当者からの correction:** 「これは mock の behavior を test していますか。」

**Correct approach:**

```typescript
// good: real component を test する。あるいは mock しない
test('renders sidebar', () => {
  render(<Page />);  // sidebar を mock しない
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

// または、isolation のため sidebar を mock せざるを得ない場合:
// mock 自体に assert しない。sidebar が存在する状況で Page がどう振る舞うかを test する
```

### Gate Function

```text
mock element に assertion する前に:
  問う: "real component behavior を test しているか、mock の存在だけを test しているか"

  mock の存在を test しているなら:
    停止する。assertion を削除するか、mock を外す。

  real behavior を test する。
```

## Anti-pattern 2: Adding Test-only Methods To Production Code

**Violation:**

```typescript
// bad: destroy() は test でしか使わない
class Session {
  async destroy() {  // production API のように見える
    await this._workspaceManager?.destroyWorkspace(this.id);
    // ... cleanup
  }
}

// test 内
afterEach(() => session.destroy());
```

**Why this is wrong:**

- production class が test-only code で汚染される
- production で誤って呼ばれると危険
- YAGNI と separation of concerns に反する
- object lifecycle と entity lifecycle を混同している

**Correct approach:**

```typescript
// good: test utility が test cleanup を扱う
// Session に destroy() はない。production では stateless

// test-utils/ 内
export async function cleanupSession(session: Session) {
  const workspace = session.getWorkspaceInfo();
  if (workspace) {
    await workspaceManager.destroyWorkspace(workspace.id);
  }
}

// test 内
afterEach(() => cleanupSession(session));
```

### Gate Function

```text
production class に method を追加する前に:
  問う: "これは test でしか使われないか"

  yes なら:
    停止する。追加しない。
    test utility に置く。

  問う: "この class はこの resource の lifecycle を所有しているか"

  no なら:
    停止する。この method はこの class に属さない。
```

## Anti-pattern 3: Mocking Without Understanding Dependencies

**Violation:**

```typescript
// bad: mock が test logic を壊している
test('detects duplicate server', () => {
  // mock が、この test に必要な config write を止めてしまう
  vi.mock('ToolCatalog', () => ({
    discoverAndCacheTools: vi.fn().mockResolvedValue(undefined)
  }));

  await addServer(config);
  await addServer(config);  // throw すべきだが、throw しない
});
```

**Why this is wrong:**

- mocked method には test が依存する side effect（config write）がある
- 「念のため」の over-mocking が real behavior を壊している
- test が wrong reason で pass する、または不可解に fail する

**Correct approach:**

```typescript
// good: 正しい layer で mock する
test('detects duplicate server', () => {
  // 遅い部分だけ mock し、test に必要な behavior は残す
  vi.mock('MCPServerManager'); // 遅い server startup だけ mock

  await addServer(config);  // config が書かれる
  await addServer(config);  // duplicate が検出される
});
```

### Gate Function

```text
method を mock する前に:
  停止する。まだ mock しない。

  1. 問う: "real method にはどんな side effect があるか"
  2. 問う: "この test はその side effect に依存しているか"
  3. 問う: "この test に必要なものを完全に理解しているか"

  side effect に依存しているなら:
    より低い layer を mock する（実際に遅い operation / external operation）
    または必要な behavior を保持する test double を使う
    test が依存する high-level method を mock しない

  test の依存が不明なら:
    まず real implementation で test を実行する
    実際に何が必要か観察する
    その後、正しい layer に最小 mock を追加する

  danger signal:
    - "念のため mock しておこう"
    - "これは遅そうだから mock しよう"
    - dependency chain を理解せずに mock する
```

## Anti-pattern 4: Incomplete Mock

**Violation:**

```typescript
// bad: partial mock。必要だと思った field だけを含む
const mockResponse = {
  status: 'success',
  data: { userId: '123', name: 'Alice' }
  // missing: downstream code が使う metadata
};

// 後で code が response.metadata.requestId に access して crash
```

**Why this is wrong:**

- **partial mock は structure assumption を隠す** — 自分が知っている field だけを mock している
- **downstream code が未指定 field に依存している可能性がある** — 静かに壊れる
- **test は pass して integration は fail する** — mock は incomplete、real API は complete
- **false confidence** — test は real behavior について何も証明していない

**Iron law:** 現在の test が使う field だけではなく、real data structure 全体を mock する。

**Correct approach:**

```typescript
// good: real API の completeness を mirror する
const mockResponse = {
  status: 'success',
  data: { userId: '123', name: 'Alice' },
  metadata: { requestId: 'req-789', timestamp: 1234567890 }
  // real API が返すすべての field
};
```

### Gate Function

```text
mock response を作る前に:
  確認する: "real API response はどの field を含むか"

  action:
    1. documentation / example で actual API response を見る
    2. system downstream が consume する可能性のある field をすべて含める
    3. mock が real response structure と完全に一致することを検証する

  key point:
    mock を作るなら、complete structure を理解する必要がある
    partial mock は code が missing field に依存したとき静かに失敗する

  不明な場合: documented field をすべて含める
```

## Anti-pattern 5: Integration Tests As An Afterthought

**Violation:**

```text
実装完了
test なし
「これから test します」
```

**Why this is wrong:**

- test は implementation の一部であり、optional follow-up ではない
- TDD ならこの状態を防げた
- test なしで done とは言えない

**Correct approach:**

```text
TDD cycle:
1. failing test を書く
2. pass させる実装を書く
3. refactor
4. それから done と言う
```

## When Mocks Become Too Complex

**Warning signals:**

- mock setup が test logic より長い
- test を通すためにすべてを mock している
- mock に real component が持つ method がない
- mock が変わると test が壊れる

**人間の担当者からの question:** 「ここで本当に mock が必要ですか。」

**Consider:** real component を使った integration test の方が、complex mock より simple なことが多い。

## How TDD Prevents These Anti-patterns

**TDD が効く理由:**

1. **test first** → 何を test しているのかを考えざるを得ない
2. **watch it fail** → test が mock ではなく real behavior を見ているか確認できる
3. **minimal implementation** → test-only method が混入しにくい
4. **real dependency first** → mock 前に test が実際に必要とするものを見る

**mock behavior を test しているなら、TDD に違反している。** real code で test を fail させる前に mock を追加している。

## Quick Reference

| Anti-pattern | Fix |
| --- | --- |
| mock element に assertion する | real component を test する、または mock を外す |
| production code の test-only method | test utility へ移す |
| 理解せずに mock する | dependency を理解し、最小 mock にする |
| incomplete mock | real API を complete に mirror する |
| test を後付けにする | TDD。先に test を書く |
| mock が複雑すぎる | integration test を検討する |

## Danger Signals

- assertion が `*-mock` test ID を確認している
- method が test file からしか呼ばれていない
- mock setup が test の 50% 超
- mock を外すと test が fail する
- なぜ mock が必要か説明できない
- 「念のため」mock している

## Bottom Line

**Mock は isolation tool であり、test target ではない。**

TDD によって mock behavior を test していることが見えたなら、道を外れている。

fix: real behavior を test する。あるいは、なぜ mock が必要なのかを問い直す。
