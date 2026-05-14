# Codex Tool Mapping

skills は Claude Code の tool 名を使う。Codex でこれらの名前に出会った場合は、対応する platform equivalent を使う。

| Skill 内の参照 | Codex equivalent |
| --- | --- |
| `Task` tool（subagent dispatch） | `spawn_agent` |
| 複数の `Task` call（parallel） | 複数の `spawn_agent` call |
| Task result | `wait` |
| Task completion cleanup | `close_agent` で slot を解放 |
| `TodoWrite`（task tracking） | `update_plan` |
| `Skill` tool（skill 呼び出し） | native skill loading。説明に従って直接進める |
| `Read`、`Write`、`Edit`（file） | native file tools |
| `Bash`（command execution） | native shell tool |

## Subagent Dispatch Requires Multi-Agent Support

Codex config file（`~/.codex/config.toml`）に次を追加する。

```toml
[features]
multi_agent = true
```

有効化すると `spawn_agent`、`wait`、`close_agent` が使える。`dispatching-parallel-agents`、`subagent-driven-development` などの skills を支える。
