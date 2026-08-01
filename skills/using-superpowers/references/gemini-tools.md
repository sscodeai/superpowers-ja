# Gemini CLI Tool Mapping

skills は action（「subagent を dispatch する」「todo を作る」「file を読む」など）として書かれている。Gemini CLI では、これらを次の tool に読み替える。

| Skill が求める action | Gemini CLI equivalent |
| --- | --- |
| file を読む | `read_file` |
| 複数 file をまとめて読む | `read_many_files` |
| 新しい file を作成する | `write_file` |
| file を編集する | `replace` |
| shell command を実行する | `run_shell_command` |
| file 内容を検索する | `grep_search` |
| file 名で検索する | `glob` |
| file / subdirectory を一覧する | `list_directory` |
| URL を fetch する | `web_fetch` |
| web 検索する | `google_web_search` |
| skill を呼び出す | `activate_skill` |
| subagent を dispatch する（`Subagent (general-purpose):` template） | `invoke_agent` with `agent_name: "generalist"`（chat syntax `@generalist` でも呼び出せる。下の Subagent support 参照） |
| 複数の並列 dispatch | 同じ response 内で複数の `invoke_agent` call |
| task tracking（todo 作成、完了 mark） | `write_todos`（status: pending, in_progress, completed, cancelled, blocked） |

## Instructions file

skill が「your instructions file」に言及する場合、Gemini CLI では **`GEMINI.md`** を指す。Gemini CLI は `GEMINI.md` を階層的に読み込む。global は `~/.gemini/GEMINI.md`、project-level は workspace directory と ancestor directory、sub-directory の `GEMINI.md` は tool がその directory 配下の file に access するときに読み込まれる。

## Personal skills directory

user-level skills は **`~/.gemini/skills/`** に置く。cross-runtime alias として **`~/.agents/skills/`** も使われる（Codex / Copilot CLI と共有）。同じ scope に両方ある場合、`.agents/skills/` が優先される。各 skill は `SKILL.md`（`name` と `description` frontmatter）を含む subdirectory である。

## Subagent support

Gemini CLI は `invoke_agent` tool で subagent を dispatch する。`invoke_agent` は `agent_name` と `prompt` を受け取る。同じ dispatch は chat syntax shortcut としても使える。`@generalist <prompt>` は `agent_name: "generalist"` の `invoke_agent` と同等である。built-in agent name には `generalist`、`cli_help`、`codebase_investigator`、browser tooling が有効な場合の `browser_agent` がある。

skills が `Subagent (general-purpose):` で dispatch し、prompt-template file（例: `superpowers:subagent-driven-development` の `./implementer-prompt.md`）または inline prompt を参照する場合、Gemini CLI では次のように扱う。

| Skill dispatch form | Gemini CLI equivalent |
| --- | --- |
| `*-prompt.md` template（implementer、task-reviewer、code-reviewer など）を参照する | template を埋め、`agent_name: "generalist"` の `invoke_agent` に complete prompt を渡す |
| `superpowers:requesting-code-review` の `./code-reviewer.md` を参照する | review template を埋め、`agent_name: "generalist"` の `invoke_agent` に渡す |
| inline prompt（template 参照なし） | inline prompt を `agent_name: "generalist"` の `invoke_agent` に渡す |

### Prompt filling

skill の prompt template には `{WHAT_WAS_IMPLEMENTED}` や `[FULL TEXT of task]` のような placeholder がある。`invoke_agent` に渡す前に、すべての placeholder を埋める。prompt template 自体に agent の role、review criteria、expected output format が含まれているため、subagent はそれに従う。

### Parallel dispatch

Gemini CLI は parallel subagent dispatch を support する。独立した subagent work は、同じ response 内で複数の `invoke_agent` call（または複数の `@generalist` invocation）を発行して並列実行する。依存 task は順序実行するが、単純な履歴にするためだけに独立 task を直列化しない。

## Additional Gemini CLI tools

Gemini CLI 固有の tool:

| Tool | Purpose |
| --- | --- |
| `save_memory` (legacy) | `experimental.memoryV2 = false` の場合に session 間で事実を永続化する |
| `get_internal_docs` | Gemini CLI bundled documentation を参照する |
| `ask_user` | structured question（text / single-select / multi-select）をユーザーに出す |
| `enter_plan_mode` / `exit_plan_mode` | read-only plan mode に入る / 戻る |
| `update_topic` | current conversation の topic / strategic-intent metadata を更新する |
| `complete_task` | Gemini subagent が完了したことを parent agent に返す |
| `tracker_create_task`, `tracker_update_task`, `tracker_get_task`, `tracker_list_tasks`, `tracker_add_dependency`, `tracker_visualize` | dependency と visualization を持つ rich task tracker |
| `read_mcp_resource`, `list_mcp_resources` | MCP resource access |
