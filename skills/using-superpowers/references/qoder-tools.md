# Qoder Tool Mapping

Superpowers skills は Claude Code の tool 名を使います。Qoder では多くの操作が同名または近い概念で提供されます。

| Skill 内の参照 | Qoder での読み替え |
| --- | --- |
| `Read` / `Write` / `Edit` | file read / write / edit tool |
| `Bash` | shell / terminal 実行 tool |
| `Grep` / `Glob` | code search / file search |
| `Task` | Qoder の agent delegation |
| `WebFetch` / `WebSearch` | web access / search tool |
| `AskUserQuestion` | user confirmation / question |
| `Skill` | skill 呼び出し、または `/<skill-name>` による明示呼び出し |
| `TodoWrite` | task / todo 管理 |
| `EnterPlanMode` / `ExitPlanMode` | Spec mode 相当 |

## Task Agent

Qoder 側に explore / plan / guide / code review などの agent がある場合、Claude Code の `Task` subagent 指示は最も近い Qoder agent に読み替えてください。

## Loading

`npx superpowers-ja --tool qoder` は次を配置します。

- `.qoder/skills/<skill-name>/SKILL.md`
- `.qoder/rules/superpowers-ja.md`

bootstrap rule は `trigger: always_on` を使い、会話開始時に基本ルールと skill index を参照しやすくします。Qoder の schema が変わった場合は、Qoder Settings の Rules で rule type を確認してください。
