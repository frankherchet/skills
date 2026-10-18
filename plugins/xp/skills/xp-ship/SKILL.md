---
name: xp-ship
description: Get finished work merged and closed in the issue-driven XP workflow. Checks the Definition of Done, acceptance criteria and requirements traceability, catches requirement ID collisions, opens the pull request, and after the merge closes issues and epics and writes release notes for a milestone. Use when the user says "ship it", "open a PR", "is this done", "check the DoD", "release the milestone", or when xp-implement or xp-bugfix finish.
---

# xp-ship

Nothing counts as done until it is checked, merged and closed.

## Before you start

Read the `## XP Workflow` section in `AGENTS.md` (Definition of Done, human gates, requirements file). If it is missing, run `xp-setup` first.

## 1. Check

Go through it in this order and stop at the first failure. Fix the failure (or send it back to `xp-implement`/`xp-bugfix`) before you go on.

1. **Tests.** Run the full suite and the lint command from AGENTS.md. Everything must pass.
2. **Traceability.** For every criterion ID in the issue's `Requirements:` line, at least one test must contain the ID:
   ```bash
   for id in REQ-012.1 REQ-012.2; do grep -rqF "$id" <test dirs> && echo "ok $id" || echo "MISSING $id"; done
   ```
   For a bug, a test must name the issue (`#34`) or the affected criterion.
3. **Scope.** Compare the diff (`git diff origin/<default>...HEAD`) with the issue. Flag changes that no criterion asks for.
4. **Beyond the diff.** Most breakage sits in code the diff does not show. For every function, type, field, route, config key or file the diff changes, renames or deletes, search for its users outside the diff (`git grep -n "<name>"`) and read them. Check that they still work, including untouched files, templates, serializers, migrations and docs. Then look at the changed code itself for bugs, missing input validation, security holes, behavior under real load, and risky logic without a test.
5. **Overbuilding.** Flag what the ladder in `xp-implement` would have avoided: new dependencies, abstractions with one implementation, configuration nobody changes, re-implementations of something already in the codebase or standard library, and scaffolding for later. Also confirm that no guardrail was cut: validation at trust boundaries, data-loss handling, security, accessibility.
6. **Requirement ID collisions.** Another branch may have taken the same new ID in the meantime:
   ```bash
   git fetch origin <default>
   for id in $(git diff origin/<default>...HEAD -- <requirements file> | grep -E '^\+ *- id: REQ-[0-9]{3,}$' | grep -oE 'REQ-[0-9]+'); do
     git show origin/<default>:<requirements file> | grep -qE "id: $id$" && echo "COLLISION $id"
   done
   ```
   Renumber each collision on this branch to the next number that is free on both branches, and update the issue body and the tests.
7. **Definition of Done.** Go through every remaining item in AGENTS.md: docs, architecture, ADRs and anything project-specific.

Report the result as a checklist.

## 2. Pull request

```bash
gh pr create --base <default> --title "<what>" --body "<body>"
```
The body contains a summary, `Closes #<n>`, the criterion IDs covered, how it was tested, and the DoD checklist. Set the issue to `status:review`.

Merging is a human gate. Do not merge. Ask the human to review and merge, and tell them what to look at.

## 3. After the merge

- The `Closes #<n>` line closes the issue. Remove its `status:*` label.
- If it was the last open child of an epic, propose closing the epic (human gate for epics).
- If it was the last open issue of a milestone, go to step 4.

## 4. Milestone release

When every issue in a milestone is closed:
1. Write release notes from the closed issues, grouped into Features, Fixes and Other, one line each with its issue number:
   `gh issue list --milestone "<title>" --state closed --json number,title,labels`
2. Ask the human to close the milestone and, if the project tags releases, to confirm the tag (`gh release create <tag> --notes-file <file>`).
3. Suggest `xp-retro` for the milestone.
