# Superpowers-JA Contributor Guide

## For AI Agents

Before changing this repository, read the relevant files and keep the scope tight.

This project is a Japanese IT development edition of `obra/superpowers`. It keeps the upstream workflow philosophy while adding Japan-specific references for review, Git workflow, documentation, and commit conventions.

Do not submit changes upstream to `obra/superpowers` that are specific to this fork. Japan-specific skills, branding, installer behavior, and local workflow guidance belong here.

## Contribution Rules

- One change should solve one concrete problem.
- Do not fabricate issues, evidence, benchmark results, or compatibility claims.
- Do not bulk-edit tuned skill behavior without evaluation.
- Preserve existing upstream skill intent unless there is a clear fork-specific reason.
- For installer or harness changes, verify that skills are discoverable and that bootstrap instructions load at session start.
- For skill changes, include before/after behavior notes or a small manual eval transcript.

## Fork Scope

`superpowers-ja` focuses on:

- Japanese language bootstrap and documentation
- Japanese team review communication
- GitHub / GitLab / Bitbucket / Backlog / Redmine / Jira workflows
- Japanese technical documents, specifications, acceptance criteria, and operational evidence
- Japanese-friendly Conventional Commits and changelog practices

## Non-Goals

- Adding project-specific skills that only fit one company or product
- Replacing upstream general-purpose workflows with local preferences
- Depending on paid services or private platforms for core behavior
- Adding third-party runtime dependencies unless a harness requires them

## Verification

At minimum, run:

```bash
node bin/superpowers-ja.js --help
node bin/superpowers-ja.js --version
```

For install behavior, test in a temporary project directory with `--tool claude` or another explicit target.
