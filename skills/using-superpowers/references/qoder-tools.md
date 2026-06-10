# Qoder Tool Mapping

Superpowers skills は Claude Code の tool 名を使います。Qoder では多くの操作が同名または近い概念で提供されます。

| Skill 内の参照 | Qoder での読み替え |
| --- | --- |
| `Read` / `Write` / `Edit` | 同名または file read / write / edit tool |
| `Bash` | 同名または shell / terminal 実行 tool |
| `Grep` / `Glob` | 同名または code search / file search |
| `Task` | 同名または Qoder の agent delegation |
| `WebFetch` / `WebSearch` | 同名または web access / search tool |
| `AskUserQuestion` | 同名または user confirmation / question |
| `Skill` | 同名、または `/<skill-name>` による明示呼び出し |
| `TodoWrite` | 同名または task / todo 管理 |
| `EnterPlanMode` / `ExitPlanMode` | `EnterSpecMode` / `ExitSpecMode` 相当。Qoder では plan mode を Spec mode と呼ぶ |

## Task Agent

| Claude Code agent | Qoder での読み替え |
| --- | --- |
| `general-purpose` | `general-purpose` |
| `Explore` | `explore-agent` |
| `Plan` | `plan-agent` |
| `claude-code-guide` | `qoder-guide` |

Qoder 側に `browser-agent`、`code-reviewer`、`design-agent` などの専用 agent がある場合は、task の性質に最も近い agent を選んでください。

## Quest MCP Tools

Qoder の Quest system が使える環境では、次のような Qoder native tools を補助的に使えます。Claude Code には直接の等価 tool がないため、skill の手順を壊さない範囲で追加の探索・検証に使います。

| Tool | 用途 |
| --- | --- |
| `mcp__quest__search_codebase` | 意図ベースの code search |
| `mcp__quest__search_symbol` | symbol 名と関係の検索 |
| `mcp__quest__get_problems` | file の compile / syntax error 確認 |
| `mcp__quest__run_preview` | local web server preview |
| `mcp__quest__search_memory` / `mcp__quest__update_memory` | cross-session memory |
| `mcp__quest__fetch_rules` | rule file の確認 |

## Loading

`npx superpowers-ja --tool qoder` は次を配置します。

- `.qoder/skills/<skill-name>/SKILL.md`
- `.qoder/rules/superpowers-ja.md`

bootstrap rule は `trigger: always_on` を使い、会話開始時に基本ルールと skill index を参照しやすくします。Qoder の schema が変わった場合は、Qoder Settings の Rules で rule type を確認してください。
