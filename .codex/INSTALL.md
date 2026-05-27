# Install Superpowers-JA for Codex

Use Codex native skill discovery with a project-local install.

## Prerequisites

- Node.js 20+

## Install

Run from the project where you want to use superpowers-ja:

```bash
cd /path/to/your/project
npx superpowers-ja --tool codex
```

This creates `.codex/skills/` in the current project and copies all superpowers-ja skills there.

Do not run this from your home directory (`~`) unless you intentionally want a home-level install.

## Verify

```bash
test -f .codex/skills/using-superpowers/SKILL.md
ls .codex/skills
```

Restart Codex after installation.

## Update

```bash
cd /path/to/your/project
npx superpowers-ja --tool codex
```

Re-running the installer refreshes the project-local skills.

## Uninstall

```bash
cd /path/to/your/project
npx superpowers-ja --uninstall
```

## Advanced: User-Level Install

If you deliberately want one checkout shared across projects, use Codex user-level skill discovery with a symlink or junction. This affects every project for that user, so project-local install is recommended for team work.

```bash
git clone https://github.com/sscodeai/superpowers-ja.git ~/.codex/superpowers-ja
mkdir -p ~/.agents/skills
ln -s ~/.codex/superpowers-ja/skills ~/.agents/skills/superpowers-ja
```
