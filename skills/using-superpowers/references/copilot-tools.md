# Copilot CLI Tool Mapping

skills は Claude Code の tool 名を使う。skill 内でこれらの tool に出会った場合は、platform equivalent を使う。

| Skill 内の tool reference | Copilot CLI equivalent |
| --- | --- |
| `Read`（file read） | `view` |
| `Write`（file create） | `create` |
| `Edit`（file edit） | `edit` |
| `Bash`（command execution） | `bash` |
| `Grep`（file content search） | `grep` |
| `Glob`（file name search） | `glob` |
| `Skill` tool（skill invocation） | `skill` |
| `WebFetch` | `web_fetch` |
| `Task` tool（subagent dispatch） | `task`（[Agent Types](#agent-types) を参照） |
| 複数の `Task` call（parallel） | 複数の `task` call |
| Task status / output | `read_agent`、`list_agents` |
| `TodoWrite`（task tracking） | `sql` with built-in `todos` table |
| `WebSearch` | equivalent なし。`web_fetch` と search engine URL を組み合わせる |
| `EnterPlanMode` / `ExitPlanMode` | equivalent なし。main session に留まる |

## Agent Types

Copilot CLI の `task` tool は `agent_type` parameter を受け取る。

| Claude Code agent | Copilot CLI equivalent |
| --- | --- |
| `general-purpose` | `"general-purpose"` |
| `Explore` | `"explore"` |
| named plugin agent（例: `superpowers:code-reviewer`） | installed plugin から自動発見 |

## Async Shell Sessions

Copilot CLI は persistent async shell session を support する。これは Claude Code に直接の equivalent がない。

| Tool | Purpose |
| --- | --- |
| `bash` with `async: true` | long-running command を background 起動 |
| `write_bash` | running async session へ input を送る |
| `read_bash` | async session output を読む |
| `stop_bash` | async session を停止 |
| `list_bash` | active shell session を一覧 |

## Additional Copilot CLI Tools

| Tool | Purpose |
| --- | --- |
| `store_memory` | codebase 関連 fact を future session 用に永続化 |
| `report_intent` | current intent を UI status line に表示 |
| `sql` | session SQLite database（todo、metadata）を query |
| `fetch_copilot_cli_documentation` | Copilot CLI docs を参照 |
| GitHub MCP tools（`github-mcp-server-*`） | native GitHub API access（issue、PR、code search） |
