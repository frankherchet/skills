---
name: xp-setup
description: Set up a project for the issue-driven XP workflow. Interviews the user about the GitHub remote, build and CI, labels, Definition of Ready and Done, human gates, architecture and requirements, then writes the "## XP Workflow" section into AGENTS.md, creates the labels and adds the requirements file with its schema. Use when the user says "set up xp", "set up the workflow", "configure AGENTS.md for issues", or when another xp-* skill finds no "## XP Workflow" section. Safe to rerun. First skill of the xp loop; hands over to xp-issues.
---

# xp-setup

Give a project one shared rule set in `AGENTS.md`, so that every xp-* skill works the same way in Claude Code, Codex and Copilot.

**Loop:** **setup** → issues → refine → implement | bugfix → ship → retro

## Before you start

1. Read `AGENTS.md`, `CLAUDE.md`, the README, the git remote (`git remote -v`), the existing labels (`gh label list --limit 200`), the build, test and lint commands (package.json, Makefile, CI config), and any requirements or architecture docs.
2. Check `gh auth status`. If it fails, use the host's GitHub MCP tools or ask the user to run `gh auth login`.
3. If `## XP Workflow` already exists, this is an update: change only what the user wants changed.

## Interview

Work in interview mode: one topic at a time, each with a proposed answer drawn from what you read.

1. **Repository:** remote and default branch.
2. **Build and CI:** the command that builds and runs all tests, and whether CI runs it on every push and PR. Time one run. Over 10 minutes is worth fixing first, because every later skill depends on quick feedback. Without CI, offer a minimal workflow that runs the test command on push and PR.
3. **Labels:** the default table, or a mapping onto existing labels that mean the same. Never create duplicates.
4. **Definition of Ready and Done:** the template defaults plus project-specific items.
5. **Human gates:** the four fixed gates plus any the user adds.
6. **Architecture:** a short overview of components, boundaries and key technologies, drafted from the code if there is any.
7. **Requirements:** file location, and whether to import existing requirements from the README, issues or docs as `draft` entries.

## Write

1. Fill in [references/agents-section.md](references/agents-section.md) and put it into `AGENTS.md` between `<!-- xp:begin -->` and `<!-- xp:end -->`. On an update, replace only what is between the markers and keep the user's own edits unless they conflict with the new answers.
2. Make sure `CLAUDE.md` contains `@AGENTS.md`. Create it with that line if it is missing.
3. Create the missing labels: `gh label create "<name>" --color <color> --description "<meaning>"`.
4. Copy [references/requirements.schema.json](references/requirements.schema.json) next to the requirements file. Create the requirements file if it is missing, with `version: 1` and either `requirements: []` or the imported drafts. [references/requirements.example.yaml](references/requirements.example.yaml) shows the format.
5. Write `docs/architecture.md` and create `docs/adr/` with a `.gitkeep`.
6. Add the CI workflow if the user accepted it.

## Rules

- Never change user content outside the xp markers.
- Never delete GitHub labels.
- Write in English unless the project's docs use another language.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-issues` to plan the first milestone and its epics.
