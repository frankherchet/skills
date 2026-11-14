---
name: xp-setup
description: Set up or update a project for the issue-driven XP workflow. Writes the "## XP Workflow" section into AGENTS.md, creates the labels and adds the requirements file. Use for "set up xp", "configure the workflow", or when another xp-* skill finds no "## XP Workflow" section.
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-setup

Give a project one shared rule set in `AGENTS.md`, so that every xp-* skill works the same way in Claude Code, Codex and Copilot.

**Loop:** **setup** → issues → refine → implement | bugfix → ship → retro

## Before you start

1. Read `AGENTS.md`, `CLAUDE.md`, the README, the git remote (`git remote -v`), the existing labels (`gh label list --limit 200`), the build, test and lint commands (package.json, Makefile, CI config), and any requirements or architecture docs.
2. Check `gh auth status`. If it fails, use the host's GitHub MCP tools or ask the user to run `gh auth login`.
3. If `## XP Workflow` already exists, this is an update: change only what the user wants changed. A section that still has a `### Terms` heading was written before 0.4.0: rebuild it from the template and carry over every project value (remote, commands, label names, merge policy, gates, Definition of Ready and Done items, file locations) and every edit the user made.

## Interview

One batch, not ten questions. Work out a proposed answer for every topic from what you read, show all of them as one numbered list (with the host's question tool if it takes several questions at once), and let the user correct only what is wrong. Ask again only where a correction opens a new question.

1. **Repository:** remote and default branch.
2. **Build and CI:** the command that builds and runs all tests, the lint command, and whether CI runs them on every push and PR. Time one run. Over 10 minutes is worth fixing first, because every later skill depends on quick feedback. Without CI, offer a minimal workflow; if the user declines, the skills run the tests locally instead.
3. **Labels:** the default table in [references/labels.md](references/labels.md), or a mapping onto existing labels that mean the same. Never create duplicates, and never rename labels other tools (bots, automations) depend on; add the xp labels next to them. If the project already has a label for "waiting on a human decision", use it as the decision label.
4. **Definition of Ready and Done:** the template defaults plus project-specific items. An existing Definition of Done is merged in, not replaced.
5. **Merge policy:** default `agent`: the agent merges after `xp-ship` passes and an independent review approves, which is what lets `xp-run` go from kickoff to run report. Choose `human` if every PR needs a human review. Ask for the merge command (default `gh pr merge <n> --squash --delete-branch`), and make sure the agent's permission settings allow it. Protected paths an unattended agent never merges: default `.github/`, deployment configuration, dependency manifests and lockfiles.
6. **Human gates:** the fixed gates in the template plus any the user adds, and the trusted accounts whose issue comments count as decisions (default: the account `gh api user --jq .login` returns).
7. **Default mode:** `autopilot`: a human approves the kickoff and answers the run report, and the loop runs on its own in between. `interview` if the user wants to be asked along the way. Default: `autopilot`.
8. **Architecture:** if the project already describes its architecture (for example in CLAUDE.md or docs), point to that document. Otherwise draft a short overview of components, boundaries and key technologies from the code.
9. **Existing workflow docs:** if the project describes another workflow for agents, ask whether `## XP Workflow` replaces it. Replaced docs become a short pointer to the section, so agents do not follow two processes.
10. **Requirements:** file location, and whether to import existing requirements from the README, issues or docs as `draft` entries.

## Write

1. Fill in [references/agents-section.md](references/agents-section.md) and put it into `AGENTS.md` between `<!-- xp:begin -->` and `<!-- xp:end -->`. On an update, replace only what is between the markers and keep the user's own edits unless they conflict with the new answers.
2. Make sure `CLAUDE.md` contains `@AGENTS.md`. Create it with that line if it is missing.
3. Create the missing labels with the colors and meanings from [references/labels.md](references/labels.md): `gh label create "<name>" --color <color> --description "<meaning>"`.
4. Copy [references/requirements.schema.json](references/requirements.schema.json) next to the requirements file. Create the requirements file if it is missing, with `version: 1` and either `requirements: []` or the imported drafts. [references/requirements.example.yaml](references/requirements.example.yaml) shows the format.
5. Write `docs/architecture.md` unless an existing document was chosen, and create `docs/adr/` with a `.gitkeep`.
6. Add the CI workflow if the user accepted it.

## Rules

- Never change user content outside the xp markers.
- Never delete GitHub labels.
- Write in English unless the project's docs use another language.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-run` to kick off the first epic or milestone; in interview mode `xp-issues` to plan it.
