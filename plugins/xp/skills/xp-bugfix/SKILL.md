---
name: xp-bugfix
description: Fix a bug the disciplined way. Understand it, reproduce it with a failing test, find and fix the root cause, and prove it with the now passing test. Use when the user reports a bug, an error, a regression or broken behavior, says "fix #12" for a type:bug issue, or when xp-issues routes a bug. Hands over to xp-ship when done.
---

# xp-bugfix

A bug is fixed when a test that failed because of it now passes, and the cause is gone, not just the symptom.

## Before you start

Read the `## XP Workflow` section in `AGENTS.md`. If it is missing, run `xp-setup` first. If no issue exists for the bug yet, create one with `type:bug` (see `xp-issues`). Set it to `status:in-progress` and work on a branch: `git switch -c <n>-fix-<short-slug>`.

## Steps

1. **Understand.** Read the report, the logs and the code path end to end. Write down expected versus actual behavior. If the expected behavior is unclear and no requirement specifies it, ask (or use `needs-human`) instead of guessing.
2. **Reproduce with a test.** Write the smallest test that fails because of the bug, at the lowest level that still shows it. Name it after the affected criterion if there is one (`REQ-012.2 …`), otherwise after the issue (`#34 …`). Run it and confirm it fails for the reason in the report. If you cannot reproduce the bug, stop and report what you tried.
3. **Find the root cause.** Ask why until you reach the cause, not the symptom. Search for every caller of the code you are going to change. A fix in the shared place beats a guard in every caller.
4. **Fix.** Make the smallest change that removes the cause. Run the new test and then the whole suite.
5. **Look for siblings.** Check whether the same mistake exists elsewhere (same pattern, copy-pasted code). Fix the siblings in this PR with their own tests, or file issues for them.
6. **Commit.** `git commit -m "Fix <what> (Fixes #<n>[, REQ-NNN.N])"`.

Steps 2 to 4 are the red-green part of TDD. The same rules as in `xp-implement` apply: no fix without a failing test first.

## Done

Add a short comment on the issue stating the cause and the fix, then hand over to `xp-ship`.
