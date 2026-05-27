---
name: mcp-builder
description: MCP server 構築方法論。AI assistant を外部能力へ接続する production-ready な MCP tool を体系的に設計、実装、テストする。
---

# MCP Server を構築する

Model Context Protocol server を設計、実装、テスト、配布するための実務 guide です。

## Core Concepts

MCP の主要 primitive:

- **Tools:** AI assistant が能動的に呼ぶ function。検索、作成、削除など副作用を持つ操作。
- **Resources:** assistant が read-only で読む data source。URI で識別する。
- **Prompts:** user interaction を誘導する reusable template。

選択基準:
- 操作する、変更する、外部 API を叩く -> Tool
- 読むだけ、参照するだけ -> Resource
- 定型 workflow を始める -> Prompt

## Project Structure

TypeScript:

```text
my-mcp-server/
  src/
    index.ts
    tools/
    resources/
    lib/
  tests/
  package.json
  tsconfig.json
```

Python:

```text
my-mcp-server/
  src/my_mcp_server/
    server.py
    tools/
    lib/
  tests/
  pyproject.toml
```

推奨:
- registration と business logic を分ける
- external client wrapper を `lib/` に置く
- schema validation を handler の入口に置く
- test は pure function と MCP protocol integration の両方を持つ

## Tool Design

### Naming

- `snake_case`
- 動詞から始める: `search_issues`, `create_ticket`, `delete_file`
- 名前だけで用途が分かる
- 複数 service を扱う場合は service 名を含める

曖昧な名前は tool selection を悪化させます。

### Parameters

- schema で型を制約する
- 各 parameter に description を書く
- optional parameter には default を用意する
- boolean が曖昧なら enum を使う
- destructive operation には confirmation parameter を要求する

```typescript
server.tool("search_issues", {
  query: z.string().describe("Search keywords"),
  status: z.enum(["open", "closed", "all"]).default("open"),
  limit: z.number().min(1).max(100).default(20),
}, async ({ query, status, limit }) => {
  return searchIssues({ query, status, limit });
});
```

### Description

Tool description は assistant の routing metadata です。用途、返す内容、制限を短く書きます。

```typescript
server.tool(
  "search_users",
  "Search users by name or email. Returns id, name, and email. Fuzzy match, max 50 results.",
  schema,
  handler
);
```

### Output

- structured data は JSON
- user-facing explanation は Markdown
- error は `isError: true`
- 次に取れる action を含める

## Validation and Errors

Zod / Pydantic で schema-level validation を行い、business-level validation は handler 冒頭に置きます。

```typescript
server.tool("get_user", { id: z.string() }, async ({ id }) => {
  try {
    const user = await db.getUser(id);
    if (!user) {
      return {
        content: [{ type: "text", text: `User ${id} was not found. Check the id and retry.` }],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Query failed: ${err.message}` }],
      isError: true,
    };
  }
});
```

Error handling rules:

- external call は必ず timeout と try/catch を持つ
- server process を落とさない
- `isError: true` を返す
- user / assistant が次に何を確認すべきかを書く
- permission、not found、validation、service unavailable を区別する

## Resources and Lifecycle

```typescript
server.resource("user-profile", "users://{userId}/profile", async (uri) => {
  const profile = await db.getProfile(extractId(uri));
  return {
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(profile),
    }],
  };
});
```

Lifecycle:

1. config を読む
2. external clients / pools を初期化する
3. tools / resources を登録する
4. transport に connect する
5. SIGINT / SIGTERM で close する

外部 call には timeout を設定し、connection pool や file handle は graceful shutdown で閉じます。

## Testing

### Unit Test

MCP registration から business logic を分け、pure function を test します。

```typescript
export async function searchUsers(query: string, limit: number) {
  // business logic
}

test("returns matching users", async () => {
  const results = await searchUsers("alice", 10);
  expect(results[0].name).toContain("Alice");
});
```

### Integration Test

SDK client から tool を呼び、protocol-level behavior を確認します。

```typescript
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await server.connect(serverTransport);

const client = new Client({ name: "test", version: "1.0.0" });
await client.connect(clientTransport);

const result = await client.callTool("search_users", { query: "test" });
expect(result.isError).toBeFalsy();
```

### Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Inspector で tools / resources の表示、manual call、error output を確認します。

Test coverage:
- happy path
- validation error
- not found
- permission failure
- external timeout
- boundary values

## Security

Permission:
- read tool と write tool を分ける
- least privilege
- destructive operation は `confirm: true` などを要求する

Input:
- SQL は parameterized query
- path は normalize し、allowed root 外を拒否する
- shell は `exec` より `execFile`
- URL / host allowlist を検討する

Secrets:
- API key は environment variable
- log に secret を出さない
- response は必要に応じて redaction する

Sandbox:
- file operation は root directory を制限する
- network と resource usage に制限を置く
- large output は pagination / limit を持つ

## Deployment

npm:

```json
{
  "bin": {
    "mcp-server-myservice": "dist/index.js"
  },
  "files": ["dist", "README.md"]
}
```

Client config:

```json
{
  "mcpServers": {
    "myservice": {
      "command": "npx",
      "args": ["@yourorg/mcp-server-myservice"],
      "env": { "API_KEY": "..." }
    }
  }
}
```

Python:

```toml
[project.scripts]
mcp-server-myservice = "my_mcp_server.server:main"
```

Docker is useful when dependencies are heavy or isolation matters.

## Debugging

MCP stdio transport では `console.log` / stdout debug を使わないでください。protocol stream を壊します。

```typescript
// Bad
console.log("debug");

// OK
console.error("[debug]", info);

// Better when supported
server.sendLoggingMessage({ level: "info", data: "processing" });
```

Common issues:

| Symptom | Cause | Fix |
| --- | --- | --- |
| Server hangs | transport not connected | check `server.connect()` |
| Tool missing | registered after connect | register before connect |
| Tool not selected | unclear name / description | improve metadata |
| Bad arguments | weak schema | add descriptions and enums |
| Timeout | slow external service | add timeout and cache |
| Broken protocol | stdout logging | log to stderr |

Debug flow:

1. Run unit tests
2. Run integration tests
3. Inspect with MCP Inspector
4. Connect from real client
5. Observe actual tool selection and revise descriptions

## Build Checklist

Design:
- [ ] Tools / Resources / Prompts are separated correctly
- [ ] Tool names are verb-first and specific
- [ ] Descriptions say purpose, output, and limits
- [ ] Parameters have types, descriptions, and defaults

Implementation:
- [ ] Zod / Pydantic validates input
- [ ] external calls have timeout and try/catch
- [ ] errors return `isError: true`
- [ ] no stdout debug on stdio transport
- [ ] secrets come from environment variables

Testing:
- [ ] core logic has unit tests
- [ ] MCP protocol has integration tests
- [ ] Inspector manual calls work
- [ ] real client tested tool discovery and calls

Release:
- [ ] install instructions are documented
- [ ] client config JSON is provided
- [ ] package includes built files only
- [ ] semver is followed
- [ ] no hardcoded secrets or local paths
