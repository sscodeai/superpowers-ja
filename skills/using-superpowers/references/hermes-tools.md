# Hermes Agent Tool Mapping

skills は Claude Code の tool 名を使う。skill 内でこれらの tool に出会った場合は、platform equivalent を使う。

| Skill 内の tool reference | Hermes Agent equivalent |
| --- | --- |
| `Read`（file read） | `read_file` |
| `Write`（file create） | `write_file` |
| `Edit`（file edit） | `patch` |
| `Bash`（command execution） | `terminal` |
| `Grep`（file content search） | `search_files` |
| `Glob`（file name search） | `search_files` |
| `Skill` tool（skill invocation） | `skill_view` |
| `WebFetch` | `web_extract` |
| `WebSearch` | `web_search` |
| `Task` tool（subagent dispatch） | `delegate_task` |
| 複数の `Task` call（parallel） | 複数の `delegate_task` call |
| `TodoWrite`（task tracking） | `todo` |
| `EnterPlanMode` / `ExitPlanMode` | equivalent なし。main session に留まる |

## Skill Management

Hermes Agent は 3 段階の progressive skill loading を使う。

| Operation | Tool |
| --- | --- |
| available skills を一覧する | `skills_list` |
| skill full content を見る | `skill_view(name)` |
| skill reference file を見る | `skill_view(name, path)` |
| skill を管理する（install / update） | `skill_manage` |

## Additional Hermes Agent Tools

| Tool | Purpose |
| --- | --- |
| `memory` | knowledge を future session 用に永続化 |
| `session_search` | historical session record を検索 |
| `execute_code` | sandbox で code を実行 |
| `process` | background process management |
| `vision_analyze` | image analysis |
| `image_generate` | image generation |
| `clarify` | ユーザーへ clarifying question を出す |
| `browser_*` | browser automation toolset |
| `mixture_of_agents` | multi-agent advanced reasoning |
