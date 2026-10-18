---
name: xp-implement
description: Build a ready feature issue test-first, one criterion at a time. An acceptance test per criterion comes first, then small red-green-refactor steps inside it, preferring reuse over new code; every test names its criterion ID. Use when the user says "implement #12", "build this feature", "TDD this", or when xp-issues routes a type:feature issue. Comes after xp-issues; hands over to xp-ship.
---

# xp-implement

Build exactly what the criteria ask for, test first, with as little new code as possible.

**Loop:** setup → issues → refine → **implement** | bugfix → ship → retro

## Before you start

1. Read `## XP Workflow` in `AGENTS.md`. If it is missing, run `xp-setup` first.
2. Read the issue, its `Requirements:` line and those criteria in the requirements file. If the criteria only exist in a trusted refinement block, write them into the requirements file first (next free IDs). If the issue does not meet the Definition of Ready, stop and propose `xp-refine`.
3. Check that the issue is `status:in-progress` and assigned, and work on a branch: `git switch -c <n>-<short-slug>`. In headless mode the runner has already prepared the worktree and owns all git and GitHub steps.
4. Run the full test suite. If it is already red, report that before you change anything.
5. Read the code the issue touches and follow one real request or call through it. Knowing where a change belongs matters more than how small it is.

## Build one criterion at a time

**Outer loop: the acceptance test.** For the next criterion `REQ-NNN.N`:
1. Write one test at the level a user or caller sees: an HTTP request, a CLI call, a public API, or a UI test if the project has them. The criterion ID goes into the test name, or into a comment right above it if names cannot hold it:
   `test("REQ-012.1 link expires after 15 minutes", …)`
2. Run it and see it fail for the right reason: a failed assertion, not an import or syntax error. It stays red while the inner loop runs.

**Inner loop: small steps** until the acceptance test passes:
1. **Red.** Write the smallest unit test for the next bit of behavior. See it fail.
2. **Green.** Make it pass with as little new code as possible (see "Reuse before you write").
3. **Refactor.** Remove duplication and overbuilding, improve names, keep every test green. No new behavior.

When the acceptance test passes, run the full suite and commit: `git commit -m "<what> (Refs #<n>, REQ-NNN.N)"`. Then take the next criterion. If a criterion is so small that its acceptance test is already a unit test, the loops merge into one.

## Reuse before you write

Every new line has to be read, tested and maintained. Before writing code, go through these questions in order and stop at the first yes:

1. **No criterion needs it?** Then it is out of scope; do not write it.
2. **Does the project already have it?** Search for a function, type, component or convention and use it.
3. **Do the language, runtime or platform provide it?** Standard library, framework, browser, OS or database features.
4. **Does a dependency the project already declares provide it?** Use it. A new dependency needs a reason in the PR description.
5. Otherwise write new code, only as much as the failing test demands.

Overbuilding to remove when you refactor: interfaces or base classes with one implementation, settings nobody changes, code no test runs, files prepared for later issues.

**Small is not careless.** These always stay in, even if they make the change bigger: checks on input from outside the system, handling of errors that could lose or corrupt data, security, and accessibility. If a criterion seems to conflict with them, ask.

## Rules

- No production code without a failing test that asks for it.
- One behavior per test; test through public interfaces.
- Never widen the scope quietly. Missing behavior becomes an issue comment or a new issue.
- An unclear or wrong criterion: stop, comment on the issue, add the decision label, or go back to `xp-refine`.
- Structural changes update the architecture doc named in AGENTS.md or get an ADR.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-ship #<n>` once every criterion has a passing test.
