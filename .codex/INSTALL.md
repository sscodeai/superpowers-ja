# Install Superpowers-JA for Codex

Use Codex native skill discovery by cloning this repository and linking its `skills` directory.

## Prerequisites

- Git

## Install

```bash
git clone https://github.com/sscodeai/superpowers-ja.git ~/.codex/superpowers-ja
mkdir -p ~/.agents/skills
ln -s ~/.codex/superpowers-ja/skills ~/.agents/skills/superpowers-ja
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
cmd /c mklink /J "$env:USERPROFILE\.agents\skills\superpowers-ja" "$env:USERPROFILE\.codex\superpowers-ja\skills"
```

Restart Codex after installation.

## Verify

```bash
ls -la ~/.agents/skills/superpowers-ja
```

## Update

```bash
cd ~/.codex/superpowers-ja
git pull
```

## Uninstall

```bash
rm ~/.agents/skills/superpowers-ja
rm -rf ~/.codex/superpowers-ja
```
