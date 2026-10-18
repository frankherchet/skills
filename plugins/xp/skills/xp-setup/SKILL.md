---
name: xp-setup
description: Set up a project for the issue-driven XP workflow. Interviews the user about the GitHub remote, labels, Definition of Ready, Definition of Done, architecture and requirements, then writes an "## XP Workflow" section into AGENTS.md, creates the GitHub labels and adds docs/requirements.yaml with its schema. Use when the user says "set up xp", "set up the workflow", "configure AGENTS.md for issues", or when another xp-* skill finds no "## XP Workflow" section in AGENTS.md. Safe to rerun; it updates instead of overwriting.
---

# xp-setup

Prepare a project so that every xp-* skill, in Claude Code, Codex and Copilot alike, can work from one shared set of rules in `AGENTS.md`.

## Outcome

- `AGENTS.md` contains the `## XP Workflow` section from [references/agents-section.md](references/agents-section.md) with every placeholder filled in.
- `CLAUDE.md` imports it: it contains `@AGENTS.md`. Create `CLAUDE.md` with that line if it does not exist.
- The GitHub repo has every label from the section's label table.
- `docs/requirements.yaml` and `docs/requirements.schema.json` exist (or the paths the user chose).
- CI runs the test command on every push and PR (or the user declined it).
- `docs/architecture.md` exists with at least a short overview, and `docs/adr/` exists.

## Steps

1. **Read what exists.** Look at `AGENTS.md`, `CLAUDE.md`, `README`, the git remote (`git remote -v`), the existing labels (`gh label list --limit 200`), the test and lint commands (package.json, Makefile, CI config) and any requirements or architecture docs. Check that `gh auth status` succeeds. If it fails, use the host's GitHub MCP tools, or ask the user to run `gh auth login`.
2. **Interview, one topic at a time.** Propose a default for every topic from what you found, so the user mostly confirms:
   - remote and default branch
   - labels: the default table, or a mapping onto existing labels (brownfield: keep existing labels that mean the same thing and rename the convention instead of duplicating)
   - Definition of Ready and Definition of Done: start from the defaults in the template and add project-specific items
   - build and CI: the command that builds and runs all tests, and whether CI runs it on every push. Time one run. If it takes longer than 10 minutes, say so and suggest speeding it up first, because every later skill relies on fast feedback. If there is no CI, offer a minimal workflow that runs the test command on push and PR.
   - extra human gates beyond the four fixed ones
   - architecture: a short overview (components, boundaries, key technologies). Draft it from the code if there is any.
   - requirements: the file location, and whether to import existing requirements (from a README, issues or docs) as `draft` entries
3. **Write the section.** Fill in [references/agents-section.md](references/agents-section.md) and put it into `AGENTS.md` between the `<!-- xp:begin -->` and `<!-- xp:end -->` markers. If the markers already exist, replace only what is between them and keep the user's edits unless they conflict with the new answers.
4. **Create the labels** that are missing: `gh label create "<name>" --color <color> --description "<meaning>"`. Use `--force` only for labels this skill created earlier.
5. **Requirements files.** Copy [references/requirements.schema.json](references/requirements.schema.json) next to the requirements file. If the requirements file does not exist, create it with `version: 1` and `requirements: []`, or with the imported drafts. [references/requirements.example.yaml](references/requirements.example.yaml) shows the format.
6. **Architecture.** Write `docs/architecture.md` from the interview and create `docs/adr/` with a `.gitkeep`.
7. **Summarize** what changed and suggest the next step: `xp-issues` to create the first milestone and epics.

## Rules

- Never overwrite user content outside the xp markers.
- Never delete GitHub labels.
- Write everything in English unless the project's existing docs use another language.
