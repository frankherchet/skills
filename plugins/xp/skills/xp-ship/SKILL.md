---
name: xp-ship
description: Get finished work checked, merged and closed. Verifies tests, criteria traceability, scope, the code around the diff, simplicity, requirement ID collisions and the Definition of Done; opens the pull request and merges it when the project's merge policy allows agents to; then closes issues and epics and writes milestone release notes. Use when the user says "ship it", "open a PR", "is this done", "check the DoD", "release the milestone", or when xp-implement or xp-bugfix finish. Comes after xp-implement or xp-bugfix; hands over to xp-issues or, after a milestone, xp-retro.
metadata:
  version: "0.2.0"
  source: frankherchet/skills
---

# xp-ship

Work counts as done when it is checked, merged and closed, not when the code compiles.

**Loop:** setup → issues → refine → implement | bugfix → **ship** → retro

## Before you start

1. Read `## XP Workflow` in `AGENTS.md`. If it is missing, run `xp-setup` first.
2. Fetch the default branch: `git fetch origin <default>`.

## 1. Check

In this order. At the first failure, fix it or send it back to `xp-implement` or `xp-bugfix`, then start again.

1. **Tests.** Full suite and lint command from AGENTS.md; everything passes.
2. **Traceability.** Every criterion in the issue's `Requirements:` line has at least one test that names it:
   ```bash
   for id in REQ-012.1 REQ-012.2; do grep -rqF "$id" <test dirs> && echo "ok $id" || echo "MISSING $id"; done
   ```
   For a bug, a test names the issue (`#34`) or the affected criterion.
3. **Scope.** Compare `git diff origin/<default>...HEAD` with the issue. Flag changes no criterion asks for.
4. **Around the diff.** Breakage often hides in code the diff does not show. For every function, type, field, route, config key or file the diff changes, renames or deletes, find its users outside the diff (`git grep -n "<name>"`), read them and check they still work, including templates, serializers, migrations and docs. Then review the changed code itself: bugs, missing input checks, security, behavior under real load, risky logic without a test.
5. **Simplicity.** Check against "Reuse before you write" in `xp-implement`: new dependencies without a reason, code that rebuilds something the project or platform already has, leftover overbuilding. And the other direction: input checks, data-loss handling, security and accessibility must still be there.
6. **Requirement ID collisions.** Another branch may have taken the same new ID:
   ```bash
   for id in $(git diff origin/<default>...HEAD -- <requirements file> | grep -E '^\+ *- id: REQ-[0-9]{3,}$' | grep -oE 'REQ-[0-9]+'); do
     git show origin/<default>:<requirements file> | grep -qE "id: $id$" && echo "COLLISION $id"
   done
   ```
   Renumber each collision on this branch to a number free on both branches, and update the issue body and the tests.
7. **Definition of Done.** Every remaining item from AGENTS.md: docs, architecture, ADRs, project-specific items.

Report the result as a checklist.

## 2. Pull request

```bash
gh pr create --base <default> --title "<what>" --body "<body>"
```
The body has a summary, `Closes #<n>`, the criteria covered, how it was tested, and the check results. Set the issue to `status:review`.

## 3. Merge

Follow the merge policy in AGENTS.md:
- **agent:** when every check in step 1 passes and CI (if any) is green (`gh pr checks <pr>`), merge with the project's merge command. Never merge with a failing or skipped check, and never bypass branch protection.
- **human:** ask the user to review and merge, and say what deserves attention.

## 4. After the merge

- `Closes #<n>` closes the issue; remove its `status:*` label.
- Last open child of an epic: propose closing the epic.
- Last open issue of a milestone: continue with step 5.

## 5. Milestone release

1. Write release notes from the closed issues, grouped into Features, Fixes and Other, one line each with its issue number:
   `gh issue list --milestone "<title>" --state closed --json number,title,labels`
2. Ask the user to close the milestone (human gate) and, if the project tags releases, to confirm the tag: `gh release create <tag> --notes-file <file>`.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-retro` after a milestone, an epic or a bug with a process gap; otherwise `xp-issues` for the next issue.
