---
name: xp-implement
description: Implement a ready GitHub issue with test-driven development (red, green, refactor), one acceptance criterion at a time, with every test named after its requirement ID for traceability. Use when the user says "implement #12", "build this feature", "TDD this", or when xp-issues routes a type:feature issue. Hands over to xp-ship when done.
---

# xp-implement

Build exactly what the issue asks for, test first.

## Before you start

1. Read the `## XP Workflow` section in `AGENTS.md`. If it is missing, run `xp-setup` first.
2. Read the issue, its `Requirements:` line and those entries in the requirements YAML. If the issue is not `status:ready`, stop and suggest `xp-refine`.
3. Make sure the issue is `status:in-progress` and assigned. Work on a branch: `git switch -c <n>-<short-slug>`.
4. Run the full test suite once. If it is already red, report that before changing anything.

## The loop

Repeat for every acceptance criterion `REQ-NNN.N` of the issue:

1. **Red.** Write one test for the criterion. Put the criterion ID in the test name, or in a comment directly above the test if the framework does not allow it in names:
   `test("REQ-012.1 link expires after 15 minutes", …)`
   Run it and watch it fail for the right reason (an assertion fails, not an import or syntax error).
2. **Green.** Write the simplest code that makes it pass. Run the whole suite.
3. **Refactor.** Remove duplication and improve names while every test stays green. No new behavior in this step.
4. **Commit.** `git commit -m "<what> (Refs #<n>, REQ-NNN.N)"`.

Then move on to the next criterion.

## Rules

- No production code without a failing test that demands it.
- One behavior per test. Test through public interfaces, not internals.
- Do not build what no criterion asks for. If you find something missing, add a comment to the issue or create a new issue. Do not quietly extend the scope.
- If a criterion turns out to be ambiguous or wrong, stop, comment on the issue, and add `needs-human` (or go back to `xp-refine`).
- Update `docs/architecture.md` or write an ADR when the structure changes.

## Done

When every criterion of the issue has a passing test, hand over to `xp-ship`.
