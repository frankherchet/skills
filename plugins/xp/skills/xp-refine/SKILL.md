---
name: xp-refine
description: Refine milestones, epics and issues until they meet the Definition of Ready, writing requirements and acceptance criteria into the project's requirements YAML. Works in interview mode (asks the user one question at a time) or autopilot mode (drafts from code and context, asks only what blocks). Also runs timeboxed spikes that end in an ADR. Use when the user says "refine", "groom the backlog", "make this ready", "write acceptance criteria", "spike", "investigate options", or when xp-issues routes an issue in status:refining or type:spike.
---

# xp-refine

Turn a vague ticket into one that someone could implement without asking questions.

## Before you start

Read the `## XP Workflow` section in `AGENTS.md` (Definition of Ready, requirements file, human gates). If it is missing, run `xp-setup` first. Read the issue, its comments, its epic and milestone, and the related code.

## Choose the mode

- **Interview** (default when the user is present): ask one question at a time and offer your proposed answer with each one, so the user can just confirm.
- **Autopilot** (when the user says "autopilot" or the work runs unattended): draft everything from the code, the docs and the issue history. Anything you cannot decide goes into `needs-human` with a comment. Autopilot never passes a human gate.

## Refine an issue

1. **Goal.** State in one or two sentences who wants what and why.
2. **Requirements.** Add entries to the requirements YAML or update existing ones:
   - Take the next free `REQ-NNN`: highest existing number + 1. Never reuse IDs.
   - Every acceptance criterion gets an ID `REQ-NNN.N` and is testable: concrete input, observable outcome, no "fast" or "user-friendly" without a number.
   - Cover the unhappy paths too: invalid input, empty states, permissions, failures of dependencies.
   - Set `status: accepted` when the user agrees (interview mode) or leave it at `draft` (autopilot mode).
   - Keep the file valid against its schema. Store no progress, issue numbers or test names in it.
3. **Link.** Put `Requirements: REQ-NNN.1, REQ-NNN.2` into the issue body.
4. **Size.** If it will not fit into one PR, split it into sub-issues (see `xp-issues`) and refine each one.
5. **Dependencies and risks.** List blocking issues. If a technical question is open, create a `type:spike` instead of guessing.
6. **Check the Definition of Ready** item by item. If everything holds, move the issue to `status:ready`. Epics need a human for that step (human gate).

For a bug: reproduction steps, expected and actual behavior, and the affected requirement IDs if there are any, are enough. No new requirement is needed unless the expected behavior was never specified.

## Refine a milestone or epic

Check that the goal is clear and that every child issue exists, has a type and priority and is in scope. Then refine the children by priority. Report which ones are ready and which are blocked and why.

## Spike mode

For `type:spike` or an open technical question:
1. Write down the question and a timebox (default: one session) in the issue.
2. Investigate: read docs and code, build a throwaway prototype outside `src/` if needed. Prototype code is not merged.
3. Write an ADR at `docs/adr/NNNN-kebab-title.md`:
   ```markdown
   # NNNN. Title
   Date: YYYY-MM-DD
   Status: proposed | accepted | superseded by NNNN

   ## Context
   ## Options considered
   ## Decision
   ## Consequences
   ```
4. A human accepts or rejects the ADR (`needs-human`). Afterwards, update the issues that depended on it and close the spike.

## Output

End with a short list: the issues that are now ready, those still blocked (with the reason), and the requirement IDs you added or changed.
