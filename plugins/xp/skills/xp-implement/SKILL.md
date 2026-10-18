---
name: xp-implement
description: Implement a ready GitHub issue with test-driven development, one acceptance criterion at a time. A failing acceptance test comes first, then red-green-refactor unit tests inside it, with every test named after its requirement ID for traceability. Use when the user says "implement #12", "build this feature", "TDD this", or when xp-issues routes a type:feature issue. Hands over to xp-ship when done.
---

# xp-implement

Build exactly what the issue asks for, test first.

## Before you start

1. Read the `## XP Workflow` section in `AGENTS.md`. If it is missing, run `xp-setup` first.
2. Read the issue, its `Requirements:` line and those entries in the requirements YAML. If the issue is not `status:ready`, stop and suggest `xp-refine`.
3. Make sure the issue is `status:in-progress` and assigned. Work on a branch: `git switch -c <n>-<short-slug>`.
4. Run the full test suite once. If it is already red, report that before changing anything.

## The double loop

Repeat for every acceptance criterion `REQ-NNN.N` of the issue.

**Outer loop: the acceptance test defines done.**
1. Write one acceptance test for the criterion, at the level a user or caller sees: an HTTP request, a CLI call, a public API, or a UI test if the project has them. Put the criterion ID in the test name, or in a comment directly above the test if the framework does not allow it in names:
   `test("REQ-012.1 link expires after 15 minutes", …)`
2. Run it and watch it fail for the right reason (an assertion fails, not an import or syntax error). It stays red while the inner loop runs.

**Inner loop: red, green, refactor in small steps** until the acceptance test passes:
1. **Red.** Write the smallest unit test for the next piece of behavior the acceptance test needs. Watch it fail.
2. **Green.** Write the simplest code that makes it pass.
3. **Refactor.** Remove duplication and improve names while every test stays green. No new behavior in this step.

When the acceptance test passes, run the whole suite, then **commit**: `git commit -m "<what> (Refs #<n>, REQ-NNN.N)"`. Move on to the next criterion.

If the criterion is small enough that the acceptance test is already a unit test, the two loops collapse into one.

## Rules

- No production code without a failing test that demands it.
- One behavior per test. Test through public interfaces, not internals.
- Do not build what no criterion asks for. If you find something missing, add a comment to the issue or create a new issue. Do not quietly extend the scope.
- If a criterion turns out to be ambiguous or wrong, stop, comment on the issue, and add `needs-human` (or go back to `xp-refine`).
- Update `docs/architecture.md` or write an ADR when the structure changes.

## Done

When every criterion of the issue has a passing test, hand over to `xp-ship`.
