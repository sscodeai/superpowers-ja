# Defense-In-Depth Validation

## Overview

invalid data が原因の bug を直すとき、一箇所に validation を追加すれば十分に見える。しかし single check は、別 code path、refactor、mock によって bypass されることがある。

**Core principle:** data が通るすべての layer で validation する。この bug が構造的に起きないようにする。

## Why Multiple Validation Layers Matter

single-layer validation: 「この bug を直した」

multi-layer validation: 「この bug が再発できない構造にした」

layer ごとに捕まえる問題が違う。

- entry validation は大半の bug を捕まえる
- business logic validation は edge case を捕まえる
- environment guard は特定 context の dangerous operation を防ぐ
- debug logging は他 layer が効かなかったときに助けになる

## Four Layers

### Layer 1: Entry Validation

**Purpose:** API boundary で明らかに invalid な input を拒否する。

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... continue
}
```

### Layer 2: Business Logic Validation

**Purpose:** data が current operation に対して妥当であることを保証する。

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // ... continue
}
```

### Layer 3: Environment Guard

**Purpose:** 特定 environment で dangerous operation が実行されることを防ぐ。

```typescript
async function gitInit(directory: string) {
  // test 中は temp directory 外で git init することを拒否する
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing git init outside temp dir during tests: ${directory}`
      );
    }
  }
  // ... continue
}
```

### Layer 4: Debug Instrumentation

**Purpose:** 後続調査のため context information を記録する。

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... continue
}
```

## Application Pattern

bug を見つけたら:

1. **data flow を trace する** — wrong value はどこで生まれ、どこで使われたか
2. **checkpoint をすべて mark する** — data が通る node をすべて列挙する
3. **各 layer に validation を追加する** — entry、business logic、environment、debug
4. **各 layer を test する** — layer 1 を bypass して、layer 2 が捕まえるか確認する

## Real Case

Bug: empty `projectDir` により `git init` が source directory で実行された。

**Data flow:**

1. test setup → empty string
2. `Project.create(name, '')`
3. `WorkspaceManager.createWorkspace('')`
4. `git init` が `process.cwd()` で実行

**added four layers:**

- Layer 1: `Project.create()` が non-empty / exists / writable を validate
- Layer 2: `WorkspaceManager` が non-empty projectDir を validate
- Layer 3: `WorktreeManager` が test 中に tmpdir 外の git init を拒否
- Layer 4: git init 前に stack trace を log

**Result:** 1847 tests all pass。bug は再発できない構造になった。

## Key Insight

四つの layer はどれも必要である。test 中、それぞれの layer が別 layer の漏れを捕まえた。

- different code path が entry validation を bypass した
- mock が business logic check を bypass した
- platform-specific edge case に environment guard が必要だった
- debug log が structural misuse を発見した

**一つの validation point で止めない。** すべての layer に check を入れる。
