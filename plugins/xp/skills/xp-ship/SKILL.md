---
name: xp-ship
description: Check, review, merge and close finished work. Runs tests, traceability, scope and Definition of Done checks, opens the pull request, gets an independent review, merges, writes release notes. Use for "ship it", "open a PR", "is this done", "release the milestone", or after xp-implement or xp-bugfix.
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-ship

Work counts as done when it is checked, merged and closed, not when the code compiles.

**Loop:** setup → issues → refine → implement | bugfix → **ship** → retro

## Before you start

1. Follow `## XP Workflow` in `AGENTS.md`. Most hosts have loaded the file already; read it only if the section is not in your context. If the section does not exist, run `xp-setup` first.
2. Fetch the default branch: `git fetch origin <default>`.

## 1. Check

In this order. At the first failure, fix it or send it back to `xp-implement` or `xp-bugfix`, then start again. After 3 failed attempts at the same check, park the issue.

1. **Tests.** Full suite and lint command from AGENTS.md; everything passes. If the full suite already passed on this exact commit in this context, do not run it again; still run lint unless it too already passed on this commit.
2. **Traceability.** Every criterion in the issue's `Requirements:` line has at least one test that names it:
   ```bash
   for id in REQ-012.1 REQ-012.2; do grep -rqF "$id" <test dirs> && echo "ok $id" || echo "MISSING $id"; done
   ```
   For a bug, a test names the issue (`#34`) or the affected criterion.
3. **Scope.** Compare `git diff origin/<default>...HEAD` with the issue. Flag changes no criterion asks for.
4. **Around the diff.** Breakage often hides in code the diff does not show. For every function, type, field, route, config key or file the diff changes, renames or deletes, find its users outside the diff (`git grep -n "<name>"`), read them and check they still work, including templates, serializers, migrations and docs.
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

## 3. Review

Under merge policy `agent` no human reads the code before the merge, so a reviewer who did not write it has to: a subagent with fresh context that gets only the PR and issue numbers. Under policy `human` the human is the reviewer; skip this step. When `xp-run` drives, it starts the reviewer: stop after step 2. If the host has no subagents, review inline from `gh pr diff <pr>` alone.

The reviewer reads the issue, its criteria and `gh pr diff <pr>`, and checks:
- every criterion's test would fail if the behavior were missing: no test that only repeats the implementation, no assertion on mocks alone
- bugs, missing checks on outside input, security, data loss, behavior under real load
- risky logic without a test
- changes no criterion asks for

It replies `APPROVE`, or at most ten findings, each as `path:line — problem — what to do`. Blocking problems only: no style, no naming, nothing a linter reports.

Fix every finding test-first (`xp-implement` or `xp-bugfix`), repeat "1. Check", push, and have it reviewed again. If findings are left after two rounds, park the issue.

## 4. Merge

Follow the merge policy in AGENTS.md:
- **agent:** when every check in step 1 passes, the review says `APPROVE` and CI (if any) is green (`gh pr checks <pr> --watch` waits for it), merge with the project's merge command. A failing CI check is handled like a failed check in step 1. Never merge with a failing or skipped check, and never bypass branch protection. In autopilot and headless, do not merge a PR that touches a protected path (`gh pr diff <pr> --name-only`): park its issue with the question "merge PR #<pr>?".
- **human:** in interview mode ask the user to review and merge, and say what deserves attention. In autopilot park the issue with the same note.

## 5. After the merge

- `Closes #<n>` closes the issue; remove its `status:*` label.
- Last open child of an epic: close the epic (`gh issue close <epic>`).
- Links to files in comments point at the default branch (`blob/<default>/<path>`); the merged branch is gone. Check your own comments on the issue and fix links to the old branch.
- Last open issue of a milestone: continue with step 6.

## 6. Milestone release

1. Write release notes from the closed issues, grouped into Features, Fixes and Other, one line each with its issue number:
   `gh issue list --milestone "<title>" --state closed --json number,title,labels`
2. Closing the milestone is a human gate, and so is the release tag if the project tags releases (`gh release create <tag> --notes-file <file>`). In interview mode ask the user; in autopilot put both under "Waiting on a human" in the hand-over, with the release notes.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-retro` after a milestone, an epic or a bug with a process gap; otherwise `xp-issues` for the next issue. When `xp-run` drives, it runs the retro once at the end of the run.
