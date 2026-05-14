# Gemini CLI Tool Mapping

skills は Claude Code の tool 名を使う。Gemini CLI でこれらの名前に出会った場合は、対応する platform equivalent を使う。

| Skill 内の参照 | Gemini CLI equivalent |
| --- | --- |
| `Read`（file read） | `read_file` |
| `Write`（file create） | `write_file` |
| `Edit`（file edit） | `replace` |
| `Bash`（command execution） | `run_shell_command` |
| `Grep`（file content search） | `grep_search` |
| `Glob`（file name search） | `glob` |
| `TodoWrite`（task tracking） | `write_todos` |
| `Skill` tool（skill invocation） | `activate_skill` |
| `WebSearch` | `google_web_search` |
| `WebFetch` | `web_fetch` |
| `Task` tool（subagent dispatch） | equivalent なし。Gemini CLI は subagent を support しない |

## No Subagent Support

Gemini CLI には Claude Code の `Task` tool に相当するものがない。subagent dispatch に依存する skills（`subagent-driven-development`、`dispatching-parallel-agents`）は、`executing-plans` による single-session execution へ fallback する。

## Additional Gemini CLI Tools

次の tool は Gemini CLI で利用できるが、Claude Code に direct equivalent はない。

| Tool | Purpose |
| --- | --- |
| `list_directory` | file と subdirectory を一覧 |
| `save_memory` | information を GEMINI.md に永続化し、session 間で保持 |
| `ask_user` | ユーザーへ structured input を依頼 |
| `tracker_create_task` | rich task management（create、update、list、visualize） |
| `enter_plan_mode` / `exit_plan_mode` | edit 前に調査する read-only planning mode へ切り替え |
