# Install Superpowers-JA for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai)

## Install

Add superpowers-ja to the `plugin` array in your global or project `opencode.json`.

```json
{
  "plugin": ["superpowers@git+https://github.com/sscodeai/superpowers-ja.git"]
}
```

Restart OpenCode. The plugin registers all skills automatically.

## Usage

Use OpenCode's native `skill` tool.

```text
use skill tool to list skills
use skill tool to load superpowers/brainstorming
```

## Pin a Version

```json
{
  "plugin": ["superpowers@git+https://github.com/sscodeai/superpowers-ja.git#v1.4.0"]
}
```

## Tool Mapping

When skills reference Claude Code tools, use OpenCode equivalents:

- `TodoWrite` -> `todowrite`
- `Task` subagents -> OpenCode subagent system
- `Skill` -> OpenCode native `skill`
- File operations -> OpenCode native tools

## Help

- Issues: https://github.com/sscodeai/superpowers-ja/issues
- Docs: https://github.com/sscodeai/superpowers-ja
