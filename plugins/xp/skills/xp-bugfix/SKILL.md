---
name: xp-bugfix
description: Fix a bug so it stays fixed. Understand it, reproduce it with a failing test, fix the cause rather than the symptom, look for the same mistake elsewhere, and trace back to the gap in the process that let it in. Use when the user reports a bug, an error, a regression or broken behavior, says "fix #12" for a type:bug issue, or when xp-issues routes a bug or a red default branch. Comes after xp-issues; hands over to xp-ship.
metadata:
  version: "0.2.0"
  source: frankherchet/skills
---

# xp-bugfix

A bug is fixed when a test that failed because of it passes, its cause is gone, and the process gap that let it in is named.

**Loop:** setup → issues → refine → implement | **bugfix** → ship → retro

## Before you start

1. Read `## XP Workflow` in `AGENTS.md`. If it is missing, run `xp-setup` first.
2. If there is no issue yet, create a `type:bug` issue (`xp-issues`). Set it to `status:in-progress` and work on a branch: `git switch -c <n>-fix-<short-slug>`.

## Steps

1. **Understand.** Read the report, the logs and the code path end to end. Write down expected and actual behavior. If the expected behavior is unclear and no criterion defines it, ask (or use the decision label) instead of guessing.
2. **Reproduce.** Write the smallest test that fails because of the bug, on the lowest level that still shows it. Name it after the affected criterion (`REQ-012.2 …`) or, if there is none, after the issue (`#34 …`). Confirm it fails for the reported reason. If you cannot reproduce the bug, stop and report what you tried.
3. **Find the cause.** Keep asking why until you reach the cause, not the symptom. Find every caller of the code you are about to change; if several are affected, fix the shared code once instead of each caller.
4. **Fix.** The smallest change that removes the cause, following "Reuse before you write" in `xp-implement`. Run the new test, then the full suite.
5. **Same mistake elsewhere?** Look for the same pattern or copied code. Fix those places in this PR with their own tests, or file issues for them.
6. **Commit:** `git commit -m "Fix <what> (Fixes #<n>[, REQ-NNN.N])"`.
7. **Process gap.** Ask why the bug could get in at all, and keep asking until the answer is a gap in how the team works, not in the code. Example: no criterion covered the case → the Definition of Ready does not ask for failure conditions. Propose one concrete change that closes the gap: a Definition of Ready or Done item, a lint rule, a missing kind of test, or an instruction in an xp-* skill. Do not make that change yourself; `xp-retro` decides.

Steps 2 to 4 follow the same test-first rule as `xp-implement`: no fix without a failing test.

## Hand-over

Comment on the issue: cause, fix, the why-chain and the proposed process change (`xp-retro` collects these). Then end with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-ship #<n>`.
