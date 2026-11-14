---
name: xp-implement
description: Build a ready feature issue test-first with one acceptance test per criterion, small steps and reuse before new code. Use for "implement issue 12", "build this feature", "TDD this", or a ready type:feature issue.
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-implement

Build exactly what the criteria ask for, test first, with as little new code as possible.

**Loop:** setup → issues → refine → **implement** | bugfix → ship → retro

## Before you start

1. Follow `## XP Workflow` in `AGENTS.md`. Most hosts have loaded the file already; read it only if the section is not in your context. If the section does not exist, run `xp-setup` first.
2. Read the issue and its `Requirements:` line, and look those criteria up by ID in the requirements file (do not read the whole file). If the criteria only exist in a refinement block (an issue comment starting with `<!-- xp:refinement -->` from a trusted account), write them into the requirements file first, with the next free IDs and status `accepted`. If the issue does not meet the Definition of Ready, run `xp-refine` on it first (in interview mode, propose it).
3. Check that the issue is `status:in-progress` and assigned, and work on its branch. `git fetch origin`, then `git switch <n>-<short-slug> && git merge origin/<default>` if `xp-refine` already created the branch, otherwise `git switch -c <n>-<short-slug> origin/<default>`. In headless mode the runner has already prepared the worktree and owns all git and GitHub steps.
4. Make sure the default branch is green: its latest CI run (`gh run list --branch <default> --limit 1`), or without CI one run of the test command before your first change. If it is red, put the issue back to `status:ready` and fix the default branch first with `xp-bugfix` ("Fix the default branch first" in AGENTS.md).
5. Read the code the issue touches and follow one real request or call through it. Knowing where a change belongs matters more than how small it is.

## Build one criterion at a time

For the next criterion `REQ-NNN.N`:

1. **Acceptance test.** Write one test at the level a user or caller sees: an HTTP request, a CLI call, a public API, or a UI test if the project has them. The criterion ID goes into the test name, or into a comment right above it if names cannot hold it:
   `test("REQ-012.1 link expires after 15 minutes", …)`
2. **See it fail** for the right reason: a failed assertion, not an import or syntax error. Run only this test.
3. **Make it pass** with as little new code as possible (see "Reuse before you write"). If one small change does it, make it. If not, take small steps: a unit test for the next bit of behavior (red), the code for it (green), and again until the acceptance test passes. Run only the tests you are working on.
4. **Refactor.** Remove duplication and overbuilding, improve names, keep the tests green. No new behavior.
5. Run the test files you touched and commit: `git commit -m "<what> (Refs #<n>, REQ-NNN.N)"`.

After the last criterion, run the full suite once. `xp-ship` does not repeat it for the same commit.

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
- An unclear or wrong criterion: go back to `xp-refine` if code, docs or issue history answer it; otherwise comment on the issue, add the decision label and continue with the next issue.
- Structural changes update the architecture doc named in AGENTS.md or get an ADR.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. **Next:** `xp-ship #<n>` once every criterion has a passing test.
