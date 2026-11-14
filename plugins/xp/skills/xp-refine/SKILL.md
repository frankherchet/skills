---
name: xp-refine
description: Make issues ready to build. Works out stakeholder interests and failure conditions, writes testable criteria into the requirements file, maps epics, and runs spikes that end in an ADR. Use for "refine", "groom the backlog", "write acceptance criteria", "spike", or a status:refining issue.
metadata:
  version: "0.4.0"
  source: frankherchet/skills
---

# xp-refine

Turn a vague issue into one that can be built without further questions.

**Loop:** setup → issues → **refine** → implement | bugfix → ship → retro

## Before you start

1. Follow `## XP Workflow` in `AGENTS.md`. Most hosts have loaded the file already; read it only if the section is not in your context. If the section does not exist, run `xp-setup` first.
2. Read the issue, its comments, its epic and milestone, and the code it touches.
3. Use the default mode from AGENTS.md unless the user asks for another.
4. Interview mode: go through every step with a proposed answer first, then ask all open questions in one batch. Autopilot: never ask. What code, docs and issue history cannot answer becomes a question with a proposed answer, and the criteria are written as if the proposal were accepted.
5. Commit what you write, never leave it in the working tree: in a kickoff on the kickoff branch (`xp-run`), otherwise on the issue's own branch (`git fetch origin && git switch -c <n>-<short-slug> origin/<default>`, commit `Refine #<n> (REQ-NNN)`, push). `xp-implement` continues on that branch.

## Refine a feature

1. **Goal and interests.** State in one or two sentences who wants what and why, and check that it is a feature goal. Then list everyone with a stake in the result, not only the user (operations, support, the business, privacy), and the interest each one needs protected or satisfied.
2. **Failure conditions before solutions.** List everything that can go wrong first (bad input, empty data, missing rights, timeouts, failing services, parallel changes) and only then decide on outcomes. Keep a condition only if the system can notice it (or a check can make it noticeable) and an interest depends on the reaction. Give each kept condition one outcome:
   - **back on track:** handle it and continue the normal flow
   - **try again:** let the actor or the system repeat the step
   - **different success:** reach the goal another way
   - **safe stop:** end without the goal, with every interest protected
3. **Criteria.** Write them into the requirements file:
   - New requirements take the next free number, highest `REQ-NNN` + 1 (`grep -oE '^ *- id: REQ-[0-9]+$' <requirements file> | grep -oE '[0-9]+' | sort -n | tail -1`). IDs are never reused.
   - One criterion `REQ-NNN.N` per testable statement: concrete input, observable result, numbers instead of "fast" or "easy".
   - Criteria for the normal flow and for every kept failure condition.
   - Check: the normal flow satisfies every interest, and every failure outcome protects them.
   - Remove criteria that serve no interest. Each one costs code, tests and maintenance.
   - `status: accepted` once the user agrees, when a kickoff is approved, or when the criteria come from a trusted refinement block; otherwise `draft`. A `draft` criterion is never built: in autopilot outside a kickoff, park the issue with the question "accept these criteria?" and the criteria in the comment.
   - The file stays valid against its schema and never records progress, issue numbers or test names.
4. **Link** with `Requirements: REQ-NNN.1, REQ-NNN.2` in the issue body.
5. **Size.** If it does not fit into one PR, split it into sub-issues (`xp-issues`) and refine each one.
6. **Dependencies and unknowns.** Name blocking issues. For an open technical question, create a `type:spike` instead of guessing.
7. **Definition of Ready.** Check every item. If all hold, move the issue to `status:ready`.

## Refinement from elsewhere

If the issue has a refinement block from a trusted account ([references/refinement-block.md](references/refinement-block.md)), start from it instead of from scratch: check it against the Definition of Ready, turn its criteria into requirement entries, and ask only about what is missing. When the user wants to refine with another assistant, for example by voice, give them the block format from that file so the result comes back in that form.

## Refine a bug

Steps to reproduce, expected and actual behavior, and the affected criteria if any. A new requirement is only needed when the expected behavior was never specified.

## Refine an epic or milestone

1. Check that the goal is clear and is an epic goal.
2. **Goal map:** list every actor (people, roles, external systems) in scope and the feature goals each one has. Every feature goal needs a feature issue, and every feature issue must belong to a feature goal. Create the missing issues; flag the rest as out of scope or as a hint at a missing actor.
3. Make sure every child has a type and priority, then refine the children in priority order.
4. Moving an epic to `status:ready` is a human gate: it approves the kickoff (`xp-run`).

## Spike

For `type:spike` or an open technical question:
1. Write the question and a timebox (default: one session) into the issue.
2. Investigate: docs, code, and if needed a throwaway prototype outside `src/` that is never merged.
3. Record the answer as an ADR in `docs/adr/NNNN-kebab-title.md`:
   ```markdown
   # NNNN. Title
   Date: YYYY-MM-DD
   Status: proposed | accepted | superseded by NNNN

   ## Context
   ## Options considered
   ## Decision
   ## Consequences
   ```
4. Accepting the ADR is a human decision: in a kickoff it is part of the approval, otherwise park the spike. Afterwards, update the issues that depend on it and close the spike.
5. Link files in issue and PR comments on the default branch (`blob/<default>/<path>`), never on the spike branch: it is deleted on merge. If the file is not on the default branch yet, name the path without a link or comment after the merge.

## Hand-over

End with the hand-over from `## XP Workflow` in AGENTS.md. List the issues that are now ready, the ones still blocked and why, and the requirement IDs you added or changed. **Next:** `xp-issues` to pick the next issue.
